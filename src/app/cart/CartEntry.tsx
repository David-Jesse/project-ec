"use client";

import { CartItemWithProduct } from "@/lib/db/cart";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";
import { useTransition } from "react";
import {motion} from "@/lib/motion"

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
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity:0, x: -100}}
      transition={{duration: 0.3}}
      layout
    >
      <div className="flex flex-wrap items-center gap-4">
        <motion.div
          whileHover={{scale: 1.05}}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image 
            src={product.imageUrl}
            alt={product.name}
            width={200}
            height={200}
            className="rounded-lg"
          />
        </motion.div>
        
        <motion.div
          initial={{x: 20, opacity: 0}}
          animate={{x: 0, opacity: 1}}
          transition={{delay: 0.1, duration: 0.3}}
        >
          <Link
            href={`/product/${product.id}`}
            className="font-bold text-lg hover:underline"
          >
            <motion.span
              whileHover={{x:3}}
              transition={{type: "spring", stiffness: 500}}
            >
              {product.name}
            </motion.span>
            
          </Link>
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.2}}
          >
            Price {formatPrice(product.price)}</motion.div>
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.3}}
            className="my-1 flex items-center gap-2">
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
          </motion.div>
          <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.4}}
          className="flex items-center gap-4">
            Total: {formatPrice(product.price * quantity)}
            {isPending && <div className="loading loading-spinner loading-sm"></div>}
          </motion.div>
        </motion.div>
      </div>
      <motion.div 
        initial={{scaleX: 0}}
        animate={{scaleX: 1}}
        transition={{duration: 0.5, delay: 0.2}}
      className="divider" />
    </motion.div>
  );
};

export default CartEntry;
