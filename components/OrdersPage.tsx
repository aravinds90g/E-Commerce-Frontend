"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Order } from "@/types";

interface OrdersPageProps {
  userId: string;
}

const OrdersPage: React.FC<OrdersPageProps> = ({ userId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `https://e-commerce-backend-1-2dj3.onrender.com/api/order/user/${userId}`
        );
        setOrders(response.data);
      } catch (e) {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">You have no orders yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/pages/orders/${order.id}`}
              className="block border border-gray-200 hover:border-blue-400 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-200 bg-white"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  Order ID:
                </span>
                <span className="text-sm text-gray-800">{order.id}</span>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  Date:
                </span>
                <span className="text-sm text-gray-800">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  Total:
                </span>
                <span className="text-sm text-green-600 font-bold">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
