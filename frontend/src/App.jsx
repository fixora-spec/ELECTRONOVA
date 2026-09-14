import { useState } from "react";
import "./App.css";
import Encabezado from "./components/organisms/Encabezado";
import PieDePagina from "./components/organisms/PieDePagina";
import { Route, Routes } from "react-router-dom";
import { PaginaInicio } from "./components/pages/PaginaInicio";
import { Productos } from "./components/pages/Productos";

import { Nosotros } from "./components/pages/Nosotros";
import { Contacto } from "./components/pages/Contacto";
import { Login } from "./components/pages/Login";
import { ForgotPassword } from "./components/pages/ForgotPassword";
import { ResetPassword } from "./components/pages/ResetPassword";

import { DashboardAdmin } from "./components/pages/DashboardAdmin";
import { AdminCategorias } from "./components/pages/AdminCategorias";
import { AdminProductos } from "./components/pages/AdminProductos";
import AdminLayout from "./components/templates/AdminLayout";
import RutaPrivada from "./components/templates/RutaPrivada";
import { AuthProvider } from "./context/AuthContext";

import ErrorBoundary from "./components/utilities/ErrorBoundary";

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <>
              <Encabezado theme={theme} setTheme={setTheme} />
              <PaginaInicio />
              <PieDePagina />
            </>
          } />
          <Route path="/productos" element={
            <>
              <Encabezado theme={theme} setTheme={setTheme} />
              <Productos />
              <PieDePagina />
            </>
          } />
          <Route path="/nosotros" element={
            <>
              <Encabezado theme={theme} setTheme={setTheme} />
              <Nosotros />
              <PieDePagina />
            </>
          } />
          <Route path="/contacto" element={
            <>
              <Encabezado theme={theme} setTheme={setTheme} />
              <Contacto />
              <PieDePagina />
            </>
          } />
          
          <Route path="/login" element={
            <>
              <Encabezado theme={theme} setTheme={setTheme} />
              <Login />
              <PieDePagina />
            </>
          } />
          <Route path="/forgot-password" element={
            <>
              <Encabezado theme={theme} setTheme={setTheme} />
              <ForgotPassword />
              <PieDePagina />
            </>
          } />
          <Route path="/reset-password" element={
            <>
              <Encabezado theme={theme} setTheme={setTheme} />
              <ResetPassword />
              <PieDePagina />
            </>
          } />

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
