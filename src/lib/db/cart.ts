import prisma from "@/lib/db/prisma";
import { cookies } from "next/headers";
import { Prisma } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Cart, CartItem } from "@/generated/prisma";

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
  const session = await getServerSession(authOptions);
  let newCart: Cart;

  if (session) {
    newCart = await prisma.cart.create({
      data: {
        userId: session.user.id,
      },
    });
  } else {
    newCart = await prisma.cart.create({
      data: {},
    });

    (await cookies()).set("cartId", newCart.id);
  }

  return {
    ...newCart,
    item: [],
    size: 0,
    subtotal: 0,
  };
};

export const getCart = async (): Promise<ShoppingCart | null> => {
  const session = await getServerSession(authOptions);

  let cart: CartWithProducts | null = null;

  if (session) {
    cart = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
      },
      // includes the cart items, and also includes the product
      include: { item: { include: { product: true } } },
    });
  } else {
    const localCartId = (await cookies()).get("cartId")?.value;

    cart = localCartId
      ? await prisma.cart.findUnique({
          where: {
            id: localCartId,
          },
          // includes the cart items, and also includes the product
          include: { item: { include: { product: true } } },
        })
      : null;
  }

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

export async function mergeAnonymousCartIntoUserCart(userId: string) {
  const localCartId = (await cookies()).get("cartId")?.value;

  const localCart = localCartId
    ? await prisma.cart.findUnique({
        where: {
          id: localCartId,
        },
        // includes the cart items, and also includes the product
        include: { item: true },
      })
    : null;

  if (!localCart) {
    return;
  }

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { item: true },
  });

  await prisma.$transaction(async tx => {
    if (userCart) {
      const mergedCartItems = mergeCartItems(localCart.item, userCart.item);

      await tx.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });

      await tx.cartItem.createMany({
        data: mergedCartItems.map((item) => {
          return {
            cartId: userCart.id,
            productId: item.productId,
            quantity: item.quantity,
          };
        }),
      });
    } else {
      await tx.cart.create({
        data: {
          userId,
          item: {
            createMany: {
              data: localCart.item.map((item) => {
                return {
                  productId: item.productId,
                  quantity: item.quantity,
                };
              }),
            },
          },
        },
      });
    }

    await tx.cart.deleteMany({
      where: { id: localCart.id },
    });

    const cookieStore = await cookies();
    cookieStore.set("localCartId", "");
  });
}
{
}

function mergeCartItems(...cartItems: CartItem[][]) {
  return cartItems.reduce((acc, items) => {
    items.forEach((item) => {
      const exisitingItem = acc.find((i) => i.productId === item.productId);
      if (exisitingItem) {
        exisitingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
}
