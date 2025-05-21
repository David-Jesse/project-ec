import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/db/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { cartId } = await req.json();

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

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    metadata: { cartId },
    automatic_payment_methods: { enabled: true },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
