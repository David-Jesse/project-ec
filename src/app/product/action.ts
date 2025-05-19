"use server";

import prisma from "@/lib/db/prisma";
import { getCart, createCart } from "@/lib/db/cart";
import { revalidatePath } from "next/cache";

export const incrementProductQuantity = async (productId: string) => {
  const cart = (await getCart()) ?? (await createCart());

  const articleInCart = cart.item.find((item) => item.productId === productId);

  if (articleInCart) {
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        item: {
          update: {
            where: { id: articleInCart.id },
            data: {
              quantity: {
                increment: 1,
              },
            },
          },
        },
      },
    });
  } else {
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        item: {
          create: {
            productId,
            quantity: 1,
          },
        },
      },
    });
  }

  revalidatePath("/product/[id]");
};
