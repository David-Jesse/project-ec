"use client";

import { useState, useEffect } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import OrderSummary from "@/component/OrderSummary";
import BillingDetailsForm from "@/component/BillingDetailsForm";
import CheckoutStepper from "@/component/CheckoutStepper";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
console.log("Stripe key:", process.env.STRIPE_PUBLISHABLE_KEY);

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      fontFamily: '"Helvetica Neue", Helvetica, san-serif',
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
      iconColor: "#9e2146",
    },
  },
  hidePostalCode: true,
};

const STEPS = ["Billing Details", "Payment", "Confirmation"];

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const params = useParams();
  const router = useRouter();
  const cartId = params.cartId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [orderData, setOrderData] = useState(null);

  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "US",
    },
  });

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetch(`/api/cart/${cartId}`);
        if (!response.ok) throw new Error("Failed to fetch order data");
        const data = await response.json();
        setOrderData(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Could not load order information. Please try again.");
      }
    };

    if (cartId) {
      fetchOrderData();
    }
  }, [cartId]);

  // Handles Billing details form submission
  interface Address {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  }

  interface BillingDetails {
    name: string;
    email: string;
    phone: string;
    address: Address;
  }

  const handleBillingSubmit = (details: BillingDetails) => {
    setBillingDetails(details);
    setCurrentStep(1);
  };

  // Handles Payment form submission
  const handlePaymentSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card information is missing");
      setLoading(false);
      return;
    }

    try {
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: billingDetails.name,
            email: billingDetails.email,
            phone: billingDetails.phone,
            address: billingDetails.address,
          },
        });

      if (paymentMethodError) {
        setError(
          paymentMethodError.message || "Payment method creation failed"
        );
        setLoading(false);
        return;
      }

      const response = await fetch("/api/stripe/charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          cartId,
          billingDetails: billingDetails || {},
        }),
      });

      const paymentData = await response.json();

      if (paymentData.error) {
        setError(paymentData.error.message || "Payment failed");
        setLoading(false);
        return;
      }

      // Addition confirmation step
      if (paymentData.requiresAction) {
        const { error: confirmError } = await stripe.confirmCardPayment(
          paymentData.client_secret,
          {
            payment_method: paymentMethod.id,
          }
        );

        if (confirmError) {
          setError(confirmError.message || "Payment failed");
          setLoading(false);
          return;
        }
      }

      setCurrentStep(2);
      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        router.push("/checkout/success");
      }, 3000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Payment processing failed. Please try again");
      setLoading(false);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!orderData && !error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Checkout progress indicator */}
      <CheckoutStepper steps={STEPS} currentStep={currentStep} />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 bg-white rounded-lg shadow-md p-6">
          {currentStep === 0 && (
            <BillingDetailsForm
              billingDetails={billingDetails}
              onSubmit={handleBillingSubmit}
            />
          )}

          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-gray-800">
                Payment Information
              </h2>
              <p className="text-gray-600">
                All transactions are secure and encryted
              </p>

              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="space-y-4">
                  <label
                    htmlFor="card-element"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Card Information
                  </label>
                  <div className="border border-gray-300 p-4 rounded-md shadpw-sm bg-white focus-within:ring-2 focus-within:ring-amber-400">
                    <CardElement options={cardElementOptions} />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-500">{error}</p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={goBack}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !stripe}
                    className={`px-6 py-3 rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 ${
                      loading || !stripe
                        ? "opacity-70 cursor-not-allowed"
                        : "bg:hover-amber-800 focus:outline-none focus:ring-2 focus:ring-offest-2 focus:ring-amber-500"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      "Complete Purchase"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {currentStep === 2 && success && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10"
            >
              <div className="mx-auto flex items-center h-16 w-16 rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Payment Successful!
              </h2>
              <p className="mt-2 text-gray-600">
                Thank you for your purchase. You will be redirected to the order
                confirmation page shortly.
              </p>
            </motion.div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="col-span-1">
          {orderData && <OrderSummary orderData={orderData} />}
        </div>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
            Checkout
          </h1>
          <CheckoutForm />
        </div>
      </div>
    </Elements>
  );
}
