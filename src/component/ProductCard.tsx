import { Product } from "@/lib/types";
import Link from "next/link";
import PriceTag from "./PriceTag";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const isNew = Date.now() - new Date(product.createdAt).getTime() < 1000 * 60 * 60 * 24 * 7;
  return (
    <Link
      href={`/product/${product.id}`}
      className="card w-full bg-red-400 hover:shadow-xl transition-shadow duration-200"
    >
      <figure>
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={800}
          height={400}
          className="h-64 object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
            {product.name}
        </h2>
         {isNew && <span className="badge badge-secondary">NEW</span>}
        <p>{product.description}</p>
        <PriceTag price={product.price} />
      </div>
    </Link>
  );
};

export default ProductCard;
