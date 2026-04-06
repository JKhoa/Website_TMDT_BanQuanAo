import { createContext, useContext, useState, useMemo, useCallback } from "react";
import { products } from "../data/products";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });

  const searchProducts = useCallback((searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) return [];
    
    const q = searchQuery.toLowerCase().trim();
    const words = q.split(/\s+/);
    
    return products
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
        
        // Exact match in name gets highest score
        if (product.name.toLowerCase().includes(q)) score += 10;
        
        // Each word match
        words.forEach(word => {
          if (searchFields.includes(word)) score += 3;
        });
        
        // Tag matches
        if (product.tags) {
          product.tags.forEach(tag => {
            if (tag.toLowerCase().includes(q)) score += 5;
          });
        }
        
        // Brand match
        if (product.brand.toLowerCase().includes(q)) score += 4;
        
        return { ...product, score };
      })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score);
  }, []);

  const suggestions = useMemo(() => {
    if (!query || query.trim().length < 2) return [];
    return searchProducts(query).slice(0, 5);
  }, [query, searchProducts]);

  const addRecentSearch = useCallback((term) => {
    setRecentSearches((prev) => {
      const updated = [term, ...prev.filter((s) => s !== term)].slice(0, 10);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  }, []);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        searchProducts,
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
