import api from './api';

export const productosService = {
  getAll: async () => {
    const response = await api.get('/productos');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get('/productos/buscar', { params: query });
    return response.data;
  },

  filter: async (filtros) => {
    const response = await api.get('/productos/filtrar', { params: filtros });
    return response.data;
  },

  create: async (productoData) => {
    // Si hay archivos (imágenes), debemos usar FormData
    let data = productoData;
    let config = {};
    
    if (productoData instanceof FormData) {
      config = { headers: { 'Content-Type': 'multipart/form-data' } };
    }
    
    const response = await api.post('/productos', data, config);
    return response.data;
  },

  update: async (id, productoData) => {
    let data = productoData;
    let config = {};
    
    if (productoData instanceof FormData) {
      config = { headers: { 'Content-Type': 'multipart/form-data' } };
    }
    
    const response = await api.put(`/productos/${id}`, data, config);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  }
};
