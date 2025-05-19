import { getCart } from "@/lib/db/cart";
import setProductQuantity from "./action";
import AnimatedCartPage from "./AnimatedCardPage";

export const metadata = {
    title: "Cart - Flowmazon",
}

const CartPage = async ()  => {
    const cart = await getCart()
    if (!cart) {
        // You can render a fallback UI or return null if cart is not found
        return <div className="text-center text-2xl font-semibold">Your cart is empty.</div>;
    }
    return (
        <AnimatedCartPage cart={cart} setProductQuantity={setProductQuantity} />
    );
};

export default CartPage;
