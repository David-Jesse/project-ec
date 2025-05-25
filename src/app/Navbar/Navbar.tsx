"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.png";
import { usePathname } from "next/navigation";
import ShoppingCartButton from "./ShoppingCartButton";
import UserMenuButton from "./UserMenuButton";
import { ShoppingCart } from "@/lib/db/cart";
import { Session } from "next-auth";
import { SearchForm } from "./SearchForm";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

interface NavbarProps {
  cart: ShoppingCart | null;
  session: Session | null;
}

const Navbar: React.FC<NavbarProps> = ({ cart, session }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    closeMobileMenu();
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      y: -20,
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.1,
      },
    },
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="bg-base-100 flex items-center justify-center">
      <div
        className={`navbar w-full sm:w-[85%] mx-auto flex flex-col sm:flex-row gap-4 ${isAuthPage ? "justify-center" : ""}`}
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
            <div className="hidden lg:flex w-full items-center justify-between">
              <div className="flex-1">
                <Link href="/" className="btn btn-ghost text-xl normal-case">
                  <Image
                    src={logo}
                    alt="Flowmazon logo"
                    height={40}
                    width={40}
                  />
                  Flowmazon
                </Link>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <SearchForm />
                <ShoppingCartButton cart={cart} />
                <UserMenuButton />
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden w-full mt-4">
              {/* Mobile Header */}

              <div className="flex items-center justify-between w-full">
                <Link href="/" className="btn btn-ghost text-xl normal-case">
                  <Image
                    src={logo}
                    alt="Flowmazon logo"
                    height={40}
                    width={40}
                  />
                  Flowmazon
                </Link>

                <div className="flex items-center gap-2">
                  <ShoppingCartButton cart={cart} />

                  {/* Mobile menu button */}
                  <button
                    className="btn btn-ghost btn-circle"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle Mobile Menu"
                  >
                    <div className="w-6 h-6 flex flex-col justify-center items-center">
                      <span className="w-6 h-0.5 bg-current mb-1" />
                      <span className="w-6 h-0.5 bg-current mb-1" />
                      <span className="w-6 h-0.5 bg-current mb-1" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Search bar */}
              <div className="w-[85%] mt-4 align-center mx-auto">
                <SearchForm />
              </div>

              {/* Mobile menu dropdown */}
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <>
                    {/* Mobile Background */}
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={overlayVariants}
                      className="fixed inset-0 bg-black bg-opacity-50 z-40"
                      onClick={closeMobileMenu}
                    >
                      {/* Mobile Dropdown menu*/}
                      <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed top-0 right-0 h-full w-80 bg-base-100 shadow-xl z-50 overflow-hidden"
                      >
                        <motion.div
                          variants={itemVariants}
                          className="h-full flex flex-col"
                        >
                          {/* Menu Header */}
                          <div className="p-4 border-b border-base flex items-center justify-between">
                            <button
                              onClick={closeMobileMenu}
                              className="btn btn-ghost btn-circle btn-sm hover:bg-base-200"
                              aria-label="Close Menu"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Menu Items */}
                          <div className="flex-1 p-4 space-y-2 flex flex-col justify-center items-center">
                            <Link
                              href="/"
                              className="btn btn-ghost w-full justify-start text-2xl"
                              onClick={closeMobileMenu}
                            >
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                              </svg>
                              Home
                            </Link>

                            {/* Conditional rendering of items based on if user or vendor */}
                            {session ? (
                              <>
                                {/* Order link for logged in users */}
                                <Link
                                  href="/orders"
                                  className="btn btn-ghost w-full justify-start text-2xl"
                                  onClick={closeMobileMenu}
                                >
                                  <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                  </svg>
                                  My orders
                                </Link>

                                {/* Add product link for vendors */}
                                {session.user?.role === "vendor" && (
                                  <Link
                                    href="/add-product"
                                    className="btn btn-ghost w-full justify-start text-2xl"
                                    onClick={closeMobileMenu}
                                  >
                                    <svg
                                      className="w-5 h-5 mr-2"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                      />
                                    </svg>
                                    Add Product
                                  </Link>
                                )}

                                {/* Logout button */}
                                <button
                                  className="btn btn-ghost w-full justify-start text-2xl"
                                  onClick={handleSignOut}
                                >
                                  <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                  </svg>
                                  Logout
                                </button>
                              </>
                            ) : (
                              <>
                                <Link
                                  href="/login"
                                  className="btn btn-ghost w-full justify-start text-2xl"
                                  onClick={closeMobileMenu}
                                >
                                  <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />
                                  </svg>
                                  Log In
                                </Link>

                                <Link
                                  href="/register"
                                  className="btn btn-ghost w-full justify-start text-2xl"
                                  onClick={closeMobileMenu}
                                >
                                  <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    />
                                  </svg>
                                  Register
                                </Link>
                              </>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
