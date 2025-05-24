import prisma from "@/lib/db/prisma";

interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
}

interface CreateOrderParams {
  userId?: string | null;
  items: OrderItemInput[];
  total: number;
  paymentId?: string;
  shipping?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  billing?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  user: string;
}

export async function createOrder({
  userId,
  items,
  total,
  paymentId,
  shipping,
  billing,
}: CreateOrderParams) {
  return await prisma.$transaction(async (prisma) => {
    const order = await prisma.order.create({
      data: {
        userId: userId || "",
        total,
        paymentId,
        status: paymentId ? "PAID" : "PENDING",
        billing,
        shipping,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        User: true,
      },
    });

    // First, find all carts for the user
    const carts = await prisma.cart.findMany({
      where: { userId },
      select: { id: true },
    });

    // Then, delete all items for each cart
    for (const cart of carts) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return order;
  });
}
