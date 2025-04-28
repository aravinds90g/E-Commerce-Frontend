"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

 const addToCart = (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
   setCart((prev) => {
     const existingItem = prev.find((cartItem) => cartItem.id === item.id);
     let message = "";
     let newCart: CartItem[];

     if (existingItem) {
       newCart = prev.map((cartItem) =>
         cartItem.id === item.id
           ? { ...cartItem, quantity: cartItem.quantity + quantity }
           : cartItem
       );
       message = `${quantity} ${item.name} added to cart (Total: ${
         existingItem.quantity + quantity
       })`;
     } else {
       newCart = [...prev, { ...item, quantity }];
       message = `${quantity} ${item.name} added to cart`;
     }

     // Return the new cart state
     return newCart;
   });
   setTimeout(() => {
     toast.success(`${quantity} ${item.name} added to cart`, {
       position: "bottom-right",
     });
   }, 0);
 };


   
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const itemToRemove = prev.find((item) => item.id === id);
      if (itemToRemove) {
        console.log("cart removed");
        
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.log("useCart must be used within a CartProvider");
  }
  return context;
};
