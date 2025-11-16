// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../api/auth.service.js";
import api from "../api/api.js";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// 🔥 Función universal para normalizar el usuario que viene del backend
function normalizeUser(raw) {
  if (!raw) return null;

  return {
    id: raw.id ?? raw._id ?? raw.user?.id ?? null,
    username: raw.username ?? raw.user?.username ?? "",
    email: raw.email ?? raw.user?.email ?? "",
    role: raw.role ?? raw.user?.role ?? "user",
    ...raw, // por si necesitás más adelante
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Guarda/elimina token de localStorage
  const setToken = useCallback((token) => {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
    }
  }, []);

  // 🔥 Cargar sesión activa
  const loadSession = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    try {
      const profile = await authService.getProfile();
      const normalized = normalizeUser(profile);
      setUser(normalized);
    } catch (err) {
      console.warn("⚠ Token inválido, borrando sesión");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setToken]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // 🔥 Login
  const login = async (credentials) => {
  try {
    const response = await authService.login(credentials);

    if (!response.token) {
      throw new Error("No se recibió token del servidor");
    }

    // Guardar token
    setToken(response.token);
    api.defaults.headers.common.Authorization = `Bearer ${response.token}`;

    // Cargar perfil del usuario
    const profileData = await authService.getProfile();

    // 🔥 Guardar user en localStorage
    localStorage.setItem("user", JSON.stringify(profileData));

    setUser(profileData);

    return { success: true };
  } catch (err) {
    console.error("Login failed:", err);
    setToken(null);
    throw err;
  }
};


  const logout = async () => {
    try {
      await authService.logout();
    } catch (_) {}

    setToken(null);
    setUser(null);
  };

  const register = async (data) => {
    return await authService.register(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        register,
        refreshProfile: loadSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔐 Ruta protegida
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
