"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient } from "../../utils/supabase/client";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const formatUser = (supabaseUser: any) => {
    if (!supabaseUser) return null;
    return {
      ...supabaseUser,
      ...supabaseUser.user_metadata,
    };
  };

  // On mount: listen to Supabase auth state
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(formatUser(session?.user));
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(formatUser(session?.user));
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch orders from Supabase DB
  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders from Supabase:", error);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateProfile = async (updatedData: any) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updatedData
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const addAddress = async (address: any) => {
    const currentAddresses = user?.user_metadata?.addresses || [];
    const newAddress = { ...address, id: Date.now().toString() };
    await updateProfile({ addresses: [...currentAddresses, newAddress] });
  };

  const updateAddress = async (addressId: string, updatedAddress: any) => {
    const currentAddresses = user?.user_metadata?.addresses || [];
    const newAddresses = currentAddresses.map((addr: any) =>
      addr.id === addressId ? { ...addr, ...updatedAddress } : addr
    );
    await updateProfile({ addresses: newAddresses });
  };

  const deleteAddress = async (addressId: string) => {
    const currentAddresses = user?.user_metadata?.addresses || [];
    const newAddresses = currentAddresses.filter((addr: any) => addr.id !== addressId);
    await updateProfile({ addresses: newAddresses });
  };

  const createOrder = async (orderData: any) => {
    if (!user) throw new Error("Vui lòng đăng nhập để đặt hàng");
    
    // Stuff items into shipping_info to bypass order_items foreign key constraints if products aren't seeded
    const enrichedShippingInfo = {
      ...orderData.shippingInfo,
      items: orderData.items // Save cart items in JSONB
    };

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: orderData.total,
        shipping_info: enrichedShippingInfo,
        payment_method: orderData.paymentMethod,
        status: 'pending'
      })
      .select()
      .single();
      
    if (error) {
      console.error("Order creation error:", error);
      throw new Error(error.message);
    }
    
    // Optionally try to insert into order_items, but don't fail if it violates foreign keys (e.g. unseeded products)
    try {
      const orderItems = orderData.items.map((item: any) => ({
        order_id: order.id,
        product_id: item.id.toString().length === 36 ? item.id : null, // Only insert valid UUIDs, otherwise null
        quantity: item.quantity,
        price: item.salePrice || item.price || 0,
        size: item.size,
        color: item.color
      }));
      
      const validItems = orderItems.filter((i: any) => i.product_id !== null);
      if (validItems.length > 0) {
        await supabase.from('order_items').insert(validItems);
      }
    } catch (e) {
      console.log("Could not insert order_items, relying on JSONB data instead", e);
    }

    setOrders([order, ...orders]);
    return order;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        loading,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        fetchOrders,
        createOrder
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



