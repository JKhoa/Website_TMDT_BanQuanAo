"use client";

const safeLocalStorage = {
  getItem: (k) => typeof window !== 'undefined' ? localStorage.getItem(k) : null,
  setItem: (k, v) => typeof window !== 'undefined' ? localStorage.setItem(k, v) : null,
  removeItem: (k) => typeof window !== 'undefined' ? localStorage.removeItem(k) : null,
  clear: () => typeof window !== 'undefined' ? localStorage.clear() : null
};
const safeSessionStorage = {
  getItem: (k) => typeof window !== 'undefined' ? sessionStorage.getItem(k) : null,
  setItem: (k, v) => typeof window !== 'undefined' ? sessionStorage.setItem(k, v) : null,
  removeItem: (k) => typeof window !== 'undefined' ? sessionStorage.removeItem(k) : null,
  clear: () => typeof window !== 'undefined' ? sessionStorage.clear() : null
};

import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext<any>(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = safeLocalStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    safeLocalStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
