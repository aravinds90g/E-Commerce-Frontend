"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  CreditCard,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";


const OrderPage = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    console.log("order_ID" + id);

    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://e-commerce-backend-1-2dj3.onrender.com/api/order/${id}`
        );
        setOrder(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [isMounted, user?.id, id, router]);

  const cancelOrder = async () => {
    // if (!orderId || !order) return;

    try {
      setCancelling(true);
      await axios.put(
        `https://e-commerce-backend-1-2dj3.onrender.com/api/order/${order?.id}`,
        {
          status: "CANCELLED",
        }
      );

      // Update local state
      setOrder({ ...order, status: "CANCELLED" });
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusDetails = (status) => {
    const baseStyles =
      "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium";

    switch (status) {
      case "PENDING":
        return {
          icon: Clock,
          styles: `${baseStyles} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200`,
          progress: 25,
        };
      case "PROCESSING":
        return {
          icon: Package,
          styles: `${baseStyles} bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200`,
          progress: 50,
        };
      case "SHIPPED":
        return {
          icon: Truck,
          styles: `${baseStyles} bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200`,
          progress: 75,
        };
      case "DELIVERED":
        return {
          icon: CheckCircle,
          styles: `${baseStyles} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200`,
          progress: 100,
        };
      case "CANCELLED":
        return {
          icon: Clock,
          styles: `${baseStyles} bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200`,
          progress: 0,
        };
      default:
        return {
          icon: Clock,
          styles: `${baseStyles} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`,
          progress: 0,
        };
    }
  };

  if (!isMounted || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Order not found</h2>
          <button
            onClick={() => router.push("/orders")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusDetails(order.status);
  const canCancel = ["PENDING", "PROCESSING"].includes(order.status);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Order #{order.id.split("-").pop()}
            </h1>
            <p
              className={`mt-1 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Order Status Card */}
        <div
          className={`rounded-xl shadow-sm p-6 mb-8 transition-colors duration-200 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } border`}
        >
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`p-3 rounded-full ${
                theme === "dark"
                  ? statusInfo.styles.includes("dark:bg")
                    ? statusInfo.styles.split("dark:bg-")[1].split(" ")[0]
                    : "bg-gray-700"
                  : statusInfo.styles.split("bg-")[1].split(" ")[0]
              }`}
            >
              <statusInfo.icon className="w-5 h-5" />
            </div>
            <div>
              <h2
                className={`font-semibold text-lg ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Order Status
              </h2>
              <div className={statusInfo.styles}>
                <statusInfo.icon className="w-4 h-4" />
                <span className="capitalize">{order.status.toLowerCase()}</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-6">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                order.status === "PENDING"
                  ? "bg-yellow-500"
                  : order.status === "PROCESSING"
                  ? "bg-blue-500"
                  : order.status === "SHIPPED"
                  ? "bg-purple-500"
                  : order.status === "DELIVERED"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${statusInfo.progress}%` }}
            ></div>
          </div>

          {order.estimatedDelivery && order.status !== "CANCELLED" && (
            <div
              className={`flex items-center gap-3 text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>
                Estimated delivery:{" "}
                {new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div
              className={`rounded-xl shadow-sm p-6 transition-colors duration-200 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border`}
            >
              <h2
                className={`text-xl font-semibold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Order Items ({order.orderItems.length})
              </h2>

              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col sm:flex-row gap-4 p-4 rounded-lg transition-colors duration-200 ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-600">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.product}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-300">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {item.product}
                      </h3>
                      {item.description && (
                        <p
                          className={`text-sm mt-1 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {item.description}
                        </p>
                      )}
                      <p
                        className={`text-sm mt-2 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex justify-between">
                  <span
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Shipping
                  </span>
                  <span
                    className={
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }
                  >
                    {`Free`}
                  </span>
                </div>
                <div className="flex justify-between"></div>
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700 font-semibold">
                  <span
                    className={
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }
                  >
                    Total
                  </span>
                  <span
                    className={
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }
                  >
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div
              className={`rounded-xl shadow-sm p-6 transition-colors duration-200 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border`}
            >
              <h2
                className={`text-xl font-semibold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Shipping Information
              </h2>

              <div className="space-y-4">
                <div>
                  <h3
                    className={`font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Shipping Address
                  </h3>
                  <p
                    className={`mt-1 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {order.shippingAddress.name}
                    <br />
                    {order.shippingAddress.street}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zip}
                    <br />
                    {order.shippingAddress.country}
                  </p>
                </div>

                <div>
                  <h3
                    className={`font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Shipping Method
                  </h3>
                  <p
                    className={`mt-1 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Standard Shipping (3-5 business days)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div
              className={`rounded-xl shadow-sm p-6 transition-colors duration-200 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border`}
            >
              <h2
                className={`text-xl font-semibold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Customer
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {order.userName}
                    </h3>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {order.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div
              className={`rounded-xl shadow-sm p-6 transition-colors duration-200 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border`}
            >
              <h2
                className={`text-xl font-semibold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Payment
              </h2>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                  <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h3
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Payment Method
                  </h3>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {order.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Status
                  </span>
                  <span
                    className={`font-medium ${
                      order.status === "CANCELLED"
                        ? theme === "dark"
                          ? "text-red-400"
                          : "text-red-600"
                        : theme === "dark"
                        ? "text-green-400"
                        : "text-green-600"
                    }`}
                  >
                    {order.status === "CANCELLED" ? "Refunded" : "Paid"}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span
                    className={
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }
                  >
                    Date
                  </span>
                  <span
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Actions */}

            {order.status === "!CANCELLED" && (
              <div
                className={`rounded-xl shadow-sm p-6 transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border`}
              >
                <h2
                  className={`text-xl font-semibold mb-6 ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  Order Actions
                </h2>

                <div className="space-y-3">
                  {canCancel && (
                    <button
                      onClick={cancelOrder}
                      disabled={cancelling}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        theme === "dark"
                          ? "bg-red-600/20 hover:bg-red-600/30 text-red-400"
                          : "bg-red-50 hover:bg-red-100 text-red-600"
                      } ${cancelling ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {cancelling ? (
                        <>
                          <span className="animate-spin">↻</span>
                          Cancelling...
                        </>
                      ) : (
                        "Cancel Order"
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
