/* eslint-disable react-refresh/only-export-components */
// Contexto y proveedor de autenticación
import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

export const AuthContext = createContext();

// Utilidades de sesión
const safeParse = (raw) => {
  if (!raw || raw === 'undefined' || raw === 'null') return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const esRolAdmin = (rol) => {
  const rolUpper = String(rol || '').toUpperCase();
  return rolUpper === 'ADMIN' || rolUpper === 'ADMINISTRATOR' || rolUpper === 'ADMINISTRADOR';
};

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    safeParse(sessionStorage.getItem('user') || sessionStorage.getItem('admin'))
  );

  const [admin, setAdmin] = useState(() => safeParse(sessionStorage.getItem('admin')));

  const [token, setToken] = useState(() => {
    const savedToken = sessionStorage.getItem('token');
    return savedToken && savedToken !== 'undefined' && savedToken !== 'null' ? savedToken : null;
  });

  const limpiarSesionLocal = () => {
    setToken(null);
    setUser(null);
    setAdmin(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('admin');
  };

  const guardarSesionLocal = (cuenta, authToken, adminData = null, refreshToken = null) => {
    if (authToken) {
      setToken(authToken);
      sessionStorage.setItem('token', authToken);
    }
    if (refreshToken) {
      sessionStorage.setItem('refreshToken', refreshToken);
    }
    if (cuenta) {
      setUser(cuenta);
      sessionStorage.setItem('user', JSON.stringify(cuenta));
    }
    if (adminData) {
      setAdmin(adminData);
      sessionStorage.setItem('admin', JSON.stringify(adminData));
    } else {
      setAdmin(null);
      sessionStorage.removeItem('admin');
    }
  };

  // Verificación de sesión activa
  useEffect(() => {
    let cancelado = false;

    const verificarSesionActiva = async () => {
      try {
        const perfilData = await authService.checkSession();
        if (cancelado) return;
        const cuenta = perfilData?.user || perfilData?.admin;
        if (cuenta) {
          const tokenActual = token || 'cookie-session';
          const adminObj = esRolAdmin(cuenta.rol) || perfilData?.admin ? perfilData.admin || cuenta : null;
          guardarSesionLocal(cuenta, tokenActual, adminObj);
        }
      } catch {
        if (!cancelado && sessionStorage.getItem('token') === 'cookie-session') {
          limpiarSesionLocal();
        }
      }
    };

    verificarSesionActiva();

    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Acciones de autenticación
  const login = async (credenciales) => {
    const data = await authService.login(credenciales);

    if (data.issues && data.issues.length > 0) {
      const err = new Error(data.issues[0]?.message || 'Credenciales incorrectas.');
      err.response = { data };
      throw err;
    }

    let usuarioActual = data.user || data.admin || data.credentials;
    const authToken = data.accessToken || data.token || data.jwtToken || 'cookie-session';

    if (!usuarioActual) {
      try {
        const perfilData = await authService.checkSession();
        usuarioActual = perfilData.user || perfilData.admin;
      } catch {
        const correoRef = credenciales.correo || credenciales.email;
        usuarioActual = { correo: correoRef, rol: 'CLIENTE' };
      }
    }

    const adminData = esRolAdmin(usuarioActual?.rol) || data.admin ? data.admin || usuarioActual : null;
    guardarSesionLocal(usuarioActual, authToken, adminData, data.refreshToken);

    data.user = usuarioActual;
    data.admin = adminData;
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
    const authToken = data.accessToken || data.token || data.jwtToken || 'cookie-session';
    guardarSesionLocal(usuarioActual, authToken, null, data.refreshToken);

    return data;
  };

  const logout = async () => {
    await authService.logout().catch(() => {});
    limpiarSesionLocal();
  };

  const isAdmin = esRolAdmin(user?.rol) || !!admin;

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
