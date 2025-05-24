"use client";

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { FormEvent, useState, useEffect } from "react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: 1000, // Shows the amount in cents
            currency: "usd",
            payment_method_types: ["card", "affirm"],
          }),
        });

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setMessage("Failed to initialize payment");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientSecret();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
      });
      if (error) {
        setMessage(error.message || "An unexpected error occured");
      }
    } catch (err) {
      setMessage("Payment failed");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
        <p className="mt-2">Loading payment information...</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="max-w-md mx-auto p-4 text-center text-red-500">
        Failed to initialize payment. Please try again.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-4 border rounded shadow"
    >
      <PaymentElement
        options={{
          layout: {
            type: "tabs", // Shows payment method tabs
            defaultCollapsed: false,
          },
        }}
      />

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className={`w-full py-2 px-4 rounded bg-amber-500 text-white font-medium hover:bg-amber-700 transition-colors ${
          isProcessing || !stripe || !elements
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          "Pay Now"
        )}
      </button>

      {message && (
        <div className="p-3 text-sm rounded bg-red-50 text-red-600">
          {message}
        </div>
      )}
    </form>
  );
}
