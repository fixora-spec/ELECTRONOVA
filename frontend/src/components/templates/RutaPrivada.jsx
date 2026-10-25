import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function RutaPrivada() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir al login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado pero NO es administrador, denegar acceso al panel admin
  if (!isAdmin) {
    return <Navigate to="/productos" replace />;
  }

  // Si es administrador, permitir acceso al panel administrativo
  return <Outlet />;
}
