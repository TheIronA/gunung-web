"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "./products";
import { getPriceDisplayData } from "./price-helpers";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number, selectedSize?: string) => void;
  removeItem: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  getCartQuantity: (productId: string, selectedSize?: string) => number;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("gunung-cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("gunung-cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (product: Product, quantity: number, selectedSize?: string) => {
    setItems((current) => {
      const existingIndex = current.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize
      );

      if (existingIndex >= 0) {
        // Update quantity of existing item
        const updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        // Add new item
        return [...current, { product, quantity, selectedSize }];
      }
    });
  };

  const removeItem = (productId: string, selectedSize?: string) => {
    setItems((current) =>
      current.filter(
        (item) =>
          !(item.product.id === productId && item.selectedSize === selectedSize)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeItem(productId, selectedSize);
      return;
    }

    setItems((current) => {
      const index = current.findIndex(
        (item) =>
          item.product.id === productId &&
          item.selectedSize === selectedSize
      );

      if (index >= 0) {
        const updated = [...current];
        updated[index] = { ...updated[index], quantity };
        return updated;
      }

      return current;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartQuantity = (productId: string, selectedSize?: string): number => {
    const item = items.find(
      (item) =>
        item.product.id === productId &&
        item.selectedSize === selectedSize
    );
    return item?.quantity || 0;
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    // Use the same price calculation logic as the display to ensure consistency
    const priceData = getPriceDisplayData(
      item.product.price,
      item.product.sale_price,
      item.product.sale_end_date
    );
    return sum + priceData.currentPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartQuantity,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
