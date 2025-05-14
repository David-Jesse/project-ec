"use client";
import { incrementProductQuantity } from "./action";
import { useState } from "react";

interface AddToCartButtonProps {
  productId: string;
}

const AddToCartButton = ({ productId }: AddToCartButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function addToCart() {
        try {
            setIsLoading(true);
            await incrementProductQuantity(productId);
            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
            }, 3000)
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setIsLoading(false);
        }
    }
  return (
    <div className="flex items-center gap-3">
      <button
        className="btn bg-amber-500 transform hover:scale-105 transition-transform duration-200"
        onClick={addToCart}
        disabled={isLoading}
      >
        ADD TO CART
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        
      </button>
      {isLoading && <span className="loading loading-spinner loading-sm ml-2"/>}
      {success && <span className="text-success">Added to cart</span>}
    </div>
  );
};

export default AddToCartButton;
