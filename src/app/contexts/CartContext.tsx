"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('fashionshop_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng từ localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('fashionshop_cart', JSON.stringify(cart));
      } catch (error) {
        console.error("Lỗi khi lưu giỏ hàng:", error);
      }
    }
  }, [cart, isLoaded]);

  const addToCart = (product: any, size: string, color: string, quantity = 1) => {
    const maxStock = product.stock !== undefined ? product.stock : 99;
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size && item.color === color
      );

      if (existingItemIndex >= 0) {
        const newCart = [...prevCart];
        const existingItem = newCart[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > maxStock) {
          toast.error(`Xin lỗi, sản phẩm này chỉ còn ${maxStock} sản phẩm trong kho.`);
          existingItem.quantity = maxStock;
        } else {
          existingItem.quantity = newQuantity;
        }
        return newCart;
      } else {
        const newItemQuantity = quantity > maxStock ? maxStock : quantity;
        if (quantity > maxStock) {
          toast.error(`Xin lỗi, sản phẩm này chỉ còn ${maxStock} sản phẩm trong kho.`);
        }
        
        return [...prevCart, {
          cartItemId: Date.now().toString() + Math.random().toString(36).substring(7),
          id: product.id,
          name: product.name,
          price: product.price,
          salePrice: product.salePrice || product.sale_price,
          image: product.image || (product.images ? product.images[0] : ''),
          stock: maxStock,
          size,
          color,
          quantity: newItemQuantity
        }];
      }
    });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart(prevCart => prevCart.filter(
      item => !(item.id === productId && item.size === size && item.color === color)
    ));
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCart(prevCart => prevCart.map(item => {
      if (item.id === productId && item.size === size && item.color === color) {
        const maxStock = item.stock !== undefined ? item.stock : 99;
        const validQuantity = Math.min(quantity, maxStock);
        
        if (quantity > maxStock) {
          toast.error(`Xin lỗi, sản phẩm này chỉ còn ${maxStock} sản phẩm trong kho.`);
        }
        
        return { ...item, quantity: validQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.salePrice || item.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        refreshCart: () => {} // Kept for compatibility if used elsewhere
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
