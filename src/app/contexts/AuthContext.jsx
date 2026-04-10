import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper: get user-scoped localStorage key for orders
  const getOrdersKey = (userId) => `orders_${userId || "guest"}`;

  // On mount: restore session from token or localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch (error) {
          if (error.message === 'Failed to fetch') {
            // Backend unavailable, fallback to local storage user
            const savedUser = localStorage.getItem("user");
            if (savedUser) setUser(JSON.parse(savedUser));
          } else {
            // Token invalid, clear it
            api.clearTokens();
            localStorage.removeItem("user");
          }
        }
      } else {
        // Fallback to localStorage user (mock mode)
        const savedUser = localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));
      }

      setLoading(false);
    };
    initAuth();
  }, []);

  // Fetch orders from backend when user changes
  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    try {
      const res = await api.getOrders();
      setOrders(res.orders || []);
    } catch {
      // Fallback: load from user-scoped localStorage
      const savedOrders = localStorage.getItem(getOrdersKey(user.id));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Save orders to user-scoped localStorage as backup
  useEffect(() => {
    if (user && orders.length > 0) {
      localStorage.setItem(getOrdersKey(user.id), JSON.stringify(orders));
    }
  }, [orders, user]);

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
    setOrders([]);
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
    const isKnownAdmin = email === "admin@fashionshop.vn";
    const saved = localStorage.getItem("registeredUsers");
    const registeredUsers = saved ? JSON.parse(saved) : {};
    if (registeredUsers[email]) {
      const existingUser = registeredUsers[email];
      const normalizedUser = isKnownAdmin
        ? { ...existingUser, role: "admin", isAdmin: true }
        : existingUser;
      registeredUsers[email] = normalizedUser;
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
      setUser(normalizedUser);
      return { success: true, user: normalizedUser };
    }
    const mockUser = {
      id: Date.now(),
      email,
      name: email.split("@")[0],
      phone: "",
      role: isKnownAdmin ? "admin" : "customer",
      isAdmin: isKnownAdmin,
      addresses: []
    };
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

  const createOrder = async (orderData) => {
    // Build payload matching backend schema
    const backendPayload = {
      items: orderData.items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        size: item.size || "",
        color: item.color || ""
      })),
      shipping_name: orderData.shippingInfo.name,
      shipping_phone: orderData.shippingInfo.phone,
      shipping_address: orderData.shippingInfo.address,
      shipping_city: orderData.shippingInfo.city || "",
      shipping_district: orderData.shippingInfo.district || "",
      shipping_ward: orderData.shippingInfo.ward || "",
      payment_method: orderData.paymentMethod || "cod",
      shipping_method: orderData.shippingMethod || "standard"
    };

    try {
      const res = await api.createOrder(backendPayload);
      // Refresh orders from backend
      await fetchOrders();
      return res.order;
    } catch {
      // Fallback: create local order
      const newOrder = {
        id: Date.now(),
        ...orderData,
        createdAt: new Date().toISOString(),
        status: "pending"
      };
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await api.cancelOrder(orderId);
      // Refresh orders from backend
      await fetchOrders();
    } catch {
      // Fallback: local cancel
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    }
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
        cancelOrder,
        fetchOrders
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
