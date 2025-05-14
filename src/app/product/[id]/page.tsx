import PriceTag from "@/component/PriceTag";
import prisma from "@/lib/db/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";
import AddToCartButton from "../AddToCartButton";

interface ProductPageProps {
  params: {
    id: string;
  };
}

function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

const getProduct = cache(async (id: string) => {
  if (!isValidObjectId(id)) {
    console.error(`Invalid product id: ${id}`);
    return notFound();
  }
  return await prisma.product.findUnique({ where: { id } });
});

export const generateMetadata = async ({params}: {params: Promise<{id: string}>}): Promise<Metadata> => {
  const {id} = await params;

  try {
    const product = await getProduct(id);

    if (!product) {
      return {
        title: "Product not found - Flowmazon",
      };
    }

    return {
      title: product.name + " - Flowmazon",
      description: product.description,
      openGraph: {
        images: [{ url: product.imageUrl || "/default-image.jpg" }],
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: "error",
      description: "There was an error loading this post"
    }
  }
}


export default async function SingleProduct(
  params: ProductPageProps,
){
  const {id} = params.params;

  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
      <Image
        src={product.imageUrl || "/default-image.jpg"}
        alt={product.name || "Product image"}
        width={500}
        height={500}
        className="rounded-lg"
        priority
      />

      <div className="">
        <h1 className="text-5xl font-bold">{product.name}</h1>
        <PriceTag price={product.price} className="mt-4 bg-amber-500" />
        <p className="py-6">{product.description}</p>
        <AddToCartButton productId={product.id} />
      </div>
    </div>
  );
}
