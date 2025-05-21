"use client"

import {
    useStripe,
    useElements,
    PaymentElement
} from "@stripe/react-stripe-js"
import { FormEvent, useState } from "react"

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState<string | null>(null)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if(!stripe || !elements) return;

        setIsProcessing(true);
        setMessage(null)

        const {error} = await stripe.confirmAffirmPayment(
            process.env.CLIENT_SECRET!,
            {
                return_url: `${window.location.origin}/checkout/success`
            }
        )

        if (error) {
            setMessage(error.message || "An unexpected error occured")
        }

        setIsProcessing(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 border rounded shadow">
            <PaymentElement />

            <button
                type="submit"
                disabled={isProcessing || !stripe || !elements}
                className="btn bg-amber-500 w-full transform hover:scale-105 transition-transform duration-200"
            >
                {isProcessing ? "Processing..." : "Pay"}
            </button>

            {message && <div className="text-red-500 text-sm mt-2">{message}</div>}
        </form>
    )
}