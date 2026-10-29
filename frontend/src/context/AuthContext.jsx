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

    if (data.issues && data.issues.length > 0) {
      const err = new Error(data.issues[0]?.message || 'Credenciales incorrectas.');
      err.response = { data };
      throw err;
    }

    const usuarioActual = data.user || data.admin;
    const authToken = data.token || data.jwtToken;

    setToken(authToken);
    setUser(usuarioActual);
    sessionStorage.setItem('token', authToken);
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

    if (data.issues && data.issues.length > 0) {
      const err = new Error(data.issues[0]?.message || 'Error al registrar la cuenta.');
      err.response = { data };
      throw err;
    }

    const usuarioActual = data.user || data.newUser;
    const authToken = data.token || data.jwtToken;

    if (authToken) {
      setToken(authToken);
      sessionStorage.setItem('token', authToken);
    }
    if (usuarioActual) {
      setUser(usuarioActual);
      sessionStorage.setItem('user', JSON.stringify(usuarioActual));
    }
    setAdmin(null);
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
