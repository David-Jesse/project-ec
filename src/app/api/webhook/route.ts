import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/db/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Webhook Error: ${errorMessage}`);
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const { cartId, userId } = session.metadata || {};

      if (!cartId || !userId) {
        throw new Error("Missing cart or user information");
      }

      await createOrderFromCart(cartId, userId, session.id);

      return new NextResponse(JSON.stringify({ recieved: true }), {
        status: 200,
      });
    } catch (error) {
      console.error("Error processing checkout session:", error);
      return new NextResponse("Error processing checkout session", {
        status: 500,
      });
    }
  }

  return new NextResponse(JSON.stringify({ recieved: true }), {
    status: 200,
  });
}

async function createOrderFromCart(
  cartId: string,
  userId: string,
  paymentId: string
) {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      item: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || !cart.item || cart.item.length === 0) {
    throw new Error("Cart not found or is empty");
  }

  const total = cart.item.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        paymentId,
        total,
        status: "PAID",
        items: {
          create: cart.item.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    await tx.cartItem.deleteMany({
      where: { cartId },
    });

    return order;
  });
}