"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Star,
  ChevronLeft,
  Plus,
  Minus,
  Truck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/layouts/Footer";
import { useTheme } from "@/context/ThemeContext";
import { Skeleton } from "@/components/ui/skeleton";


const ProductDetailPage = () => {
  const { id } = useParams()
  const { theme } = useTheme();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const router = useRouter();
 
  const { isSignedIn } = useUser();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://e-commerce-backend-1-2dj3.onrender.com/products/${id}`
        );
        if (!res.ok) console.log("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product", {
          className: theme === "dark" ? "bg-gray-800 text-white" : "",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, theme]);

  const handleAddToCart = () => {
    if (!product) return;

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

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div
        className={`py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="space-y-8">
          <Skeleton
            className={`h-8 w-32 ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            }`}
          />

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2 space-y-4">
              <Skeleton
                className={`aspect-square rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                }`}
              />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className={`w-16 h-16 rounded-md ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-6">
              <Skeleton
                className={`h-10 w-3/4 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                }`}
              />
              <Skeleton
                className={`h-6 w-1/4 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                }`}
              />
              <div className="space-y-2">
                <Skeleton
                  className={`h-4 w-full ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                />
                <Skeleton
                  className={`h-4 w-5/6 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                />
                <Skeleton
                  className={`h-4 w-3/4 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                />
              </div>
              <Skeleton
                className={`h-12 w-1/2 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className={`py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen text-center transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link
          href="/products"
          className={`hover:underline ${
            theme === "dark" ? "text-indigo-400" : "text-indigo-600"
          }`}
        >
          Back to products
        </Link>
      </div>
    );
  }

  const images = product.images
    ? [product.image, ...product.images]
    : [product.image];
  const rating = product.rating || 0;

  return (
    <>
      <div
        className={`py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <button
          onClick={() => router.back()}
          className={`flex items-center mb-6 ${
            theme === "dark"
              ? "text-gray-300 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <ChevronLeft size={20} className="mr-1" />
          Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square rounded-xl overflow-hidden border">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />

              {product.stock <= 0 && (
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    theme === "dark" ? "bg-black/60" : "bg-black/40"
                  }`}
                >
                  <span
                    className={`font-bold text-lg px-4 py-2 rounded-lg ${
                      theme === "dark"
                        ? "bg-red-800 text-red-100"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all ${
                      selectedImage === index
                        ? theme === "dark"
                          ? "ring-2 ring-indigo-500"
                          : "ring-2 ring-indigo-600"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/2">
            <div className="mb-4">
              <span
                className={`text-sm px-2 py-1 rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {product.category.name}
              </span>
              <h1
                className={`text-3xl font-bold mt-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {product.name}
              </h1>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-3xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  ${product.price.toFixed(2)}
                </span>
                {product.price > 100 && (
                  <span
                    className={`text-sm px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      theme === "dark"
                        ? "bg-green-900/50 text-green-300"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    <Truck size={14} /> Free Shipping
                  </span>
                )}
              </div>

              <div className="flex items-center mt-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={
                        star <= Math.floor(rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : star === Math.ceil(rating) && rating % 1 >= 0.5
                          ? "text-yellow-400 fill-yellow-400"
                          : theme === "dark"
                          ? "text-gray-600"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h2
                className={`font-medium text-lg mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Description
              </h2>
              <p
                className={`whitespace-pre-line ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {product.description}
              </p>
            </div>

            <div
              className={`mb-6 p-4 rounded-lg border ${
                theme === "dark"
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Availability
                </span>
                <span
                  className={`font-medium ${
                    product.stock > 0
                      ? theme === "dark"
                        ? "text-green-400"
                        : "text-green-600"
                      : theme === "dark"
                      ? "text-red-400"
                      : "text-red-600"
                  }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              {product.stock > 0 && (
                <div
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Only {product.stock} left in stock - order soon
                </div>
              )}
            </div>

            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div
                  className={`flex items-center rounded-lg overflow-hidden w-fit border ${
                    theme === "dark" ? "border-gray-700" : "border-gray-300"
                  }`}
                >
                  <button
                    className={`w-10 h-10 flex items-center justify-center transition-colors disabled:opacity-50 ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1 || product.stock <= 0}
                  >
                    <Minus
                      size={16}
                      className={
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }
                    />
                  </button>
                  <div
                    className={`w-12 h-10 flex items-center justify-center border-x ${
                      theme === "dark"
                        ? "border-gray-700 text-white"
                        : "border-gray-300 text-gray-900"
                    }`}
                  >
                    {quantity}
                  </div>
                  <button
                    className={`w-10 h-10 flex items-center justify-center transition-colors disabled:opacity-50 ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock || product.stock <= 0}
                  >
                    <Plus
                      size={16}
                      className={
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }
                    />
                  </button>
                </div>
                <button
                  className={`flex-1 py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    product.stock > 0 && isSignedIn
                      ? theme === "dark"
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : theme === "dark"
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || !isSignedIn}
                >
                  <ShoppingCart size={18} />
                  {!isSignedIn
                    ? "Sign In to Add"
                    : product.stock > 0
                    ? "Add to Cart"
                    : "Out of Stock"}
                </button>
              </div>
            </div>

            <div
              className={`border-t pt-6 ${
                theme === "dark" ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <h3
                className={`font-medium mb-4 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Product Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span
                    className={`block ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Category
                  </span>
                  <p
                    className={`mt-1 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {product.category.name}
                  </p>
                </div>
                <div>
                  <span
                    className={`block ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    SKU
                  </span>
                  <p
                    className={`mt-1 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {product.id.split("-")[0]}
                  </p>
                </div>
                <div>
                  <span
                    className={`block ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Added
                  </span>
                  <p
                    className={`mt-1 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span
                    className={`block ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Last Updated
                  </span>
                  <p
                    className={`mt-1 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
