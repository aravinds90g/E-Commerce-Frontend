"use client";

import { ShoppingCart, Star, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "@/context/ThemeContext";





const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { isSignedIn } = useUser();
  const { theme } = useTheme();

  if (!product) {
    return (
      <div
        className={`rounded-lg overflow-hidden animate-pulse aspect-square ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}
      />
    );
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Please sign in to add items to cart", {
        position: "bottom-right",
        className: theme === "dark" ? "bg-gray-800 text-white" : "",
      });
      return;
    }

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
      },
      quantity
    );
    toast.success(`${quantity} ${product.name} added to cart`, {
      position: "bottom-right",
      className: theme === "dark" ? "bg-gray-800 text-white" : "",
    });
  };

 

  return (
    <div
      className={`group relative rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
          : "bg-white border-gray-200 hover:border-gray-300"
      } border`}
    >
      <Link href={`/pages/productDetails/${product.id}`} className="block">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden relative">
          <img
            src={product.image || "/placeholder-product.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Stock Status Badge */}
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
              product.stock > 0
                ? theme === "dark"
                  ? "bg-green-900 text-green-200"
                  : "bg-green-100 text-green-800"
                : theme === "dark"
                ? "bg-red-900 text-red-200"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.stock > 0 ? `${product.stock} left` : "Sold out"}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3
            className={`font-medium mb-1 line-clamp-2 h-12 ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {product.name}
          </h3>
          <div className="flex items-center mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span
              className={`text-sm ml-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {product.rating} 
            </span>
          </div>
          <div className="flex items-end justify-between">
            <p
              className={`text-lg font-bold ${
                theme === "dark" ? "text-orange-400" : "text-orange-600"
              }`}
            >
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </Link>

      {/* Add to Cart Panel */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-10 border-t ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 shadow-lg"
            : "bg-white border-gray-200 shadow-md"
        }`}
      >
       

        {/* Quick View (optional) */}
        <Button
          variant="outline"
          className={`w-full ${
            theme === "dark"
              ? "border-gray-600 hover:bg-gray-700 text-gray-200"
              : "border-gray-300 hover:bg-gray-100 text-gray-800"
          }`}
          asChild
        >
          <Link href={`/pages/productDetails/${product.id}`}>Quick View</Link>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
