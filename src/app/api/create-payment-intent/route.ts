import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  // Add authentication check
  // const session = await getServerSession();
  // if (!session?.user) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

   const { cartId } = await req.json();
  
  // Add input validation
  if (!cartId || typeof cartId !== 'string') {
    return NextResponse.json({ error: "Valid cart ID is required" }, { status: 400 });
  }

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

  if (!cart || !cart.item.length) {
    return NextResponse.json({ error: "Cart not found" }, { status: 400 });
  }

  const amount = cart.item.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Validated amount
  const amountInCents = Math.round(amount * 100);
  if (amountInCents < 50) {
    return NextResponse.json(
      { error: "Minimum payment is $0.50" },
      { status: 400 }
    );
  }

  // Create Payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    metadata: { cartId, userId: cart.userId },
    automatic_payment_methods: { enabled: true },
    description: `Purchase from Cart ${cartId}`,
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    amount: amountInCents,
    currency: "usd",
  });
}
