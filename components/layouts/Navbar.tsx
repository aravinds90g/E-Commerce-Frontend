"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { useTheme } from "@/context/ThemeContext";

const Navbar = () => {
  const { cartCount } = useCart();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/pages/productDetails" },
    { name: "Categories", href: "/pages/category" },
    
    ...(isSignedIn && !isAdmin
      ? [{ name: "My Orders", href: "/pages/orders" }]
      : []),
  ];

  useEffect(() => {
    if (isSignedIn && user) {
      const adminStatus = user.publicMetadata?.role === "admin";
      setIsAdmin(adminStatus);

      if (adminStatus) {
        router.replace("/admin");
      }

      const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
        imageUrl: user.imageUrl,
        role: user.publicMetadata?.role || "customer",
      };
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      setIsAdmin(false);
      localStorage.removeItem("userData");
    }
  }, [isSignedIn, user, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      setSearchInput("");
      setSearchOpen(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!isLoaded) return <LoadingSpinner />;

  // Simplified admin view
  if (isAdmin) {
    return (
      <header
        className={`sticky top-0 z-50 shadow-sm transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/admin" className="flex items-center">
              <h1
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                ShopCart<span className="text-pink-500">Bliss</span> Admin
              </h1>
            </Link>

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode`}
              >
                {theme === "light" ? (
                  <MoonIcon className="w-5 h-5" />
                ) : (
                  <SunIcon className="w-5 h-5" />
                )}
              </button>

              <UserButton afterSignOutUrl="/" />
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Admin
              </span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Regular user view
  return (
    <header
      className={`sticky top-0 z-50 shadow-sm transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden mr-2"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="flex items-center">
              <h1
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                ShopCart<span className="text-pink-500">Bliss</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ name, href }) => (
              <Link
                key={href}
                href={href}
                className={`font-medium transition-colors ${
                  pathname === href
                    ? theme === "dark"
                      ? "text-indigo-400"
                      : "text-indigo-600"
                    : theme === "dark"
                    ? "text-gray-300 hover:text-indigo-400"
                    : "text-gray-700 hover:text-indigo-600"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light" ? (
                <MoonIcon className="w-5 h-5" />
              ) : (
                <SunIcon className="w-5 h-5" />
              )}
            </button>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg w-64 focus:ring-2 outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 focus:ring-indigo-500 text-white"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              <Search
                className={`absolute left-3 top-2.5 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
                size={18}
              />
            </form>

            {/* User/Auth */}
            <div className="flex items-center space-x-2">
              {isSignedIn ? (
                <>
                  <UserButton afterSignOutUrl="/" />
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Hi, {user?.firstName || user?.username}
                  </span>
                </>
              ) : (
                <SignInButton mode="modal">
                 
                    Sign In
                
                </SignInButton>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Search and Actions */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link href="/cart" className="relative p-2">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden py-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg w-full focus:ring-2 outline-none ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 focus:ring-indigo-500 text-white"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              <Search
                className={`absolute left-3 top-3 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
                size={18}
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden pb-4 ${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map(({ name, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md font-medium ${
                    pathname === href
                      ? theme === "dark"
                        ? "bg-gray-800 text-indigo-400"
                        : "bg-gray-100 text-indigo-600"
                      : theme === "dark"
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {name}
                </Link>
              ))}
              <div className="px-3 pt-2">
                {isSignedIn ? (
                  <div className="flex items-center space-x-2">
                    <UserButton afterSignOutUrl="/" />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {user?.firstName || user?.username}
                    </span>
                  </div>
                ) : (
                  <SignInButton mode="modal">
                    
                      Sign In
                    
                  </SignInButton>
                )}
              </div>
              <button
                onClick={toggleTheme}
                className={`px-3 py-2 text-left rounded-md font-medium ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Add these simple icon components
const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const SunIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const LoadingSpinner = () => (
  <div className="h-16 bg-white dark:bg-gray-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
);

export default Navbar;
