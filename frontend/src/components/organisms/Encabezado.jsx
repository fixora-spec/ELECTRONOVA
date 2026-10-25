import { useState } from 'react';
import { 
  User, 
  Menu, 
  X,
  Home,
  Package,
  Building2,
  Mail,
  LogOut
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
                  <User size={22}/>
                  Iniciar sesión
                </Link>
              ) : isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  className="btn-login-header"
                  onClick={closeMenu}
                >
                  <User size={22}/>
                  Panel Admin
                </Link>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 0' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--primary-blue, #0d284a)' }}>
                    Hola, {user?.nombre?.split(' ')[0] || 'Usuario'}
                  </span>
                  <button
                    onClick={() => { logout(); closeMenu(); }}
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '6px',
                      background: '#f3f4f6', 
                      border: '1px solid #ddd', 
                      borderRadius: '6px', 
                      padding: '8px 12px', 
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
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
                  <User size={22}/>
                  <span className="mostrar-desktop">Iniciar sesión</span>
                </Link>
              ) : isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  className="btn-login-header"
                >
                  <User size={22}/>
                  <span className="mostrar-desktop">Panel Admin</span>
                </Link>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="mostrar-desktop" style={{ fontSize: '0.9rem', color: '#1f2937', fontWeight: '600' }}>
                    Hola, {user?.nombre?.split(' ')[0] || 'Usuario'}
                  </span>
                  <button
                    onClick={logout}
                    title="Cerrar sesión"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      background: 'transparent', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px', 
                      padding: '6px 10px', 
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: '#4b5563'
                    }}
                  >
                    <LogOut size={15} />
                    <span className="mostrar-desktop">Salir</span>
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