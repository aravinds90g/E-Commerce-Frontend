"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  price: number;
  category?: {
    name: string;
  };
  image?: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  createdAt: string;
  total: number;
  status: string;
  orderItems: OrderItem[];
}

const AnalyticsDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const ordersResponse = await axios.get(
          "https://e-commerce-backend-1-2dj3.onrender.com/api/order"
        );
        const productsResponse = await axios.get(
          "https://e-commerce-backend-1-2dj3.onrender.com/products"
        );

        setOrders(ordersResponse.data);
        setProducts(productsResponse.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
                <button
                  onClick={() => window.location.reload()}
                  className="ml-2 text-red-500 hover:text-red-700 underline"
                >
                  Try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate sales data from orders
  const monthlySales = orders.reduce((acc, order) => {
    if (!order.createdAt) return acc;

    const month = new Date(order.createdAt).toLocaleString("default", {
      month: "short",
    });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += order.total || 0;
    return acc;
  }, {} as Record<string, number>);

  const salesData = Object.entries(monthlySales).map(([month, sales]) => ({
    month,
    sales,
  }));

  // Calculate sales by category
  const categorySales = products.reduce((acc, product) => {
    const categoryName = product.category?.name || "Uncategorized";
    const productSales = orders.reduce((sum, order) => {
      const orderItem = order.orderItems?.find(
        (item) => item.productId === product.id
      );
      return (
        sum +
        (orderItem ? (orderItem.price || 0) * (orderItem.quantity || 0) : 0)
      );
    }, 0);

    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += productSales;
    return acc;
  }, {} as Record<string, number>);

  const totalSales = Object.values(categorySales).reduce(
    (sum, sales) => sum + sales,
    0
  );

  // Get max sales value for chart scaling
  const maxSales = Math.max(...Object.values(monthlySales), 0) || 1;

  // Color palette for charts
  const chartColors = [
    "bg-blue-600",
    "bg-emerald-600",
    "bg-amber-500",
    "bg-violet-600",
    "bg-rose-500",
    "bg-indigo-600",
    "bg-teal-500",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Sales Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Insights and trends from your {`store's`} performance
          </p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">
                  $
                  {totalSales.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              <span className="text-green-600 font-medium">↑ 12.5%</span> from
              last period
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Orders
                </p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">
                  {orders.length.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              <span className="text-green-600 font-medium">↑ 8.3%</span> from
              last period
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Products</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">
                  {products.length.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              in {Object.keys(categorySales).length} categories
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Sales Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Monthly Sales Trend
            </h3>
            <div className="h-64">
              {salesData.length > 0 ? (
                <div className="h-full flex items-end space-x-2 md:space-x-4">
                  {salesData.map((data, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className={`w-full ${
                          chartColors[index % chartColors.length]
                        } hover:opacity-90 transition-opacity rounded-t-md`}
                        style={{
                          height: `${(data.sales / maxSales) * 100}%`,
                        }}
                        title={`$${data.sales.toLocaleString()}`}
                      ></div>
                      <span className="text-xs mt-2 text-gray-600 font-medium">
                        {data.month}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>No sales data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Sales by Category */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">
              Sales by Category
            </h3>
            <div className="h-64">
              {Object.entries(categorySales).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(categorySales)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, sales], idx) => {
                      const percentage =
                        totalSales > 0 ? (sales / totalSales) * 100 : 0;
                      return (
                        <div key={category} className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700 truncate max-w-[120px] md:max-w-[200px]">
                              {category}
                            </span>
                            <span className="text-gray-600">
                              ${sales.toLocaleString()} ({percentage.toFixed(1)}
                              %)
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                              className={`${
                                chartColors[idx % chartColors.length]
                              } h-2.5 rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p>No category sales data</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">
            Top Selling Products
          </h3>
          <div className="space-y-4">
            {products.length > 0 ? (
              products
                .map((product) => {
                  const sales = orders.reduce((sum, order) => {
                    const orderItem = order.orderItems?.find(
                      (item) => item.productId === product.id
                    );
                    return sum + (orderItem ? orderItem.quantity || 0 : 0);
                  }, 0);
                  return { ...product, sales };
                })
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 5)
                .map((product, idx) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {product.category?.name || "Uncategorized"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">
                        ${(product.price || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.sales} {product.sales === 1 ? "sale" : "sales"}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        idx < 3
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      #{idx + 1}
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 py-8 space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p>No products available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
