/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import { authService } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user') || sessionStorage.getItem('admin');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [admin, setAdmin] = useState(() => {
    const savedAdmin = sessionStorage.getItem('admin');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  const [token, setToken] = useState(() => sessionStorage.getItem('token') || null);

  const login = async (credenciales) => {
    const data = await authService.login(credenciales);
    const usuarioActual = data.user || data.admin;

    setToken(data.token);
    setUser(usuarioActual);
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('user', JSON.stringify(usuarioActual));

    if (usuarioActual?.rol === 'admin' || data.admin) {
      setAdmin(data.admin || usuarioActual);
      sessionStorage.setItem('admin', JSON.stringify(data.admin || usuarioActual));
    } else {
      setAdmin(null);
      sessionStorage.removeItem('admin');
    }

    return data;
  };

  const register = async (datosRegistro) => {
    const data = await authService.register(datosRegistro);
    const usuarioActual = data.user;

    setToken(data.token);
    setUser(usuarioActual);
    setAdmin(null);
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('user', JSON.stringify(usuarioActual));
    sessionStorage.removeItem('admin');

    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAdmin(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('admin');
  };

  const isAdmin = user?.rol === 'admin' || !!admin;

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        token,
        rol: user?.rol || 'invitado',
        isAdmin,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
