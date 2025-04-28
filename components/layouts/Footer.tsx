"use client";

import React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  LogIn,
  LogOut,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">ShopCartBliss</h3>
            <p className="text-gray-400 mb-4">
              Your one-stop destination for quality products at affordable
              prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/productDetails"
                  className="text-gray-400 hover:text-white transition"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/pages/category"
                  className="text-gray-400 hover:text-white transition"
                >
                  Categories
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Auth Status / Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <SignedOut>
                <li>
                  <SignInButton mode="modal">
                    <button className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                      <LogIn size={18} /> Sign In
                    </button>
                  </SignInButton>
                </li>
              </SignedOut>
              <SignedIn>
                <li>
                  <UserButton afterSignOutUrl="/" />
                </li>
                <li>
                  <SignOutButton>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                      <LogOut size={18} /> Sign Out
                    </button>
                  </SignOutButton>
                </li>
              </SignedIn>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-4 text-gray-400 text-sm">
              <div className="flex items-start">
                <MapPin size={18} className="mr-3 mt-0.5" />
                <span>123 Commerce St, City, Country</span>
              </div>
              <div className="flex items-start">
                <Phone size={18} className="mr-3 mt-0.5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start">
                <Mail size={18} className="mr-3 mt-0.5" />
                <span>support@shopcartbliss.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-10 pt-6">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ShopCartBliss. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
