import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db/prisma";
import { createOrder } from "@/lib/order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { paymentMethodId, cartId, billingDetails } = await request.json();

    if (!paymentMethodId || !cartId) {
      return NextResponse.json(
        { error: "Missing required fields: paymentMethodId or cartId" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        item: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!cart || !cart.item.length) {
      return NextResponse.json(
        { error: "Cart not found or empty" },
        { status: 404 }
      );
    }

    const amount = cart.item.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    const amountInCents = Math.round(amount * 100);

    // Validate Amount
    if (amountInCents < 50) {
      return NextResponse.json(
        { error: "Amount must be at least $0.50" },
        { status: 400 }
      );
    }

    console.log("Creating payment intent with amount:", amountInCents);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      payment_method: paymentMethodId,
      confirmation_method: "manual",
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_URL}/orders?payment_success=true&cart_id=${cartId}`,
      metadata: {
        cartId: cartId,
        userId: cart.userId || "anonymous",
      },
      shipping: billingDetails?.address
        ? {
            name: billingDetails.name,
            phone: billingDetails.phone || "",
            address: {
              line1: billingDetails.address.line1,
              line2: billingDetails.address.line2,
              city: billingDetails.address.city,
              state: billingDetails.address.state,
              postal_code: billingDetails.address.postal_code,
              country: billingDetails.address.country,
            },
          }
        : undefined,
    });
    console.log("Payment intent status:", paymentIntent.status);

    if (paymentIntent.status === "succeeded") {
      const orderItems = cart.item.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }));

      try {
        const order = await createOrder({
          userId: cart.userId,
          user: cart.user ? cart.user.id : cart.userId || "",
          items: orderItems,
          total: amount,
          paymentId: paymentIntent.id,
          billing: billingDetails?.address,
          shipping: billingDetails?.address
            ? {
                address: billingDetails.address.line1,
                city: billingDetails.address.city,
                postalCode: billingDetails.address.postal_code,
                country: billingDetails.address.country,
              }
            : undefined,
        });

        // Clear the cart after successful order creation
        await prisma.cartItem.deleteMany({
          where: { cartId: cartId },
        });

        return NextResponse.json({
          success: true,
          orderId: order.id,
          paymentStatus: "PAID",
          paymentIntentId: paymentIntent.id,
          redirectUrl: `/orders?payment_success=true&order_id=${order.id}`,
        });
      } catch (orderError) {
        console.error("Order creation failed", orderError);
        return NextResponse.json(
          {
            error:
              "Payment succeeded but order creation failed. Please contact support.",
          },
          { status: 500 }
        );
      }
    }

    if (paymentIntent.status === "requires_action") {
      return NextResponse.json({
        requiresAction: true,
        client_secret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    }

    if (paymentIntent.status === "requires_confirmation") {
      return NextResponse.json({
        requiresAction: true,
        client_secret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    }

    return NextResponse.json(
      {
        error: `Payment processing failed. Status: ${paymentIntent.status}`,
        status: paymentIntent.status,
      },
      { status: 400 }
    );
  } catch (err) {
    console.error("Stripe charge error:", err);

    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: err.message || "Stripe Processing failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Payment processing failed",
      },
      { status: 500 }
    );
  }
}
