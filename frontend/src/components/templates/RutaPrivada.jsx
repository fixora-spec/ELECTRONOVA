
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function RutaPrivada() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir al login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizar los componentes hijos (rutas anidadas)
  return <Outlet />;
}
