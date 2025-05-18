"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.png";
import { usePathname } from "next/navigation";
import ShoppingCartButton from "./ShoppingCartButton";
import UserMenuButton from "./UserMenuButton";
import { ShoppingCart } from "@/lib/db/cart";
import { Session } from "next-auth";
import { SearchForm } from "./SearchForm";

interface NavbarProps {
  cart: ShoppingCart | null;
  session: Session | null;
}

const Navbar: React.FC<NavbarProps> = ({ cart}) => {
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <div className="bg-base-100">
      <div
        className={`navbar w-[85%] mx-auto flex flex-col sm:flex-row gap-4 ${isAuthPage ? "justify-center" : ""}`}
      >
        {isAuthPage ? (
          <div className="flex justify-center">
            <Link href="/" className="btn btn-ghost text-xl normal-case">
              <Image src={logo} alt="Flowmazon Logo" height={40} width={40} />
              Flowmazon
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <Link href="/" className="btn btn-ghost text-xl normal-case">
                <Image src={logo} alt="Flowmazon logo" height={40} width={40} />
                Flowmazon
              </Link>
            </div>
            <div className="flex flex-row w-full gap-2 sm:w-auto sm:items-center sm:justify-center pt-2">
              <SearchForm />
              <ShoppingCartButton cart={cart}/>
              <UserMenuButton/>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
