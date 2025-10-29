import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/auth.service.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const profileData = await authService.getProfile();
        setUser(profileData); 
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (credentials) => {
    try {
      await authService.login(credentials);
      const profileData = await authService.getProfile();
      setUser(profileData);
      return { success: true, message: "Inicio de sesión exitoso" };
    } catch (error) {
      console.error("Error en login:", error);
      const errorMessage = error.response?.data?.message || "Credenciales inválidas.";
      throw new Error(errorMessage);
      }
    };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return { success: true, message: response.message };
    } catch (error) {
      console.error("Error en registro:", error.response.data);
      const errorMsg = error.response?.data?.errors?.join(', ') || error.response?.data?.message || "Error desconocido al registrar.";
      throw new Error(errorMsg);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};