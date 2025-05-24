"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Home, Package } from "lucide-react";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<{
    orderId?: string;
    paymentIntentId?: string;
  }>({});

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    const paymentIntentId = searchParams.get("payment_intent");

    setOrderDetails({
      orderId: orderId || undefined,
      paymentIntentId: paymentIntentId || undefined,
    });
  }, [searchParams]);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleViewOrders = () => {
    router.push("/orders");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success badge */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed and you
          will receive a confirmation email shortly.
        </p>

        {/* Order Details */}
        {orderDetails.orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono text-sm text-gray-900 break all">
              {orderDetails.orderId}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={handleViewOrders}
            className="w-full bg-amber-200 hover:bg-amber-400 font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
          >
            <Package className="h-5 w-5" />
            <span>View My Orders</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team at {""}
            <a
              href="mailto:djesse351@gmail.com"
              className="text-amber-600 hover:underline"
            >
              support@yourstore.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
