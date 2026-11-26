import { useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Encabezado from "./components/organisms/Encabezado";
import PieDePagina from "./components/organisms/PieDePagina";
import { PaginaInicio } from "./components/pages/PaginaInicio";
import { Productos } from "./components/pages/Productos";
import { Nosotros } from "./components/pages/Nosotros";
import { Contacto } from "./components/pages/Contacto";
import { Login } from "./components/pages/Login";
import { Register } from "./components/pages/Register";
import { ForgotPassword } from "./components/pages/ForgotPassword";
import { ResetPassword } from "./components/pages/ResetPassword";
import { DashboardAdmin } from "./components/pages/DashboardAdmin";
import { AdminCategorias } from "./components/pages/AdminCategorias";
import { AdminProductos } from "./components/pages/AdminProductos";
import AdminLayout from "./components/templates/AdminLayout";
import RutaPrivada from "./components/templates/RutaPrivada";
import { AuthProvider } from "./context/AuthContext.jsx";
import ErrorBoundary from "./components/utilities/ErrorBoundary";

// Restablecer el scroll al inicio en cada cambio de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
};

// Plantilla pública
const PublicLayout = () => (
  <>
    <Encabezado />
    <Outlet />
    <PieDePagina />
  </>
);

// Enrutador principal
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Rutas públicas */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PaginaInicio />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Rutas de administración */}
          <Route element={<RutaPrivada />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<DashboardAdmin />} />
              <Route path="/admin/categorias" element={<AdminCategorias />} />
              <Route path="/admin/productos" element={<AdminProductos />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
