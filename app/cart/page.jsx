"use client";

import Cart from "@/components/Cart";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";

const CartPage = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { theme } = useTheme(); // Get the current theme
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      toast.error("Please sign in to view your cart", {
        position: "bottom-right",
        style: {
          backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#111827",
        },
      });
      router.push("/sign-in?redirect_url=/cart");
    }
  }, [isSignedIn, isLoaded, router, theme]); // Add theme to dependencies

  if (!isLoaded) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div
          className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            theme === "dark" ? "border-indigo-400" : "border-indigo-600"
          }`}
        ></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Redirect will happen automatically
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Cart />
    </div>
  );
};

export default CartPage;
