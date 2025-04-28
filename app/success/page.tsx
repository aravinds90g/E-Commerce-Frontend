"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function SuccessPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderProcessed, setOrderProcessed] = useState(false);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);

  useEffect(() => {
    // Load shipping address from localStorage
    if (typeof window !== "undefined") {
      const savedAddress = localStorage.getItem("shippingAddress");
      if (savedAddress) {
        setShippingAddress(JSON.parse(savedAddress));
      }
    }
  }, []);

  useEffect(() => {
    // Check if we have all required data before processing
    const requiredDataLoaded =
      sessionId && cart.length > 0 && user && shippingAddress;

    if (!requiredDataLoaded) {
      // If we're missing critical data, either wait or redirect
      if (!sessionId) {
        router.push("/");
      }
      return;
    }

    // Prevent duplicate processing
    if (orderProcessed) return;

    const processOrder = async () => {
      try {
        setIsProcessing(true);

        // Create the order with all required data including shipping address
        await axios.post(
          "https://e-commerce-backend-1-2dj3.onrender.com/api/order",
          {
            items: cart,
            total: cartTotal,
            userId: user.id,
            userName: user.firstName || "Guest",
            sessionId,
            shippingAddress, // Include the shipping address
            status: "completed", // Mark as completed since payment succeeded
          }
        );

        // Mark as processed and clear cart
        setOrderProcessed(true);
        clearCart();

        // Clean up the shipping address from localStorage
        localStorage.removeItem("shippingAddress");

        // Redirect after 5 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } catch (err) {
        console.error("Order processing failed:", err);
        setError("Failed to process your order. Please contact support.");
      } finally {
        setIsProcessing(false);
      }
    };

    processOrder();

    // Cleanup function to prevent memory leaks
    return () => {
      // Clear any pending redirect if component unmounts
    };
  }, [
    cart,
    cartTotal,
    user,
    sessionId,
    orderProcessed,
    clearCart,
    router,
    shippingAddress,
  ]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 px-6 text-center">
        <h1 className="text-4xl font-bold text-red-700 mb-4">Error</h1>
        <p className="text-lg text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition shadow-md"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-50 px-6 text-center">
      <div className="animate-bounce mb-6">
        <CheckCircleIcon className="h-24 w-24 text-green-500 drop-shadow-lg" />
      </div>
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        Payment Successful!
      </h1>
      <p className="text-lg text-gray-700 mb-2">
        Thank you for your purchase.{" "}
        {isProcessing
          ? "Your order is being processed..."
          : "Your order has been confirmed!"}
      </p>

      {shippingAddress && !isProcessing && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm max-w-md w-full text-left">
          <h3 className="font-semibold text-gray-800 mb-2">Shipping to:</h3>
          <p className="text-gray-600">
            {shippingAddress.firstName} {shippingAddress.lastName}
          </p>
          <p className="text-gray-600">{shippingAddress.address1}</p>
          {shippingAddress.address2 && (
            <p className="text-gray-600">{shippingAddress.address2}</p>
          )}
          <p className="text-gray-600">
            {shippingAddress.city}, {shippingAddress.state}{" "}
            {shippingAddress.zipCode}
          </p>
          <p className="text-gray-600">{shippingAddress.country}</p>
        </div>
      )}

      {!isProcessing && (
        <p className="text-sm text-gray-500 mb-6">
          {`You'll`} be redirected shortly...
        </p>
      )}
    </div>
  );
}
