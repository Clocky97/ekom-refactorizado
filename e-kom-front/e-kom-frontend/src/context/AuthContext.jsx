import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../api/auth.service.js';
import api from '../api/api.js';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

/*
  AuthProvider responsibilities:
  - centralize login/logout/register
  - persist token in localStorage
  - load profile on mount if token exists
  - expose user, isAuthenticated, loading, login, logout, register
  - provide a ProtectedRoute helper
*/
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setToken = useCallback((token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, []);

  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // authService.getProfile calls protected endpoint using axios instance with interceptor
      const profileData = await authService.getProfile();
      setUser(profileData);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // token invalid or expired -> remove
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setToken]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (!response.token) {
        throw new Error('No se recibió token del servidor');
      }
      // persist token (the axios interceptor reads from localStorage)
      setToken(response.token);
      // Optionally set default Authorization header immediately
      api.defaults.headers.common.Authorization = `Bearer ${response.token}`;

      const profileData = await authService.getProfile();
      setUser(profileData);
      return { success: true };
    } catch (err) {
      console.error('Login failed:', err);
      setToken(null);
      throw err;
    }
  };

  const logout = async () => {
    try {
      // call backend logout if available
      await authService.logout();
    } catch (err) {
      console.warn('Logout request failed, clearing local session anyway', err);
    }
    setToken(null);
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (err) {
      console.error('Register failed:', err);
      throw err;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    register,
    refreshProfile: loadProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Simple ProtectedRoute component consumers can use in the router
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // or a spinner
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};