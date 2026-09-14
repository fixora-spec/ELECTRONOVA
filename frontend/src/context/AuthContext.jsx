/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import { authService } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = sessionStorage.getItem('admin');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });
  const [token, setToken] = useState(() => sessionStorage.getItem('token') || null);

  const login = async (credenciales) => {
    const data = await authService.login(credenciales);
    setToken(data.token);
    setAdmin(data.admin);
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('admin', JSON.stringify(data.admin));
    return data;
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('admin');
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
