"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useTheme } from "@/context/ThemeContext";

const Hero = () => {
  const { theme } = useTheme();

  return (
    <section
      className={`relative py-20 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-900 to-gray-800"
          : "bg-gradient-to-b from-zinc-50 to-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6">
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold ${
                theme === "dark" ? "text-white" : "text-zinc-900"
              } mb-4 leading-tight`}
            >
              Shop the Latest <span className="text-indigo-600">Trends</span>
            </h1>

            <p
              className={`text-lg md:text-xl ${
                theme === "dark" ? "text-gray-300" : "text-zinc-600"
              } mb-8 max-w-xl mx-auto lg:mx-0`}
            >
              Discover amazing products with unbeatable prices and exceptional
              quality. Your satisfaction is our priority.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/pages/productDetails">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                  Shop Now <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/pages/category">
                <Button
                  variant="outline"
                  className={`gap-2 ${
                    theme === "dark"
                      ? "border-indigo-400 text-indigo-400 hover:bg-gray-700"
                      : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  <ShoppingBag size={18} /> Explore
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div
              className={`flex flex-wrap justify-center lg:justify-start gap-4 mt-8 text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    theme === "dark" ? "bg-indigo-500" : "bg-indigo-600"
                  }`}
                />
                <span>10,000+ Happy Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    theme === "dark" ? "bg-indigo-500" : "bg-indigo-600"
                  }`}
                />
                <span>Fast & Free Shipping</span>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative hidden lg:block">
            <div
              className={`relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl ${
                theme === "dark"
                  ? "ring-1 ring-gray-700"
                  : "ring-1 ring-gray-200"
              }`}
            >
              <img
                src="https://plus.unsplash.com/premium_photo-1680985551022-ad298e8a5f82?w=800&auto=format&fit=crop&q=80"
                alt="Featured Products"
                width={800}
                height={600}
                className="object-cover w-full h-full"
              />

            </div>

            {/* Decorative elements */}
            <div
              className={`absolute -bottom-6 -left-6 w-24 h-24 rounded-full shadow-md z-[-1] ${
                theme === "dark" ? "bg-indigo-900" : "bg-violet-200"
              }`}
            />
            <div
              className={`absolute -top-6 -right-6 w-16 h-16 rounded-full shadow-md z-[-1] ${
                theme === "dark" ? "bg-indigo-800" : "bg-indigo-200"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Wave divider at bottom */}
      <div
        className={`absolute bottom-0 left-0 right-0 overflow-hidden ${
          theme === "dark" ? "text-gray-800" : "text-zinc-50"
        }`}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="currentColor"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="currentColor"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
