import api from './api';

// Configuración de cabeceras para formularios
const getMultipartConfig = (payload) =>
  payload instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};

// Servicio de productos
export const productosService = {
  getPaginated: async ({ page = 1, limit = 12, categoria = '', q = '', soloActivos = false } = {}) => {
    const params = { page, limit };
    if (q && q.trim()) params.q = q.trim();
    if (categoria) params.categoria = categoria;
    if (soloActivos) params.soloActivos = true;

    const endpoint = params.q ? '/productos/buscar' : (params.categoria ? '/productos/filtrar' : '/productos');
    const response = await api.get(endpoint, { params });
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get('/productos', { params: { limit: 100, ...params } });
    return response.data?.data ? response.data.data : response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response.data?.data ? response.data.data : response.data;
  },

  create: async (productoData) => {
    const response = await api.post('/productos', productoData, getMultipartConfig(productoData));
    return response.data?.data ? response.data.data : response.data;
  },

  update: async (id, productoData) => {
    const response = await api.put(`/productos/${id}`, productoData, getMultipartConfig(productoData));
    return response.data?.data ? response.data.data : response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  },
};
