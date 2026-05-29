"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "../../utils/supabase/client";
import { addToCartAction, removeFromCartAction, updateCartItemQuantityAction, clearCartAction } from "../actions/cart";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const { user } = useAuth();
  const supabase = createClient();

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          size,
          color,
          products (
            name,
            price,
            sale_price,
            images,
            stock
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Transform data to match previous interface
      const formattedCart = data?.map((item: any) => {
        const prod = Array.isArray(item.products) ? item.products[0] : item.products;
        return {
          cartItemId: item.id,
          id: item.product_id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          name: prod?.name,
          price: prod?.price,
          salePrice: prod?.sale_price,
          image: prod?.images?.[0] || '',
          stock: prod?.stock
        };
      }) || [];
      
      setCart(formattedCart);
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product: any, size: string, color: string, quantity = 1) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }
    
    const maxStock = product.stock !== undefined ? product.stock : 99;
    
    const existingItem = cart.find(
      (item) => item.id === product.id && item.size === size && item.color === color
    );

    let newQuantity = quantity;
    if (existingItem) {
      newQuantity = existingItem.quantity + quantity;
    }

    if (newQuantity > maxStock) {
      toast.error(`Xin lỗi, sản phẩm này chỉ còn ${maxStock} sản phẩm trong kho.`);
      newQuantity = maxStock;
    }

    const res = await addToCartAction(product.id, newQuantity - (existingItem ? existingItem.quantity : 0), size, color);
    if (res.success) {
      toast.success("Đã thêm vào giỏ hàng");
      fetchCart();
    } else {
      toast.error(res.error || "Có lỗi xảy ra");
    }
  };

  const removeFromCart = async (productId: string, size: string, color: string) => {
    const item = cart.find((i) => i.id === productId && i.size === size && i.color === color);
    if (item && item.cartItemId) {
      const res = await removeFromCartAction(item.cartItemId);
      if (res.success) {
        fetchCart();
      }
    }
  };

  const updateQuantity = async (productId: string, size: string, color: string, quantity: number) => {
    const item = cart.find((i) => i.id === productId && i.size === size && i.color === color);
    if (!item || !item.cartItemId) return;

    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    const maxStock = item.stock !== undefined ? item.stock : 99;
    const validQuantity = Math.min(quantity, maxStock);
    
    if (quantity > maxStock) {
      toast.error(`Xin lỗi, sản phẩm này chỉ còn ${maxStock} sản phẩm trong kho.`);
    }

    const res = await updateCartItemQuantityAction(item.cartItemId, validQuantity);
    if (res.success) {
      fetchCart();
    }
  };

  const clearCart = async () => {
    const res = await clearCartAction();
    if (res.success) {
      fetchCart();
    }
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
        refreshCart: fetchCart
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
