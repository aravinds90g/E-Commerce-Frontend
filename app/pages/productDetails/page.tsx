"use client";
import React, { useState, useEffect } from "react";
import {
  Filter,
  X,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/ProductCard";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/layouts/Footer";
import { useTheme } from "@/context/ThemeContext";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  stock?: number;
  rating?: number;
  createdAt?: string;
}

const ProductsPage = () => {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>("featured");

  const searchParams = useSearchParams();
  const searchInput = searchParams.get("search") || "";

  const fetchProducts = async (searchQuery = "") => {
    try {
      let url = "https://e-commerce-backend-1-2dj3.onrender.com/products";
      if (searchQuery) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
      }
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoriesResponse = await axios.get(
          "https://e-commerce-backend-1-2dj3.onrender.com/categories"
        );
        setCategories(categoriesResponse.data.data);

        // Fetch products
        const productsData = await fetchProducts(searchInput);
        setProducts(productsData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchInput]);

  const filteredProducts = products
    .filter((product) =>
      selectedCategory ? product.categoryId === selectedCategory : true
    )
    .filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return (
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
          );
        default:
          return 0;
      }
    });

  const resetFilters = () => {
    setSelectedCategory(null);
    setPriceRange([0, 1000]);
    setSortOption("featured");
  };

  if (loading) {
    return (
      <div
        className={`container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="space-y-8">
          <Skeleton
            className={`h-10 w-1/3 ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-200"
            }`}
          />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Skeleton */}
            <div className="hidden lg:block w-72 space-y-6">
              <div
                className={`p-6 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border`}
              >
                <Skeleton
                  className={`h-6 w-1/2 mb-6 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                />
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className={`h-4 w-full mb-3 ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Products Skeleton */}
            <div className="flex-1">
              <div className="flex justify-between mb-6">
                <Skeleton
                  className={`h-6 w-1/4 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                />
                <Skeleton
                  className={`h-8 w-32 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-lg overflow-hidden ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    } border`}
                  >
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton
                        className={`h-5 w-3/4 ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      />
                      <Skeleton
                        className={`h-4 w-1/2 ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      />
                      <Skeleton
                        className={`h-6 w-1/3 ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
      >
        <h1
          className={`text-3xl font-bold mb-8 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {searchInput ? `Results for "${searchInput}"` : "All Products"}
        </h1>

        {/* Mobile filter button */}
        <div className="lg:hidden mb-6">
          <Button
            variant="outline"
            onClick={() => setMobileFiltersOpen(true)}
            className={`flex items-center gap-2 ${
              theme === "dark" ? "border-gray-700 hover:bg-gray-800" : ""
            }`}
          >
            <Filter size={16} />
            Filters
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6 h-[calc(100vh-8rem)] overflow-y-auto">
              <div
                className={`rounded-lg p-6 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className={`font-semibold text-lg ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Filters
                  </h2>
                  <button
                    onClick={resetFilters}
                    className={`text-sm ${
                      theme === "dark"
                        ? "text-indigo-400 hover:text-indigo-300"
                        : "text-indigo-600 hover:text-indigo-500"
                    }`}
                  >
                    Reset All
                  </button>
                </div>

                {/* Category filter */}
                <div className="mb-6">
                  <h3
                    className={`font-medium mb-3 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Categories
                  </h3>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <input
                          type="radio"
                          id={`category-${category.id}`}
                          name="category"
                          checked={selectedCategory === category.id}
                          onChange={() => setSelectedCategory(category.id)}
                          className={`h-4 w-4 ${
                            theme === "dark"
                              ? "border-gray-600 bg-gray-700"
                              : "border-gray-300"
                          } text-indigo-600 focus:ring-indigo-500`}
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className={`ml-3 text-sm ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          } cursor-pointer`}
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range filter */}
                <div>
                  <h3
                    className={`font-medium mb-3 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        ${priceRange[0]}
                      </span>
                      <span
                        className={
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        ${priceRange[1]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                        theme === "dark"
                          ? "bg-gray-700 accent-indigo-500"
                          : "bg-gray-200 accent-indigo-600"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products section */}
          <div className="flex-1">
            {/* Mobile Filters - Sliding panel */}
            {mobileFiltersOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div
                  className={`fixed inset-0 ${
                    theme === "dark" ? "bg-black/70" : "bg-black/50"
                  }`}
                  onClick={() => setMobileFiltersOpen(false)}
                ></div>
                <div
                  className={`fixed inset-y-0 left-0 max-w-xs w-full p-6 overflow-y-auto ${
                    theme === "dark" ? "bg-gray-900" : "bg-white"
                  } shadow-lg`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2
                      className={`font-semibold text-lg ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Filters
                    </h2>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className={`p-2 rounded-md ${
                        theme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <X
                        size={20}
                        className={
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }
                      />
                    </button>
                  </div>

                  <div className="mb-6">
                    <h3
                      className={`font-medium mb-3 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Categories
                    </h3>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center">
                          <input
                            type="radio"
                            id={`mobile-category-${category.id}`}
                            name="mobile-category"
                            checked={selectedCategory === category.id}
                            onChange={() => setSelectedCategory(category.id)}
                            className={`h-4 w-4 ${
                              theme === "dark"
                                ? "border-gray-600 bg-gray-700"
                                : "border-gray-300"
                            } text-indigo-600 focus:ring-indigo-500`}
                          />
                          <label
                            htmlFor={`mobile-category-${category.id}`}
                            className={`ml-3 text-sm ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            } cursor-pointer`}
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3
                      className={`font-medium mb-3 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Price Range
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span
                          className={
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          ${priceRange[0]}
                        </span>
                        <span
                          className={
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          ${priceRange[1]}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="10"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                          theme === "dark"
                            ? "bg-gray-700 accent-indigo-500"
                            : "bg-gray-200 accent-indigo-600"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-full"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Showing {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort"
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className={`border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                  }`}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">
                    <span className="items-center gap-1">Price ↑</span>
                  </option>
                  <option value="price-desc">
                    <span className=" items-center gap-1">Price ↓</span>
                  </option>
                  <option value="newest">
                    <span className="flex items-center gap-1">
                      Newest <Clock size={14} />
                    </span>
                  </option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div
                className={`text-center py-16 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                } border`}
              >
                <h3
                  className={`text-lg font-medium mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  No products found
                </h3>
                <p
                  className={`mb-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {searchInput
                    ? `No results for "${searchInput}"`
                    : "Try adjusting your filters"}
                </p>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className={
                    theme === "dark" ? "border-gray-700 hover:bg-gray-800" : ""
                  }
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductsPage;
