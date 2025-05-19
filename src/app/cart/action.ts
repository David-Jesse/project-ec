"use server";

import { getCart, createCart } from "@/lib/db/cart";
import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

const setProductQuantity = async (productId: string, quantity: number) => {
  const cart = (await getCart()) ?? (await createCart());

  const articleInCart = cart.item.find((item) => item.productId === productId);

  if (quantity === 0) {
    if (articleInCart) {
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          item: {
            delete: { id: articleInCart.id },
          },
        },
      });
    }
  } else if (articleInCart) {
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        item: {
          update: {
            where: { id: articleInCart.id },
            data: { quantity },
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
            quantity,
          },
        },
      },
    });
  }

  revalidatePath("/cart");
};

export default setProductQuantity;
