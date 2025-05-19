import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import FormSubmitButton from "@/component/FormSubmitButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata = {
  title: "Add Product - Flowmazon",
};

async function addProduct(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const rawPrice = formData.get("price");
  const price = rawPrice === null ? NaN : Number(rawPrice);

  if (!name || !description || !imageUrl || !Number.isFinite(price)) {
     throw Error("Missing required fields");
   }

  await prisma.product.create({
    data: {
      name,
      description,
      imageUrl,
      price,
    },
  });

  redirect("/");
}

const AddProduct = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Add Product</h1>
      <form action={addProduct}>
        <input
          type="text"
          placeholder="Product Name"
          className="mb-3 w-full input input-bordered focus:outline-none"
          name="name"
          required
        />
        <textarea
          name="description"
          required
          placeholder="Description"
          className="mb-3 w-full textarea textarea-bordered focus:outline-none"
        />

        <input
          name="imageUrl"
          placeholder="Image URL"
          required
          type="url"
          className="mb-3 w-full input input-bordered focus:outline-none"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          required
          className="mb-3 w-full input input-bordered focus:outline-none"
        />
        <FormSubmitButton className="btn-block bg-amber-500 transition-colors hover:bg-amber-600">
          Add Product
        </FormSubmitButton>
      </form>
    </div>
  );
};

export default AddProduct;
