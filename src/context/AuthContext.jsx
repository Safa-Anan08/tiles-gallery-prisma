"use client";

import { createContext, useContext, useState, useEffect } from "react";
import authClient from "@/lib/auth-client";

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const storedToken = authClient.getToken();
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }
      setToken(storedToken);
      const currentUser = await authClient.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      try {
        const storedToken = authClient.getToken();
        if (!storedToken) {
          if (isMounted) {
            setUser(null);
            setToken(null);
            setLoading(false);
          }
          return;
        }
        if (isMounted) setToken(storedToken);
        const currentUser = await authClient.getCurrentUser();
        if (isMounted) setUser(currentUser);
      } catch {
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const result = await authClient.login(email, password);
    if (result.success) {
      setUser(result.user);
      setToken(result.token);
    }
    setLoading(false);
    return result;
  };

  const register = async (name, email, password) => {
    setLoading(true);
    const result = await authClient.register(name, email, password);
    if (result.success) {
      setUser(result.user);
      setToken(result.token);
    }
    setLoading(false);
    return result;
  };

  const googleLogin = async (credential) => {
    setLoading(true);
    const result = await authClient.googleLogin(credential);
    if (result.success) {
      setUser(result.user);
      setToken(result.token);
    }
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    await authClient.logout();
    setUser(null);
    setToken(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: user ? { ...user, user, email: user.email, data: { user } } : null,
        token,
        loading,
        login,
        register,
        googleLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}

export function useAuth() {
  return useContext(AuthContext);
}
