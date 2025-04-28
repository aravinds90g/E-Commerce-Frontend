"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

const CartButton = () => {
  const { cartCount } = useCart();

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart size={24} />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartButton;
