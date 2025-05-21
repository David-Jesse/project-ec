import { Key, useState } from "react";
import Image from "next/image";

type OrderSummaryItem = {
  price: number;
  name: string;
  quantity: number;
  image?: string;
  variant?: string;
};

interface OrderData {
  items?: OrderSummaryItem[];
  subtotal?: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  total?: number;
}

const OrderSummary = ({ orderData }: { orderData: OrderData }) => {
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);

  if (!orderData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Order Summary
        </h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const {
    items = [],
    subtotal = 0,
    tax = 0,
    shipping = 0,
    discount = 0,
    total = 0,
  } = orderData;

  const handlePromoSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    setPromoError("");
    setPromoSuccess("");

    if (!promoCode.trim()) {
      setPromoError("Please enter a valid promo code.");
      return;
    }

    setApplyingPromo(true);

    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: promoCode }),
      });

      const data = await response.json();

      if (data.success) {
        setPromoSuccess(`${data.discountPercent}% discount applied!`);
      } else {
        setPromoError(data.message || "Invalid promo code.");
      }
  
    } catch {
      setPromoError("Could not validate promo code. Please try again");
    } finally {
      setApplyingPromo(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Order Summary
      </h2>

      <div className="space-y-6 mb-6">
        {items.map(
          (
            item: OrderSummaryItem,
            index: Key | null
          ) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <div className="flex items-center space-x-3">
            {item.image && (
              <div className="h-12 w-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div>
                <p className='font-medium text-gray-800'>
                {item.name} {item.quantity > 1 && `(${item.quantity})`}
                </p>
                <p className="text-sm text-gray-500">{item.variant || ''}</p>
            </div>
              </div>
              <span className="font-medium text-gray-700">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          )
        )}
      </div>

      <form onSubmit={handlePromoSubmit} className='mb-6'>
        <div className="flex space-x-2">
            <input 
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo Code"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadpw-sm focus:outline-none focus-ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm"
            />
            <button
                type="submit"
                disabled={applyingPromo}
                className={`px-4 py-2 bg-gray-800 text-white rounded-md text-sm font-medium ${
                    applyingPromo ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-700'
                }`}
            >   
                {applyingPromo ? 'Applying...' : 'Apply'}
            </button>
        </div>
        {promoError && <p className="mt-1 text-sm text-red-600">{promoError}</p>}
        {promoSuccess && <p className="mt-1 text-sm text-green-600">{promoSuccess}</p>}
      </form>

      {/* Price breakdown */}
      <div className="space-y-2 text-sm">
        <div className='flex justify-between'>
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
        </div>

        <div className='flex justify-between'>
            <span className='text-gray-600'>Shipping</span>
            <span className="font-medium text-gray-800">
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
            </span>
        </div>

        <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium text-gray-800">${tax.toFixed(2)}</span>
        </div>

        {discount > 0 && (
            <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
            </div>
        )}

        <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between font-semibold">
                <span className="text-lg">Total</span>
                <span className="text-lg">${total.toFixed(2)}</span>
            </div>
        </div>

        <div className='mt-6 flex items-center justify-center text-gray-500 text-sm'>
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
            Secure Checkout 
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;