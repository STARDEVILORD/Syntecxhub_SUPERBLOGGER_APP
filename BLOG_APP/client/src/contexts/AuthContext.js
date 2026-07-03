import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const cleanToken = token.replace(/^Bearer\s+/i, "").trim();
        const decoded = jwtDecode(cleanToken);
        setUser({
          id: decoded.user?.id || decoded.id,
          name: decoded.name || decoded.user?.name,
          email: decoded.email || decoded.user?.email,
        });
        api.defaults.headers.common["x-auth-token"] = cleanToken;
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (formData) => {
    const res = await api.post("/auth/login", formData);
    const cleanToken = res.data.token.replace(/^Bearer\s+/i, "").trim();
    localStorage.setItem("token", cleanToken);
    setToken(cleanToken);
    return res.data;
  };

  const register = async (formData) => {
    const res = await api.post("/auth/register", formData);
    const cleanToken = res.data.token.replace(/^Bearer\s+/i, "").trim();
    localStorage.setItem("token", cleanToken);
    setToken(cleanToken);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["x-auth-token"];
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  return (
    <AuthContext.Provider
      value={{ token, user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
