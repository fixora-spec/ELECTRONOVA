import { useState } from 'react';
import { 
  User, 
  Menu, 
  X,
  Home,
  Package,
  Building2,
  Mail,
  LogOut,
  Shield
} from 'lucide-react';

import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Encabezado.css';

const Encabezado = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="encabezado">
      <div className="encabezado-contenedor">
        <Link 
          to="/" 
          className="encabezado-logo"
          onClick={closeMenu}
        >
          <div className="logo-icono">
            <img 
              src="/src/assets/logo.png" 
              alt="Electronova"
            />
          </div>
          <div className="logo-texto">
            <span className="logo-electronova">
              ELECTRONOVA
            </span>
          </div>
        </Link>

        <div className="encabezado-acciones">
          <nav 
            className={`navegacion-principal ${
              isMenuOpen ? 'abierto' : ''
            }`}
          >
            <div className="menu-header-mobile">
              <div className="menu-logo">
                <img 
                  src="/src/assets/logo.png"
                  alt="Electronova"
                />
                <span>ELECTRONOVA</span>
              </div>

              <button 
                className="menu-close"
                onClick={closeMenu}
              >
                <X size={26}/>
              </button>
            </div>

            <NavLink 
              to="/"
              end
              onClick={closeMenu}
            >
              <Home size={20}/>
              <span>Inicio</span>
            </NavLink>

            <NavLink 
              to="/productos"
              onClick={closeMenu}
            >
              <Package size={20}/>
              <span>Productos</span>
            </NavLink>

            <NavLink 
              to="/nosotros"
              onClick={closeMenu}
            >
              <Building2 size={20}/>
              <span>Empresa</span>
            </NavLink>

            <NavLink 
              to="/contacto"
              onClick={closeMenu}
            >
              <Mail size={20}/>
              <span>Contacto</span>
            </NavLink>

            {/* Menú usuario en móvil */}
            <div className="menu-admin-mobile">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="btn-login-header"
                  onClick={closeMenu}
                >
                  <User size={20}/>
                  Iniciar sesión
                </Link>
              ) : isAdmin ? (
                <div className="usuario-mobile-card">
                  <div className="usuario-mobile-info">
                    <div className="usuario-avatar-circulo avatar-admin">
                      <Shield size={16}/>
                    </div>
                    <div>
                      <div className="usuario-nombre-mobile">{user?.nombre || 'Administrador'}</div>
                      <span className="usuario-badge-mobile">Administrador</span>
                    </div>
                  </div>
                  <div className="usuario-mobile-botones">
                    <Link
                      to="/admin/dashboard"
                      className="btn-panel-mobile"
                      onClick={closeMenu}
                    >
                      Panel Admin
                    </Link>
                    <button
                      onClick={() => { logout(); closeMenu(); }}
                      className="btn-salir-mobile"
                    >
                      <LogOut size={16} /> Salir
                    </button>
                  </div>
                </div>
              ) : (
                <div className="usuario-mobile-card">
                  <div className="usuario-mobile-info">
                    <div className="usuario-avatar-circulo">
                      {(user?.nombre || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="usuario-nombre-mobile">{user?.nombre || 'Usuario'}</div>
                      <span className="usuario-email-mobile">{user?.correo || user?.email || 'Cliente'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); closeMenu(); }}
                    className="btn-salir-mobile"
                  >
                    <LogOut size={16} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </nav>

          {isMenuOpen && (
            <div 
              className="menu-overlay"
              onClick={closeMenu}
            ></div>
          )}

          <div className="acciones-iconos">
            {/* Menú usuario en escritorio */}
            <div className="admin-desktop">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="btn-login-header"
                >
                  <User size={18}/>
                  <span className="mostrar-desktop">Iniciar sesión</span>
                </Link>
              ) : isAdmin ? (
                <div className="usuario-sesion-header">
                  <Link to="/admin/dashboard" className="usuario-info-pill usuario-info-link" title="Ir al Panel de Administrador">
                    <div className="usuario-avatar-circulo avatar-admin">
                      <Shield size={14}/>
                    </div>
                    <div className="usuario-textos">
                      <span className="usuario-saludo">Admin:</span>
                      <span className="usuario-nombre">{user?.nombre?.split(' ')[0] || 'Panel'}</span>
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    title="Cerrar sesión"
                    className="btn-salir-header"
                  >
                    <LogOut size={14} className="icono-salir" />
                    <span>Salir</span>
                  </button>
                </div>
              ) : (
                <div className="usuario-sesion-header">
                  <div className="usuario-info-pill">
                    <div className="usuario-avatar-circulo">
                      {(user?.nombre || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="usuario-textos">
                      <span className="usuario-saludo">Hola,</span>
                      <span className="usuario-nombre">{user?.nombre?.split(' ')[0] || 'Usuario'}</span>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    title="Cerrar sesión"
                    className="btn-salir-header"
                  >
                    <LogOut size={14} className="icono-salir" />
                    <span>Salir</span>
                  </button>
                </div>
              )}
            </div>

            <button
              className="btn-icono mostrar-mobile"
              onClick={toggleMenu}
              aria-label="Menú"
            >
              {isMenuOpen ? <X size={26}/> : <Menu size={26}/>}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Encabezado;