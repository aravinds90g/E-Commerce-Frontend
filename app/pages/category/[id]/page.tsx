"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { useParams } from "next/navigation";
import Footer from "@/components/layouts/Footer";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  stock: number;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  image?: string;
  description?: string;
  products?: Product[];
}

const CategoryPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const id = params.id as string; // Get ID from URL params

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      console.log("id", id);

      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch category with products from your backend API
        const response = await fetch(
          `https://e-commerce-backend-1-2dj3.onrender.com/categorybyproduct/${id}`
        );

        if (!response.ok) {
          console.log(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const categoryData = data.category;

        setCategory({
          id: categoryData.id,
          name: categoryData.name,
          image: categoryData.image,
          description: categoryData.description,
        });

        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching category products:", err);
        setError("Failed to load category products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="container-custom py-8 px-20">
        <div className="animate-pulse">
          <div className="h-8 w-1/4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-1/3 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-16 text-center lg:px-20">
        <h2 className="text-2xl font-bold mb-4">Error Loading Category</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link
          href="/categories"
          className="inline-block bg-shop-primary text-white px-6 py-2 rounded hover:bg-shop-dark transition"
        >
          View All Categories
        </Link>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container-custom py-16 text-center lg:px-20">
        <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
        <p className="text-gray-500 mb-6">
          Sorry, we {`couldn't`} find the category {`you're`} looking for.
        </p>
        <Link
          href="/categories"
          className="inline-block bg-shop-primary text-white px-6 py-2 rounded hover:bg-shop-dark transition"
        >
          View All Categories
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container-custom py-8 lg:px-20">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex text-sm text-gray-500">
            <Link href="/" className="hover:text-shop-primary">
              Home
            </Link>
            <ChevronRight size={16} className="mx-2" />
            <Link href="/pages/category" className="hover:text-shop-primary">
              Categories
            </Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-gray-900">{category.name}</span>
          </nav>
        </div>

        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-500 mb-8">{category.description}</p>
        )}

        {products.length === 0 ? (
          <div className="text-center py-12 border rounded-lg lg:px-20">
            <h3 className="text-lg font-medium mb-2">
              No products in this category yet
            </h3>
            <p className="text-gray-500 mb-4">
              Check back later or explore other categories
            </p>
            <Link
              href="/categories"
              className="inline-block bg-shop-primary text-white px-6 py-2 rounded hover:bg-shop-dark transition"
            >
              Explore Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 px-3">
            {products.map((product) => (
              <ProductCard key={product?.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
