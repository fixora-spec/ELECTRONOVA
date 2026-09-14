import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  forgotPassword: async (correo) => {
    const response = await api.post('/auth/forgot-password', { correo });
    return response.data;
  },

  resetPassword: async (id, token, nuevaContrasena) => {
    const response = await api.post('/auth/reset-password', { id, token, nuevaContrasena });
    return response.data;
  },

  // En caso de necesitar verificar la sesión
  checkSession: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
