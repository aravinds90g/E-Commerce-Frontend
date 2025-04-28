"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, X, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const Cart = () => {
  const { theme } = useTheme();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
  } = useCart();

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      toast.success("Item removed from cart");
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden ${
        theme === "dark"
          ? "bg-gray-900 bg-opacity-90"
          : "bg-gray-500 bg-opacity-75"
      }`}
    >
      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            className={`w-full max-w-6xl transform overflow-hidden rounded-lg text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <h2
                  className={`text-2xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Shopping Cart ({cartCount})
                </h2>
                <button
                  type="button"
                  className={`rounded-md ${
                    theme === "dark" ? "text-gray-300" : "text-gray-400"
                  } hover:text-gray-500 focus:outline-none`}
                  onClick={() => window.history.back()}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mt-8">
                {cartCount === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart
                      size={64}
                      className={`mx-auto ${
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <h3
                      className={`mt-4 text-xl font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Your cart is empty
                    </h3>
                    <p
                      className={`mt-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Start adding some items to your cart
                    </p>
                    <div className="mt-8">
                      <Link
                        href="/pages/productDetails"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flow-root">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-8">
                        <ul className="divide-y divide-gray-200">
                          {cart.map((item) => (
                            <li
                              key={item.id}
                              className={`py-6 flex ${
                                theme === "dark" ? "border-gray-700" : ""
                              }`}
                            >
                              <div className="flex-shrink-0 w-24 h-24 border rounded-md overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover object-center"
                                />
                              </div>

                              <div className="ml-4 flex-1 flex flex-col">
                                <div>
                                  <div
                                    className={`flex justify-between text-lg font-medium ${
                                      theme === "dark"
                                        ? "text-white"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    <h3>{item.name}</h3>
                                    <p className="ml-4">
                                      ${item.price.toFixed(2)}
                                    </p>
                                  </div>
                                  {item.description && (
                                    <p
                                      className={`mt-1 text-sm ${
                                        theme === "dark"
                                          ? "text-gray-400"
                                          : "text-gray-500"
                                      } line-clamp-2`}
                                    >
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex-1 flex items-end justify-between mt-4">
                                  <div className="flex items-center border rounded-md overflow-hidden">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.id,
                                          item.quantity - 1
                                        )
                                      }
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <div
                                      className={`w-10 h-8 flex items-center justify-center ${
                                        theme === "dark" ? "text-white" : ""
                                      }`}
                                    >
                                      {item.quantity}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.id,
                                          item.quantity + 1
                                        )
                                      }
                                      disabled={item.quantity >= item.stock}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-500"
                                    onClick={() => {
                                      removeFromCart(item.id);
                                      toast.success("Item removed from cart");
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div
                        className={`md:col-span-4 p-6 rounded-lg ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <div className="space-y-6">
                          <h3
                            className={`text-lg font-medium ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Order Summary
                          </h3>

                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <p
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-600"
                                }`}
                              >
                                Subtotal
                              </p>
                              <p
                                className={`text-sm font-medium ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                ${cartTotal.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex justify-between">
                              <p
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-600"
                                }`}
                              >
                                Shipping
                              </p>
                              <p
                                className={`text-sm font-medium ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                Calculated at checkout
                              </p>
                            </div>
                            <div
                              className={`flex justify-between border-t ${
                                theme === "dark"
                                  ? "border-gray-600"
                                  : "border-gray-200"
                              } pt-4`}
                            >
                              <p
                                className={`text-base font-medium ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                Order Total
                              </p>
                              <p
                                className={`text-base font-bold ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                ${cartTotal.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-6">
                            <Link
                              href="/pages/checkout"
                              className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              Proceed to Checkout
                            </Link>
                          </div>
                          <div className="mt-4 flex justify-center">
                            <Button
                              variant="link"
                              className="text-indigo-600 hover:text-indigo-500"
                              onClick={handleClearCart}
                            >
                              Clear cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
