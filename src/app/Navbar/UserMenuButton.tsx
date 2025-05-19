"use client";

import Image from "next/image";
import profilePicPlaceholder from "../assets/profilePicPlaceholder.png";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserMenuButton = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter();

  const handleAddProduct = () => {
    router.push("/add-product");
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  if (status === "loading") {
    return (
      <div className="btn btn-ghost btn-circle avatar loading-skeleton w-10 h-10 rounded-full" />
    );
  }

  const handleSignOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div className="flex justify-center gap-4 items-center">
      <div className="dropdown dropdown-end mt-2">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          {user ? (
            <Image
              src={user?.image || profilePicPlaceholder}
              alt="User avatar"
              width={40}
              height={40}
              className="w-10 rounded-full"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          )}
        </label>
        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content rounded-box mt-3 w-52 bg-base-100 p-2 shadow"
        >
          {user && (
            <li>
              <button onClick={handleAddProduct}>Add Product</button>
            </li>
          )}
          <li>
            {user ? (
              <button onClick={handleSignOut}>Sign Out</button>
            ) : (
              <button onClick={handleSignIn}>Sign In</button>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserMenuButton;
