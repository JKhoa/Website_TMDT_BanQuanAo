import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from token or localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch {
          // Token invalid, clear it
          api.clearTokens();
          localStorage.removeItem("user");
        }
      } else {
        // Fallback to localStorage user (mock mode)
        const savedUser = localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));
      }

      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      setLoading(false);
    };
    initAuth();
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

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      setUser(res.user);
      return { success: true, user: res.user };
    } catch (error) {
      // If server is down, fall back to mock
      if (error.message === 'Failed to fetch') {
        return mockLogin(email, password);
      }
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, name) => {
    try {
      const res = await api.register(email, password, name);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      setUser(res.user);
      return { success: true, user: res.user };
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        return mockRegister(email, password, name);
      }
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    api.clearTokens();
    setUser(null);
  };

  const updateProfile = async (updatedData) => {
    try {
      const res = await api.updateProfile(updatedData);
      setUser(res.user);
      return { success: true };
    } catch {
      // Fallback: local update
      setUser((prev) => ({ ...prev, ...updatedData }));
      return { success: true };
    }
  };

  // Mock fallback functions (when backend is down)
  const mockLogin = (email, password) => {
    const saved = localStorage.getItem("registeredUsers");
    const registeredUsers = saved ? JSON.parse(saved) : {};
    if (registeredUsers[email]) {
      setUser(registeredUsers[email]);
      return { success: true, user: registeredUsers[email] };
    }
    const mockUser = { id: Date.now(), email, name: email.split("@")[0], phone: "", role: "customer", addresses: [] };
    setUser(mockUser);
    return { success: true, user: mockUser };
  };

  const mockRegister = (email, password, name) => {
    const mockUser = { id: Date.now(), email, name, phone: "", role: "customer", addresses: [] };
    const saved = localStorage.getItem("registeredUsers");
    const registeredUsers = saved ? JSON.parse(saved) : {};
    registeredUsers[email] = mockUser;
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    setUser(mockUser);
    return { success: true, user: mockUser };
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
      status: "pending"
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
        loading,
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
