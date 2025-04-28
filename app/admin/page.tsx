"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ProductsManagement from "@/components/admin/ProductsManagement";
import CategoriesManagement from "@/components/admin/CategoriesManagement";
import { Product, Category, Order } from "@/types";
import OrdersManagement from "@/components/admin/OrdersManagement";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import {
  LayoutDashboard,
  Package,
  ListOrdered,
  Users,
  LineChart,
  Menu,
  X,
} from "lucide-react";

const AdminPage = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || user?.publicMetadata?.role !== "admin") {
      toast.error("Unauthorized access");
      router.push("/");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, categoriesRes, ordersRes] = await Promise.all([
          fetch("https://e-commerce-backend-1-2dj3.onrender.com/products"),
          fetch("https://e-commerce-backend-1-2dj3.onrender.com/categories"),
          fetch("https://e-commerce-backend-1-2dj3.onrender.com/api/order"),
        ]);

        const [productsData, categoriesData, ordersData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
          ordersRes.json(),
        ]);

        setProducts(productsData.data || []);
        setCategories(categoriesData.data || []);
        setOrders(ordersData || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, isSignedIn, user?.publicMetadata?.role, router]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isSignedIn || user?.publicMetadata?.role !== "admin") {
    return null;
  }

  const DashboardOverview = () => (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Total Sales",
            value: orders
              .reduce((sum, order) => sum + (order.total || 0), 0)
              .toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              }),
            trend: "↑ 12% from last month",
            trendColor: "text-green-600",
            icon: (
              <div className="p-3 rounded-full bg-primary text-primary-foreground">
                <LineChart size={20} />
              </div>
            ),
          },
          {
            title: "Orders",
            value: orders.length.toLocaleString(),
            trend: "↑ 5% from last month",
            trendColor: "text-green-600",
            icon: (
              <div className="p-3 rounded-full bg-secondary text-secondary-foreground">
                <ListOrdered size={20} />
              </div>
            ),
          },
          {
            title: "Products",
            value: products.length.toLocaleString(),
            trend: `in ${categories.length} categories`,
            trendColor: "text-muted-foreground",
            icon: (
              <div className="p-3 rounded-full bg-muted text-muted-foreground">
                <Package size={20} />
              </div>
            ),
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-background p-6 rounded-xl shadow-sm border border-border transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold mt-1 text-foreground">
                  {stat.value}
                </p>
                <p className={`text-xs mt-2 ${stat.trendColor}`}>
                  {stat.trend}
                </p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders and Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Recent Orders
          </h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {new Date(order.createdAt || "").toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <p className="font-medium text-foreground">
                    ${(order.total || 0).toFixed(2)}
                  </p>
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                      order.status === "SHIPPED"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "DELIVERED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "PROCESSING"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Low Stock Products
          </h3>
          <div className="space-y-3">
            {products
              .filter((p) => (p.stock || 0) < 50)
              .sort((a, b) => (a.stock || 0) - (b.stock || 0))
              .slice(0, 5)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <Package size={16} className="text-muted-foreground" />
                      )}
                    </div>
                    <p className="font-medium text-foreground truncate max-w-[120px]">
                      {product.name}
                    </p>
                  </div>
                  <span
                    className={`font-medium ${
                      (product.stock || 0) < 10
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {product.stock || 0} left
                  </span>
                </div>
              ))}
            {products.filter((p) => (p.stock || 0) < 50).length === 0 && (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No low stock products
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "products":
        return <ProductsManagement />;
      case "categories":
        return <CategoriesManagement />;
      case "orders":
        return <OrdersManagement />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "dashboard":
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Mobile Header */}
      <header className="md:hidden bg-background shadow-sm p-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 w-full md:w-64 bg-background shadow-lg md:shadow-none fixed md:static inset-y-0 left-0 z-50 md:z-auto transition-transform duration-300 ease-in-out`}
        >
          <div className="p-4 flex items-center justify-between border-b border-border md:hidden">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="p-4 space-y-1 overflow-y-auto h-full">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "products", label: "Products", icon: Package },
              { id: "categories", label: "Categories", icon: ListOrdered },
              { id: "orders", label: "Orders", icon: Users },
              { id: "analytics", label: "Analytics", icon: LineChart },
            ].map((item) => (
              <button
                key={item.id}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 hidden md:block">
              {activeTab === "dashboard"
                ? "Dashboard Overview"
                : activeTab === "products"
                ? "Product Management"
                : activeTab === "categories"
                ? "Category Management"
                : activeTab === "orders"
                ? "Order Management"
                : "Analytics Dashboard"}
            </h1>
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
