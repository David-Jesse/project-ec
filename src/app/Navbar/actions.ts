"use server";

import { redirect } from "next/navigation";

export async function searchProducts(formData: FormData) {
  const searchQuery = formData.get("searchQuery")?.toString();

  if (searchQuery) {
    const encoded = encodeURIComponent(searchQuery);
    redirect(`/search?query=${encoded}`);
  } else {
    // Optional: redirect to a default page or show an error
    redirect("/not-found");
  }
}
