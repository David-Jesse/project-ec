"use client";

import { formatPrice } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { motion } from "@/lib/motion";
import { Plus, Minus, Trash2 } from "lucide-react";

interface CartEntryProps {
  cartItem: {
    id: string;
    quantity: number;
    productId: string;
    product: {
      id: string;
      name: string;
      price: number;
      imageUrl: string;
      description?: string;
    };
  };
  setProductQuantity: (productId: string, quantity: number) => Promise<void>;
}

const CartEntry = ({ cartItem: { product, quantity, productId }, setProductQuantity }: CartEntryProps) => {
  const [isPending, startTransition] = useTransition();

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 0) return;
    startTransition(async () => {
      await setProductQuantity(productId, newQuantity);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      layout
      className="py-4"
    >
      <div className="flex flex-wrap items-center gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gray-100 rounded-lg overflow-hidden"
        >
          <Image 
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        </motion.div>
        
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex-1"
        >
          <div className="flex justify-between flex-wrap gap-2">
            <Link
              href={`/product/${product.id}`}
              className="font-bold text-lg hover:underline"
            >
              <motion.span
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {product.name}
              </motion.span>
            </Link>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-semibold"
            >
              {formatPrice(product.price * quantity)}
            </motion.div>
          </div>
          
          {product.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-sm mt-1 max-w-md"
            >
              {product.description.substring(0, 100)}
              {product.description.length > 100 ? '...' : ''}
            </motion.p>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 flex flex-wrap items-center gap-4"
          >
            <div className="flex items-center border rounded-md">
              <motion.button
                whileHover={{ backgroundColor: "#f3f4f6" }}
                onClick={() => updateQuantity(quantity - 1)}
                className="px-2 py-1 text-gray-600"
                disabled={isPending}
              >
                <Minus className="h-4 w-4" />
              </motion.button>
              
              <span className="px-4 py-1">{quantity}</span>
              
              <motion.button
                whileHover={{ backgroundColor: "#f3f4f6" }}
                onClick={() => updateQuantity(quantity + 1)}
                className="px-2 py-1 text-gray-600"
                disabled={isPending}
              >
                <Plus className="h-4 w-4" />
              </motion.button>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => updateQuantity(0)}
              className="text-red-600 hover:text-red-800"
              disabled={isPending}
            >
              <Trash2 className="h-5 w-5" />
            </motion.button>
            
            {isPending && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="loading loading-spinner loading-sm"
              />
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-sm text-gray-500"
          >
            Price per item: {formatPrice(product.price)}
          </motion.div>
        </motion.div>
      </div>
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="divider mt-4" 
      />
    </motion.div>
  );
};

export default CartEntry;