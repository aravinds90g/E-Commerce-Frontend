"use client";

import { Order, Product, Category } from "@/types";
import { useTheme } from "@/context/ThemeContext";
import {
  TrendingUp,
  Package,
  Layers,
  DollarSign,
  AlertCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface DashboardOverviewProps {
  orders?: Order[];
  products?: Product[];
  categories?: Category[];
}

const DashboardOverview = ({
  orders = [],
  products = [],
  categories = [],
}: DashboardOverviewProps) => {
  const { theme } = useTheme();

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const lowStockProducts = products.filter(
    (product) => (product.stock || 0) < 10
  ).length;

  return (
    <div
      className={`p-6 rounded-lg ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-6 ${
          theme === "dark" ? "text-white" : "text-gray-800"
        }`}
      >
        Dashboard Overview
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Revenue Card */}
        <div
          className={`p-6 rounded-xl ${
            theme === "dark" ? "bg-gray-700" : "bg-blue-50"
          } transition-all hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-blue-600"
                }`}
              >
                Total Revenue
              </p>
              <h3
                className={`text-2xl font-bold mt-1 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                ${totalRevenue.toFixed(2)}
              </h3>
            </div>
            <div
              className={`p-3 rounded-full ${
                theme === "dark" ? "bg-gray-600" : "bg-blue-100"
              }`}
            >
              <DollarSign
                className={theme === "dark" ? "text-blue-400" : "text-blue-600"}
                size={20}
              />
            </div>
          </div>
          <p
            className={`text-xs mt-3 ${
              theme === "dark" ? "text-gray-400" : "text-blue-500"
            }`}
          >
            <TrendingUp className="inline mr-1" size={14} />
            Last 30 days
          </p>
        </div>

        {/* Products Card */}
        <div
          className={`p-6 rounded-xl ${
            theme === "dark" ? "bg-gray-700" : "bg-green-50"
          } transition-all hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-green-600"
                }`}
              >
                Total Products
              </p>
              <h3
                className={`text-2xl font-bold mt-1 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {products.length}
              </h3>
            </div>
            <div
              className={`p-3 rounded-full ${
                theme === "dark" ? "bg-gray-600" : "bg-green-100"
              }`}
            >
              <Package
                className={
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }
                size={20}
              />
            </div>
          </div>
          <p
            className={`text-xs mt-3 ${
              theme === "dark" ? "text-gray-400" : "text-green-500"
            }`}
          >
            <Layers className="inline mr-1" size={14} />
            {categories.length} categories
          </p>
        </div>

        {/* Orders Card */}
        <div
          className={`p-6 rounded-xl ${
            theme === "dark" ? "bg-gray-700" : "bg-purple-50"
          } transition-all hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-purple-600"
                }`}
              >
                Total Orders
              </p>
              <h3
                className={`text-2xl font-bold mt-1 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {orders.length}
              </h3>
            </div>
            <div
              className={`p-3 rounded-full ${
                theme === "dark" ? "bg-gray-600" : "bg-purple-100"
              }`}
            >
              <Package
                className={
                  theme === "dark" ? "text-purple-400" : "text-purple-600"
                }
                size={20}
              />
            </div>
          </div>
          <p
            className={`text-xs mt-3 ${
              theme === "dark" ? "text-gray-400" : "text-purple-500"
            }`}
          >
            <Clock className="inline mr-1" size={14} />
            {pendingOrders} pending
          </p>
        </div>
      </div>

      {/* Recent Orders and Low Stock Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div
          className={`p-6 rounded-xl ${
            theme === "dark" ? "bg-gray-700" : "bg-white"
          } border ${theme === "dark" ? "border-gray-600" : "border-gray-200"}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Recent Orders
            </h3>
            <Link
              href="/admin/orders"
              className={`text-sm ${
                theme === "dark"
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              }`}
            >
              View All
            </Link>
          </div>

          {orders.slice(0, 5).length > 0 ? (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className={`p-3 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-600 hover:bg-gray-600/80"
                      : "bg-gray-50 hover:bg-gray-100"
                  } transition-colors`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        Order #{order.id.split("-")[0]}
                      </p>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "completed"
                          ? theme === "dark"
                            ? "bg-green-900/50 text-green-300"
                            : "bg-green-100 text-green-800"
                          : theme === "dark"
                          ? "bg-yellow-900/50 text-yellow-300"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    ${order.total.toFixed(2)} • {order.items.length} items
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p
              className={`text-center py-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No recent orders
            </p>
          )}
        </div>

        {/* Low Stock Products */}
        <div
          className={`p-6 rounded-xl ${
            theme === "dark" ? "bg-gray-700" : "bg-white"
          } border ${theme === "dark" ? "border-gray-600" : "border-gray-200"}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Low Stock Products
            </h3>
            <Link
              href="/admin/products"
              className={`text-sm ${
                theme === "dark"
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-500"
              }`}
            >
              View All
            </Link>
          </div>

          {lowStockProducts > 0 ? (
            <div className="space-y-4">
              {products
                .filter((product) => (product.stock || 0) < 10)
                .slice(0, 5)
                .map((product) => (
                  <div
                    key={product.id}
                    className={`p-3 rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-600/80"
                        : "bg-gray-50 hover:bg-gray-100"
                    } transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-md overflow-hidden ${
                          theme === "dark" ? "bg-gray-500" : "bg-gray-200"
                        }`}
                      >
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            theme === "dark" ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <AlertCircle
                            size={14}
                            className={
                              theme === "dark"
                                ? "text-yellow-400"
                                : "text-yellow-600"
                            }
                          />
                          <span
                            className={`text-xs ${
                              theme === "dark"
                                ? "text-yellow-300"
                                : "text-yellow-700"
                            }`}
                          >
                            Only {product.stock} left in stock
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p
              className={`text-center py-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No low stock products
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
