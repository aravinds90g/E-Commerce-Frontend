"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";
import { ShoppingCart, Loader2, ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { theme } = useTheme();
  const cartContext = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const { isSignedIn, user } = useUser();
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States", // default value
  });

  // Load saved address from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAddress = localStorage.getItem("shippingAddress");
      if (savedAddress) {
        setShippingAddress(JSON.parse(savedAddress));
      } else if (user) {
        // Pre-fill with user's name if available
        setShippingAddress((prev) => ({
          ...prev,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
        }));
      }
    }
  }, [user]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveAddressToLocalStorage = () => {
    localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));
    toast.success("Shipping address saved", {
      position: "bottom-right",
      className: theme === "dark" ? "bg-gray-800 text-white" : "",
    });
  };

  if (!cartContext) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          theme === "dark"
            ? "bg-gray-900 text-red-400"
            : "bg-gray-50 text-red-600"
        }`}
      >
        <div className="text-center p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-semibold mb-2">Cart Error</h2>
          <p>Unable to load your cart. Please try again.</p>
          <Link
            href="/"
            className={`mt-4 inline-flex items-center ${
              theme === "dark"
                ? "text-indigo-400 hover:text-indigo-300"
                : "text-indigo-600 hover:text-indigo-500"
            }`}
          >
            <ArrowLeft className="mr-1" size={16} /> Return to shop
          </Link>
        </div>
      </div>
    );
  }

  const { cart, cartTotal, clearCart } = useCart();

  const handleCheckout = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to proceed to checkout", {
        position: "bottom-right",
        className: theme === "dark" ? "bg-gray-800 text-white" : "",
      });
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty!", {
        position: "bottom-right",
        className: theme === "dark" ? "bg-gray-800 text-white" : "",
      });
      return;
    }

    // Validate shipping address
    if (
      !shippingAddress.address1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode ||
      !shippingAddress.country
    ) {
      toast.error("Please fill in all required shipping address fields", {
        position: "bottom-right",
        className: theme === "dark" ? "bg-gray-800 text-white" : "",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Save address to localStorage
      saveAddressToLocalStorage();

      // Then create Stripe session
      const checkoutRes = await axios.post(
        "https://e-commerce-backend-1-2dj3.onrender.com/api/checkout",
        {
          items: cart,
          amount: Math.round(cartTotal * 100),
          currency: "usd",
          userId: user?.id,
          customerEmail: user?.emailAddresses[0]?.emailAddress,
          shippingAddress: shippingAddress,
        }
      );

      const { sessionId } = checkoutRes.data;
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );

      if (!stripe) throw new Error("Stripe initialization failed");

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;

      // Clear cart on successful checkout initiation
      clearCart();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Payment failed. Please try again.", {
        position: "bottom-right",
        className: theme === "dark" ? "bg-gray-800 text-white" : "",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/products"
            className={`inline-flex items-center ${
              theme === "dark"
                ? "text-indigo-400 hover:text-indigo-300"
                : "text-indigo-600 hover:text-indigo-500"
            }`}
          >
            <ArrowLeft className="mr-1" size={16} /> Continue Shopping
          </Link>
        </div>

        <h1
          className={`text-3xl md:text-4xl font-bold mb-8 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div
              className={`p-6 rounded-xl ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border shadow-sm`}
            >
              <h2
                className={`text-xl font-semibold mb-6 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Order Summary
              </h2>

              {cart.length === 0 ? (
                <div
                  className={`text-center py-8 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <ShoppingCart className="mx-auto mb-4" size={40} />
                  <p className="text-lg">Your cart is empty</p>
                </div>
              ) : (
                <ul className="divide-y">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className={`py-4 ${
                        theme === "dark" ? "divide-gray-700" : "divide-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                            theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-medium ${
                              theme === "dark"
                                ? "text-gray-200"
                                : "text-gray-800"
                            }`}
                          >
                            {item.name}
                          </h3>
                          <p
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            ${item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <div
                          className={`font-semibold ${
                            theme === "dark" ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Shipping Information */}
            <div
              className={`p-6 rounded-xl ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border shadow-sm`}
            >
              <h2
                className={`text-xl font-semibold mb-4 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Shipping Information
              </h2>
              {isSignedIn ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className={`block text-sm font-medium mb-1 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={shippingAddress.firstName}
                        onChange={handleAddressChange}
                        required
                        className={`w-full px-3 py-2 rounded-md border ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className={`block text-sm font-medium mb-1 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={shippingAddress.lastName}
                        onChange={handleAddressChange}
                        required
                        className={`w-full px-3 py-2 rounded-md border ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="address1"
                      className={`block text-sm font-medium mb-1 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="address1"
                      name="address1"
                      value={shippingAddress.address1}
                      onChange={handleAddressChange}
                      required
                      className={`w-full px-3 py-2 rounded-md border ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address2"
                      className={`block text-sm font-medium mb-1 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Apartment, Suite, etc. (Optional)
                    </label>
                    <input
                      type="text"
                      id="address2"
                      name="address2"
                      value={shippingAddress.address2 || ""}
                      onChange={handleAddressChange}
                      className={`w-full px-3 py-2 rounded-md border ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className={`block text-sm font-medium mb-1 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        required
                        className={`w-full px-3 py-2 rounded-md border ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className={`block text-sm font-medium mb-1 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        State/Province *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleAddressChange}
                        required
                        className={`w-full px-3 py-2 rounded-md border ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="zipCode"
                        className={`block text-sm font-medium mb-1 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        ZIP/Postal Code *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleAddressChange}
                        required
                        className={`w-full px-3 py-2 rounded-md border ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="country"
                        className={`block text-sm font-medium mb-1 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleAddressChange}
                        required
                        className={`w-full px-3 py-2 rounded-md border ${
                          theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={saveAddressToLocalStorage}
                    className={`mt-2 px-4 py-2 text-sm rounded-md ${
                      theme === "dark"
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    Save Address
                  </button>
                </div>
              ) : (
                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Please sign in to enter shipping information
                </p>
              )}
            </div>
          </div>

          {/* Order Total & Checkout */}
          <div>
            <div
              className={`sticky top-7 justify-center items-center p-6 rounded-xl ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border shadow-sm`}
            >
              <h2
                className={`text-xl font-semibold mb-4 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Order Total
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Subtotal
                  </span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Shipping
                  </span>
                  <span
                    className={`${
                      cartTotal > 50
                        ? "text-green-500"
                        : theme === "dark"
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    {cartTotal > 50 ? "FREE" : "$5.99"}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-4">
                  <span
                    className={`font-medium ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Total
                  </span>
                  <span className="font-bold text-lg">
                    $
                    {(cartTotal > 50 ? cartTotal : cartTotal + 5.99).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing || cart.length === 0 || !isSignedIn}
                className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isProcessing || cart.length === 0 || !isSignedIn
                    ? theme === "dark"
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : theme === "dark"
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing...
                  </>
                ) : !isSignedIn ? (
                  "Sign In to Checkout"
                ) : (
                  <>
                    <CreditCard size={18} />
                    Pay Now
                  </>
                )}
              </button>

              {cart.length > 0 && (
                <p
                  className={`mt-4 text-center text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  You'll be redirected to Stripe to complete your payment
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
