import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, X, Trash2 } from "lucide-react";
import React from "react";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  
  const STATUS_FLOW = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: [], // No further actions after delivered
    CANCELLED: [], // No further actions after cancelled
    RETURNED: [], // No further actions after returned
  };

  const STATUS_COLORS = {
    PENDING: "bg-gray-100 text-gray-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    RETURNED: "bg-orange-100 text-orange-800",
  };

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://e-commerce-backend-1-2dj3.onrender.com/api/order"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      // Ensure all orders have a valid status
      const validatedOrders = data.map((order) => ({
        ...order,
        status: STATUS_FLOW[order.status] ? order.status : "PENDING",
      }));
      setOrders(validatedOrders);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(
    (order) =>
      (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.userId &&
        order.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.status &&
        order.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  // Update status
  // Update status
 const updateOrderStatus = async (orderId, newStatus) => {
   if (!STATUS_FLOW[newStatus]) {
     setError("Invalid status");
     return;
   }

   setUpdatingOrder(orderId);
   setError(null);

   try {
     const response = await fetch(
       `https://e-commerce-backend-1-2dj3.onrender.com/api/order/${orderId}`,
       {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ status: newStatus }),
       }
     );

     if (!response.ok) {
       throw new Error("Failed to update order status");
     }

     // The API doesn't return the updated order, so we'll update our local state directly
     setOrders((prevOrders) =>
       prevOrders.map((order) =>
         order.id === orderId || order._id === orderId
           ? { ...order, status: newStatus }
           : order
       )
     );
   } catch (error) {
     setError(error.message);
     // Optional: Revert the status in UI if the update failed
     setOrders((prevOrders) =>
       prevOrders.map((order) =>
         order.id === orderId || order._id === orderId
           ? { ...order, status: order.status } // revert to original status
           : order
       )
     );
   } finally {
     setUpdatingOrder(null);
   }
 };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    setUpdatingOrder(orderId);
    setError(null);
    try {
      const response = await fetch(
        `https://e-commerce-backend-1-2dj3.onrender.com/api/order/${orderId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete order");
      }
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdatingOrder(null);
    }
  };

  // Toggle expand
  // Toggle expand
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusActions = (currentStatus) => {
    return STATUS_FLOW[currentStatus] || [];
  };

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            className="absolute top-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <X size={18} />
          </button>
        </div>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={fetchOrders}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Orders Management</h2>
        <div className="relative w-full md:w-64">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 justify-center text-center">
                          <div className="flex items-center justify-center text-center">
                            <button
                              onClick={() => toggleOrderDetails(order.id)}
                              className="mr-2 text-gray-500 justify-center items-center text-center hover:text-gray-700"
                            >
                              {expandedOrder === order.id ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                            </button>
                            <span className="text-sm font-medium justify-center items-center text-center text-gray-900">
                              #{order.id?.slice(0, 8).toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-gray-500">
                          {order.userName}
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-gray-500">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-center font-medium text-gray-900">
                          ${order.total?.toFixed(2) || "0.00"}
                        </td>
                        <td className="px-6 py-4 items-center text-center">
                          <span
                            className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                              STATUS_COLORS[order.status] ||
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status || "UNKNOWN"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          <div className="flex  items-center  justify-center space-x-2 flex-wrap">
                            {getStatusActions(order.status).map((status) => (
                              <button
                                key={status}
                                disabled={updatingOrder === order.id}
                                className={`px-2 py-1 text-xs rounded transition-colors ${
                                  status === "CANCELLED"
                                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                } ${
                                  updatingOrder === order.id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={() =>
                                  updateOrderStatus(order.id, status)
                                }
                              >
                                {updatingOrder === order.id
                                  ? "Updating..."
                                  : status}
                              </button>
                            ))}
                            <button
                              className={`p-1 rounded-full text-red-600 hover:bg-red-100 transition-colors ${
                                updatingOrder === order.id
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() => handleDeleteOrder(order.id)}
                              title="Delete order"
                              disabled={updatingOrder === order.id}
                            >
                              {updatingOrder === order.id ? (
                                <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-red-600 rounded-full"></div>
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedOrder === order.id && (
                        <tr className="bg-gray-50">
                          <td colSpan="6" className="px-6 py-4">
                            {/* Add order details expansion view here */}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4 text-sm text-gray-500"
                    >
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
