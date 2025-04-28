"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  featured?: boolean;
  categoryId: string;
  createdAt?: string;
}

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // Option 1: Fetch all products and filter featured ones
        // const response = await axios.get("https://e-commerce-backend-1-2dj3.onrender.com/products");
        // const featured = response.data.data.filter((product: Product) => product.featured);

        // Option 2: If your backend has a featured products endpoint
        const response = await axios.get(
          "https://e-commerce-backend-1-2dj3.onrender.com/products"
        );
        setFeaturedProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        toast.error("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  console.log(featuredProducts);

  if (loading) {
    return (
      <section className="py-12 md:py-16 lg:px-20">
        <div className="container mx-auto px-4 lg:px-20">
          <h2 className="text-3xl font-bold text-center mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Discover our handpicked selection of this {`season's`} best
            products.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg p-4 animate-pulse"
              >
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 lg:px-32">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center mx-auto">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl">
              Discover our handpicked selection of this {`season's`} best
              products.
            </p>
          </div>
          <Link
            href="/pages/productDetails"
            className="hover:text-blue-700  transition duration-300 mr-4"
          >
            View all →
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No featured products available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
