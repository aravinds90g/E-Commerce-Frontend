// Sidebar.tsx
import {
  LayoutDashboard,
  Package,
  ListOrdered,
  Users,
  LineChart,
  Settings,
} from "lucide-react";
import { User } from "@clerk/nextjs/server";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
}

const Sidebar = ({ activeTab, setActiveTab, user }: SidebarProps) => {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome, {user.firstName}</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "products", icon: Package, label: "Products" },
            { id: "categories", icon: ListOrdered, label: "Categories" },
            { id: "orders", icon: Users, label: "Customer Orders" },
            { id: "analytics", icon: LineChart, label: "Analytics" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full p-2 rounded-lg ${
                  activeTab === item.id
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
