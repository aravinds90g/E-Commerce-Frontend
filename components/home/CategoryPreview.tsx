"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Category = {
  id: string;
  name: string;
  image: string | null;
  description?: string | null;
};

const CategoryPreview = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://e-commerce-backend-1-2dj3.onrender.com/categories"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const res = await response.json();
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="container-custom py-16 px-4 sm:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">
            Shop by Category
          </h2>
          <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-muted rounded-lg h-32 sm:h-40 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container-custom py-16 px-4 sm:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">
            Shop by Category
          </h2>
          <Link
            href="/pages/category"
            className="text-muted-foreground hover:text-blue-700 transition duration-300"
          >
            View All
          </Link>
        </div>
        <div className="text-center py-8 text-red-500">{error}</div>
      </section>
    );
  }

  return (
    <section className="container-custom py-16 px-4 sm:px-8">
      <div className="flex justify-between items-center mb-12 lg:px-32 sm:px-10">
        <h2 className="text-3xl font-bold text-foreground">Shop by Category</h2>
        <Link
          href="/pages/category"
          className="text-muted-foreground hover:text-blue-700 transition duration-300"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:px-32 sm:gap-6">
        {categories.slice(0, 4).map((category) => (
          <Link
            key={category.id}
            href={`/pages/category/${category.id}`}
            className="relative block bg-muted rounded-lg overflow-hidden group h-32 sm:h-40 transition-all duration-300 hover:scale-105"
          >
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-500"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
              <h3 className="text-white font-medium text-lg">
                {category.name}
              </h3>
              <span className="text-white/80 text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                View Products <ArrowRight size={14} className="ml-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryPreview;
