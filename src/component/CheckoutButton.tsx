"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

type PaymentButtonProps = {
  type: "button" | "submit" | "reset";
  disabled: boolean;
  children: ReactNode;
  cartId?: string;
};

export default function CheckoutButton({
  type = "submit",
  disabled = false,
  children,
  cartId,
}: PaymentButtonProps) {
  const router = useRouter();

  const handleCheckout = () => {
    if (cartId) {
      router.push(`/checkout/${cartId}`);
    }
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={cartId ? handleCheckout : undefined}
      className=" bg-amber-500 py-2 px-4 rounded hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
