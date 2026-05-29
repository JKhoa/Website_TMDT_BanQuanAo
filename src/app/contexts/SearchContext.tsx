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

import { createContext, useContext, useState, useMemo, useCallback } from "react";
import api from "../services/api";
import { products as localProducts } from "../data/products";

const SearchContext = createContext<any>(null);

export function SearchProvider({ children }) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = safeLocalStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });

  const searchProducts = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) return [];
    
    const q = searchQuery.toLowerCase().trim();

    try {
      // Try backend search first
      const res = await api.getProducts({ search: q, limit: 50 });
      if (res.products && res.products.length > 0) {
        return res.products;
      }
    } catch {
      // Backend unavailable, fall through to local search
    }

    // Fallback: local search
    const words = q.split(/\s+/);
    return localProducts
      .map((product) => {
        let score = 0;
        const searchFields = [
          product.name.toLowerCase(),
          product.brand.toLowerCase(),
          product.description.toLowerCase(),
          product.category.toLowerCase(),
          product.subcategory.toLowerCase(),
          ...(product.tags || []).map(t => t.toLowerCase())
        ].join(" ");
        
        if (product.name.toLowerCase().includes(q)) score += 10;
        
        words.forEach(word => {
          if (searchFields.includes(word)) score += 3;
        });
        
        if (product.tags) {
          product.tags.forEach(tag => {
            if (tag.toLowerCase().includes(q)) score += 5;
          });
        }
        
        if (product.brand.toLowerCase().includes(q)) score += 4;
        
        return { ...product, score };
      })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score);
  }, []);

  // Synchronous local search for instant suggestions (non-blocking)
  const searchProductsLocal = useCallback((searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) return [];
    
    const q = searchQuery.toLowerCase().trim();
    const words = q.split(/\s+/);
    
    return localProducts
      .map((product) => {
        let score = 0;
        const searchFields = [
          product.name.toLowerCase(),
          product.brand.toLowerCase(),
          product.description.toLowerCase(),
          product.category.toLowerCase(),
          product.subcategory.toLowerCase(),
          ...(product.tags || []).map(t => t.toLowerCase())
        ].join(" ");
        
        if (product.name.toLowerCase().includes(q)) score += 10;
        words.forEach(word => {
          if (searchFields.includes(word)) score += 3;
        });
        if (product.tags) {
          product.tags.forEach(tag => {
            if (tag.toLowerCase().includes(q)) score += 5;
          });
        }
        if (product.brand.toLowerCase().includes(q)) score += 4;
        
        return { ...product, score };
      })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score);
  }, []);

  const suggestions = useMemo(() => {
    if (!query || query.trim().length < 2) return [];
    return searchProductsLocal(query).slice(0, 5);
  }, [query, searchProductsLocal]);

  const addRecentSearch = useCallback((term) => {
    setRecentSearches((prev) => {
      const updated = [term, ...prev.filter((s) => s !== term)].slice(0, 10);
      safeLocalStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    safeLocalStorage.removeItem("recentSearches");
  }, []);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        searchProducts,
        searchProductsLocal,
        suggestions,
        recentSearches,
        addRecentSearch,
        clearRecentSearches
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}
