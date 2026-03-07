import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const login = (email, password) => {
    // Mock login - in real app, this would call an API
    const mockUser = {
      id: 1,
      email,
      name: email.split("@")[0],
      phone: "0123456789",
      addresses: [
        {
          id: 1,
          name: "Địa chỉ nhà",
          address: "123 Đường ABC, Quận 1, TP.HCM",
          phone: "0123456789",
          isDefault: true
        }
      ]
    };
    setUser(mockUser);
    return { success: true, user: mockUser };
  };

  const register = (email, password, name) => {
    // Mock register
    const mockUser = {
      id: Date.now(),
      email,
      name,
      phone: "",
      addresses: []
    };
    setUser(mockUser);
    return { success: true, user: mockUser };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const addAddress = (address) => {
    setUser((prev) => ({
      ...prev,
      addresses: [...(prev.addresses || []), { ...address, id: Date.now() }]
    }));
  };

  const updateAddress = (addressId, updatedAddress) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.map((addr) =>
        addr.id === addressId ? { ...addr, ...updatedAddress } : addr
      )
    }));
  };

  const deleteAddress = (addressId) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((addr) => addr.id !== addressId)
    }));
  };

  const createOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      createdAt: new Date().toISOString(),
      status: "pending" // pending, processing, shipped, delivered, cancelled
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const cancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      )
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        createOrder,
        cancelOrder
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
