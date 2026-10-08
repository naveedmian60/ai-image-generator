import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('pixelforge_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and verify authentication on load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('pixelforge_token');
      if (storedToken) {
        try {
          const data = await authService.getProfile();
          setUser(data.user);
        } catch (err) {
          console.warn('Session expired or invalid, clearing authentication state');
          localStorage.removeItem('pixelforge_token');
          localStorage.removeItem('pixelforge_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    localStorage.setItem('pixelforge_token', data.token);
    localStorage.setItem('pixelforge_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (name, email, password, confirmPassword) => {
    const data = await authService.signup({ name, email, password, confirmPassword });
    localStorage.setItem('pixelforge_token', data.token);
    localStorage.setItem('pixelforge_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('pixelforge_token');
    localStorage.removeItem('pixelforge_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const data = await authService.getProfile();
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        signup,
        logout,
        refreshUser,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

