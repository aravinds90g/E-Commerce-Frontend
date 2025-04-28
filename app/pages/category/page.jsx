"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import Footer from "@/components/layouts/Footer";
import { useTheme } from "@/context/ThemeContext";

// Gradient color combinations for cards (light and dark variants)
const cardGradients = {
  light: [
    "from-purple-500 via-pink-500 to-rose-500",
    "from-blue-500 via-cyan-500 to-teal-500",
    "from-amber-500 via-orange-500 to-red-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-violet-500 via-purple-500 to-fuchsia-500",
    "from-rose-500 via-red-500 to-amber-500",
    "from-sky-500 via-blue-500 to-indigo-500",
    "from-lime-500 via-emerald-500 to-teal-500",
  ],
  dark: [
    "from-purple-600 via-pink-600 to-rose-600",
    "from-blue-600 via-cyan-600 to-teal-600",
    "from-amber-600 via-orange-600 to-red-600",
    "from-emerald-600 via-teal-600 to-cyan-600",
    "from-violet-600 via-purple-600 to-fuchsia-600",
    "from-rose-600 via-red-600 to-amber-600",
    "from-sky-600 via-blue-600 to-indigo-600",
    "from-lime-600 via-emerald-600 to-teal-600",
  ],
};



const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://e-commerce-backend-1-2dj3.onrender.com/categories"
        );
        const res = await response.json();
        setCategories(res.data);
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div
        className={`max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 min-h-screen ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="mb-12 text-center">
          <div
            className={`h-10 w-64 mx-auto rounded-full mb-4 animate-pulse ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`h-6 w-80 mx-auto rounded-full mb-8 animate-pulse ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            }`}
          ></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden border transition-all ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 shadow-lg"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <div
                className={`h-48 animate-pulse ${
                  theme === "dark"
                    ? cardGradients.dark[i % cardGradients.dark.length]
                    : cardGradients.light[i % cardGradients.light.length]
                }`}
              ></div>
              <div className="p-6">
                <div
                  className={`h-6 w-3/4 rounded-full mb-4 animate-pulse ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-4 w-full rounded-full mb-6 animate-pulse ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`h-8 w-24 rounded-full animate-pulse ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 min-h-screen transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        {/* Page Header */}
        <div className="mb-16 text-center">
          <h1
            className={`text-4xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Explore Our{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              Categories
            </span>
          </h1>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Discover amazing products organized into beautiful collections
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/pages/category/${category.id}`}
              className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.03]"
            >
              {/* Glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  theme === "dark"
                    ? cardGradients.dark[index % cardGradients.dark.length]
                    : cardGradients.light[index % cardGradients.light.length]
                } opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
              ></div>

              {/* Card content */}
              <div
                className={`relative z-10 h-full flex flex-col backdrop-blur-sm ${
                  theme === "dark"
                    ? "bg-gray-800/90 border border-gray-700"
                    : "bg-white/90 border border-gray-200"
                }`}
              >
                {/* Image/Gradient */}
                <div
                  className={`h-56 w-full relative overflow-hidden ${
                    !category.image
                      ? `bg-gradient-to-br ${
                          theme === "dark"
                            ? cardGradients.dark[
                                index % cardGradients.dark.length
                              ]
                            : cardGradients.light[
                                index % cardGradients.light.length
                              ]
                        }`
                      : ""
                  }`}
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles
                        className={`h-12 w-12 ${
                          theme === "dark" ? "text-gray-300" : "text-white"
                        } opacity-80`}
                      />
                    </div>
                  )}
                </div>

                {/* Category Info */}
                <div className="p-6 flex-grow flex flex-col">
                  <h3
                    className={`text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-purple-600 to-pink-600 transition-all ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {category.name}
                  </h3>
                  {category.description && (
                    <p
                      className={`line-clamp-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      } mb-4`}
                    >
                      {category.description}
                    </p>
                  )}
                  <div className="mt-auto flex justify-end items-center">
                    <span
                      className={`inline-flex items-center text-sm font-medium ${
                        theme === "dark"
                          ? "text-purple-400 group-hover:text-pink-400"
                          : "text-purple-600 group-hover:text-pink-600"
                      } transition-colors`}
                    >
                      Explore <ChevronRight className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && !loading && (
          <div className="text-center py-20">
            <div
              className={`mx-auto h-24 w-24 rounded-full flex items-center justify-center mb-6 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-purple-900/50 to-pink-900/50"
                  : "bg-gradient-to-r from-purple-100 to-pink-100"
              }`}
            >
              <Sparkles
                className={`h-12 w-12 ${
                  theme === "dark" ? "text-purple-400" : "text-purple-500"
                }`}
              />
            </div>
            <h3
              className={`text-2xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              No categories found
            </h3>
            <p
              className={`max-w-md mx-auto ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              We {`couldn't`} find any product categories right now. Please
              check back later.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CategoriesPage;
