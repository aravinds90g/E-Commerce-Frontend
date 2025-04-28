"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import OrdersPage from "@/components/OrdersPage"; // adjust path if needed

const OrdersClientPage: React.FC = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading user...</div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-red-500">
        You must be signed in to view orders.
      </div>
    );
  }

  return <OrdersPage userId={user.id} />;
};

export default OrdersClientPage;
