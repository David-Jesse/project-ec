"use client";

import React from "react";
import ProductCard from "@/component/ProductCard";
import PaginationBar from "@/component/PaginationBar";
import { motion } from "@/lib/motion";
import { containerVariants, itemVariants } from "@/lib/motion";

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

interface AnimatedSearchResultsProps {
  isEmpty: boolean;
  query: string;
  products?: Product[];
  totalItemCount?: number;
  currentPage?: number;
  totalPages?: number;
  searchParams?: {
    query: string;
    page?: string;
  };
}

const AnimatedSearchResults = ({
  isEmpty,
  query,
  products,
  totalItemCount,
  currentPage,
  totalPages,
  searchParams,
}: AnimatedSearchResultsProps) => {
  if (isEmpty) {
    return (
      <motion.div
        className="text-center p-10 text-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        No products found for `{query}`
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <motion.h1
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Search results for {query}
        <motion.span
          className="ml-2 text-gray-400 text-lg font-normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          ({totalItemCount} {totalItemCount === 1 ? "item" : "items"} - Page{" "}
          {currentPage} of {totalPages})
        </motion.span>
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {products?.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {totalPages && totalPages > 1 && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <PaginationBar
            currentPage={currentPage || 1}
            totalPages={totalPages}
            searchParams={searchParams || { query }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedSearchResults;
