import { getCart } from "@/lib/db/cart";
import CartEntry from "./CartEntry";
import setProductQuantity from "./action";
import { formatPrice } from "@/lib/format";

export const metadata = {
    title: "Cart - Flowmazon",
}

const CartPage = async ()  => {
    const cart = await getCart()
  return (
    <div>
      <h1 className="text-3xl mb-6 font-bold">Shopping Cart</h1>
      {cart?.item.map(cartItem => (
        <CartEntry cartItem={cartItem} key={cartItem.id} setProductQuantity={setProductQuantity}/>
      ))}

      {!cart?.item.length && <p className="mt-6 text-4xl">Your cart is empty</p>}
      <div className="flex flex-col items-end pb-8 sm:items-center">
        <p className="mb-3 font-bold">
            Total: {formatPrice(cart?.subtotal || 0)}
        </p>
        <button className="btn bg-amber-500 transition-colors hover:bg-amber-600 sm:w-[200px]">
            Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
