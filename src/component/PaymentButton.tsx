"use client"

import { ReactNode } from "react"

type PaymentButtonProps =  {
    type: "button" | "submit" | "reset"
    disabled: boolean
    children: ReactNode
}

export default function PaymentButton ({
    type='submit',
    disabled = false,
    children
}: PaymentButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled}
            className=' bg-amber-500 py-2 px-4 rounded hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
        >
            {children}
        </button>
    )
}