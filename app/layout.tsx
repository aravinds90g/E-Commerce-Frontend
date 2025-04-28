import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes"; // optional, for theming Clerk components
import { ThemeProvider } from "@/context/ThemeContext";

import "./globals.css";

import Navbar from "@/components/layouts/Navbar";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import { SearchProvider } from "@/context/SearchContext";

export const metadata: Metadata = {
  title: "E-Shop - Your Online Shopping Destination",
  description:
    "Discover amazing products at competitive prices. Shop the latest trends in electronics, fashion, home & living, and beauty.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark, // or use `undefined` for default
      }}
    >
      <html lang="en">
        <body>
          <ThemeProvider>
            <Toaster position="bottom-right" />
            <CartProvider>
              <SearchProvider>
                <Navbar />
                {children}
              </SearchProvider>
            </CartProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
