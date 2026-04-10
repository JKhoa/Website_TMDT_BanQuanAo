import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size, color, quantity = 1) => {
    const maxStock = product.stock !== undefined ? product.stock : 99;
    
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.size === size && item.color === color
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > maxStock) {
          alert(`Xin lỗi, sản phẩm này chỉ còn ${maxStock} sản phẩm trong kho.`);
          return prevCart.map((item) =>
            item.id === product.id && item.size === size && item.color === color
              ? { ...item, quantity: maxStock }
              : item
          );
        }
        return prevCart.map((item) =>
          item.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      if (quantity > maxStock) {
        alert(`Xin lỗi, sản phẩm này chỉ còn ${maxStock} sản phẩm trong kho.`);
        return [...prevCart, { ...product, size, color, quantity: maxStock }];
      }

      return [...prevCart, { ...product, size, color, quantity }];
    });
  };

  const removeFromCart = (productId, size, color) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.id === productId && item.size === size && item.color === color)
      )
    );
  };

  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId && item.size === size && item.color === color) {
          // Check stock before updating quantity
          const maxStock = item.stock !== undefined ? item.stock : 99; // Fallback to 99 if stock is undefined
          const validQuantity = Math.min(quantity, maxStock);
          if (quantity > maxStock) {
            alert(`Xin lỗi, sản phẩm này chỉ còn ${maxStock} sản phẩm trong kho.`);
          }
          return { ...item, quantity: validQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.salePrice || item.price;
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
        getCartCount
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
