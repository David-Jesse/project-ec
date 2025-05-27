import PriceTag from "@/component/PriceTag";
import prisma from "@/lib/db/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";
import AddToCartButton from "../AddToCartButton";

export type Params = Promise<{ id: string }>

const getProduct = cache(async (id: string) => {
  return await prisma.product.findUnique({ where: { id } });
});

export async function generateMetadata({ params }: { params:Params }): Promise<Metadata> {
  const product = await getProduct((await params).id);

  if (!product) {
    return {
      title: 'Product not found - Flowmazon',
    }
  }

  return {
    title: `${product.name} - Flowmazon`,
    description: product.description,
    openGraph: {
      images: [{url: product.imageUrl || "/default-image.jpg"}],
    }
  }
}


export default async function SingleProduct(
  props: { params: Params }
){
  const { id } = await props.params;

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
