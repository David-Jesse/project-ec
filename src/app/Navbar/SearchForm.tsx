"use client";

import { searchProducts } from "./actions";

export function SearchForm() {
  return (
    <form action={searchProducts} className="flex-1 sm:flex-none">
      <div className="form-control">
        <label htmlFor="search-input" className="sr-only">
          Search products
        </label>
        <input
          type="text"
          name="searchQuery"
          placeholder="search"
          id="search-input"
          aria-label="Search products"
          className="input input-bordered w-full min-w-[100px] focus:outline-none focus:border-primary"
        />
      </div>
    </form>
  );
}
