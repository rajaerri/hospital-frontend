import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem('lifecare_token') || localStorage.getItem('careplus_token') || null
  );
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lifecare_user') || localStorage.getItem('careplus_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const isAuthenticated = Boolean(token && user);

  // Listen for session expired events dispatched by axiosClient
  useEffect(() => {
    const handleExpired = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('lifecare_session_expired', handleExpired);
    window.addEventListener('careplus_session_expired', handleExpired);
    return () => {
      window.removeEventListener('lifecare_session_expired', handleExpired);
      window.removeEventListener('careplus_session_expired', handleExpired);
    };
  }, []);

  // Login handler
  const login = async (email, password) => {
    const authData = await loginUser({ email, password });
    const receivedToken = authData.token;
    const receivedUser = authData.user;

    localStorage.setItem('lifecare_token', receivedToken);
    localStorage.setItem('lifecare_user', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);

    return authData;
  };

  // Register handler
  const register = async (userData) => {
    return await registerUser(userData);
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('lifecare_token');
    localStorage.removeItem('lifecare_user');
    localStorage.removeItem('careplus_token');
    localStorage.removeItem('careplus_user');
    setToken(null);
    setUser(null);
  };

  // Update stored user profile
  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem('lifecare_user', JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser
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
