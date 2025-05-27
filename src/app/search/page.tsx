import prisma from "@/lib/db/prisma";
import React from "react";
import AnimatedSearchResults from "./AnimatedSearchResults";

interface SearchPageProps {
  searchParams: Promise<{
    query: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { query } = await searchParams;

  return {
    title: `Search results for "${query}" - Flowmazon`,
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const resolvedSearchParams = await searchParams;
  const { query } = resolvedSearchParams;
  const page = resolvedSearchParams.page || "1";
  const currentPage = parseInt(page);
  const pageSize = 6;

  const totalItemCount = await prisma.product.count({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
  });

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const skipAmount = (currentPage - 1) * pageSize;

  // Gets Paginated Results
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { id: "desc" },
    skip: skipAmount,
    take: pageSize,
  });

  if (products.length === 0) {
    return <AnimatedSearchResults isEmpty={true} query={query} />;
  }

  return (
    <div className="flex items-center gap-6">
      <AnimatedSearchResults
        isEmpty={false}
        query={query}
        products={products}
        totalItemCount={totalItemCount}
        currentPage={currentPage}
        totalPages={totalPages}
        searchParams={resolvedSearchParams}
      />
    </div>
  );
};

export default SearchPage;
