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



