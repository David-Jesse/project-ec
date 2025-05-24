import { revalidatePath } from "next/cache";
import { createCheckoutSession } from "../stripe";
import prisma from "../db/prisma";

export async function handleCheckout(cartId: string) {
  try {
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

    if (!cart || !cart.item || !cart.item.length) {
      throw new Error("Cart is empty or does not exist.");
    }

    // Format the items for stripe
    const items = cart.item.map((item) => ({
      product: {
        name: item.product.name,
        description: item.product.description || "",
        price: item.product.price,
        imageUrl: item.product.imageUrl,
      },
      quantity: item.quantity,
    }));

    const { url } = await createCheckoutSession(
      cartId,
      items,
      cart.user?.id || "",
    );

    if (!url) {
      throw new Error("Failed to create checkout session.");
    }

    // Redirects User to Stripe Checkout
    return { redirect: url };
  } catch (error) {
    console.error("Checkout error:", error);
    throw new Error("Checkout failed! Please try again");
  }
}

export async function setProductQuantity(
  cartId: string,
  itemId: string,
  quantity: number
) {
  try {
    if (quantity < 1) {
      await prisma.cart.update({
        where: { id: cartId },
        data: {
          item: {
            delete: {
              id: itemId,
            },
          },
        },
      });
    } else {
      await prisma.cart.update({
        where: { id: cartId },
        data: {
          item: {
            update: {
              where: {
                id: itemId,
              },
              data: {
                quantity,
              },
            },
          },
        },
      });
    }
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return { success: false, error: "Failed to update quantity" };
  }
}
