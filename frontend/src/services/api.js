import axios from 'axios';

// Resolución de URL del servidor
const resolveBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location?.hostname) {
    try {
      const parsed = envUrl ? new URL(envUrl) : null;
      const port = parsed?.port || '3000';
      const protocol = parsed?.protocol || window.location.protocol || 'http:';
      return `${protocol}//${window.location.hostname}:${port}`;
    } catch {
      return `http://${window.location.hostname}:3000`;
    }
  }
  return envUrl || 'http://localhost:3000';
};

export const API_BASE_URL = resolveBaseUrl();

// Utilidades de resolución de imágenes
export const resolveImageUrl = (url, fallback = 'https://via.placeholder.com/300') => {
  if (!url) return fallback;
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:image')) {
    return url;
  }
  return url.startsWith('/') ? `${API_BASE_URL}${url}` : `${API_BASE_URL}/${url}`;
};

export const getProductoImagen = (prod, fallback = 'https://via.placeholder.com/300') => {
  if (prod?.imagenes && prod.imagenes.length > 0) {
    return resolveImageUrl(prod.imagenes[0].ubicacion, fallback);
  }
  if (prod?.imagenPrincipal) {
    return resolveImageUrl(prod.imagenPrincipal, fallback);
  }
  return fallback;
};

// Instancia e interceptores Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token && token !== 'cookie-session' && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Control de refresco concurrente de tokens
let refrescoEnCurso = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el servidor responde 401 y la petición aún no ha sido reintentada
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/refresh')
    ) {
      originalRequest._retry = true;

      try {
        if (!refrescoEnCurso) {
          const storedRefreshToken = sessionStorage.getItem('refreshToken');
          // El navegador envía automáticamente la cookie HttpOnly con withCredentials: true,
          // y además pasamos storedRefreshToken en el body como respaldo
          refrescoEnCurso = axios
            .post(
              `${API_BASE_URL}/auth/refresh`,
              storedRefreshToken ? { refreshToken: storedRefreshToken } : {},
              { withCredentials: true }
            )
            .then((res) => {
              const nuevoToken = res.data?.accessToken || res.data?.jwtToken;
              if (nuevoToken) {
                sessionStorage.setItem('token', nuevoToken);
                if (res.data?.refreshToken) {
                  sessionStorage.setItem('refreshToken', res.data.refreshToken);
                }
                if (res.data?.user) {
                  sessionStorage.setItem('user', JSON.stringify(res.data.user));
                }
                return nuevoToken;
              }
              throw new Error('No se recibió nuevo token de acceso');
            })
            .finally(() => {
              refrescoEnCurso = null;
            });
        }

        const nuevoToken = await refrescoEnCurso;

        // Actualizamos la cabecera Authorization con el nuevo Access Token
        originalRequest.headers.Authorization = `Bearer ${nuevoToken}`;

        // Reintentamos la petición original
        return api(originalRequest);
      } catch (refreshError) {
        // Si el refresh token también expiró o fue revocado, limpiar sesión local
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('admin');

        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
