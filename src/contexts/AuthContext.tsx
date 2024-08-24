"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "../../supabaseClient"; // Adjust the path to your supabaseClient
import { User as SupabaseUser } from "@supabase/supabase-js";
import { addUser } from "../supabase/user";

interface AuthContextType {
  user: SupabaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (
    email: string,
    password: string,
    fullName: string,
    phoneNumber: string,
  ) => Promise<{ error: string | null }>;
  logout: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.warn(data);
    if (error) {
      console.error("Login error:", error.message);
      return { error: error.message };
    }
    return { error: null };
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    phoneNumber: string,
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Registration error:", error.message);
      return { error: error.message };
    }

    if (data.user) {
      const { error: addUserError } = await addUser({
        id: data.user.id,
        email: data.user.email ?? "",
        fullname: fullName,
        phone_number: phoneNumber,
        role: "client",
      });

      if (addUserError) {
        console.error("Error adding user to database:", addUserError.message);
        return { error: addUserError.message };
      }
    }

    return { error: null };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
      return { error: error.message };
    }
    setUser(null);
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
