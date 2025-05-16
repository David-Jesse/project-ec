import prisma from "@/lib/db/prisma";
import { cookies } from "next/headers";
import { Prisma } from "@/generated/prisma";

export type CartWithProducts = Prisma.CartGetPayload<{
  include: {
    item: {
      include: {
        product: true;
      };
    };
  };
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: {
    product: true;
  };
}>;

export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};

export const createCart = async (): Promise<ShoppingCart> => {
  const newCart = await prisma.cart.create({
    data: {},
  });

  (await cookies()).set("cartId", newCart.id);

  return {
    ...newCart,
    item: [],
    size: 0,
    subtotal: 0,
  };
};

export const getCart = async (): Promise<ShoppingCart | null> => {
  const localCartId = (await cookies()).get("cartId")?.value;

  const cart = localCartId
    ? await prisma.cart.findUnique({
        where: {
          id: localCartId,
        },
        // includes the cart items, and also includes the product
        include: { item: { include: { product: true } } },
      })
    : null;

  if (!cart) {
    return null;
  }

  return {
    ...cart,
    size: cart.item.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: cart.item.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    ),
  };
};
