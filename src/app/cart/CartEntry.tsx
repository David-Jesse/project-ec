"use client";

import { CartItemWithProduct } from "@/lib/db/cart";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";
import { useTransition } from "react";

interface CartEntryProps {
  cartItem: CartItemWithProduct;
  setProductQuantity: (productId: string, quantity: number) => Promise<void>;
}

const CartEntry = ({ cartItem: { product, quantity }, setProductQuantity }: CartEntryProps) => {
  const quantityOptions: JSX.Element[] = [];
  for (let i = 1; i <= 99; i++) {
    quantityOptions.push(<option key={i}>{i}</option>);
  }

  const [isPending, startTransition] = useTransition();
  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={200}
          height={200}
          className="rounded-lg"
        />
        <div>
          <Link
            href={`/product/${product.id}`}
            className="font-bold text-lg hover:underline"
          >
            {product.name}
          </Link>
          <div>Price {formatPrice(product.price)}</div>
          <div className="my-1 flex items-center gap-2">
            Quantity:
            <select className="select select-bordered w-full max-w-[80px]" defaultValue={quantity} onChange={(e) => {
                const newQuantity = parseInt(e.target.value)
                startTransition(async () => {
                    await setProductQuantity(product.id, newQuantity)
                })
            }}>
                <option value={0}>0 (Remove)</option>
                {quantityOptions}
            </select>
          </div>
          <div className="flex items-center gap-4">
            Total: {formatPrice(product.price * quantity)}
            {isPending && <div className="loading loading-spinner loading-sm"></div>}
          </div>
        </div>
      </div>
      <div className="divider" />
    </div>
  );
};

export default CartEntry;
