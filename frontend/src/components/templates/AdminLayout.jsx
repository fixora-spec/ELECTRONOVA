import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, FolderTree, PackageSearch, LogOut, Menu, X, Store } from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-foco">💡</span>
            {sidebarOpen && <span>Admin Panel</span>}
          </div>
          <button className="btn-toggle-sidebar mobile-only" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{admin?.nombre?.charAt(0).toUpperCase() || 'A'}</div>
          {sidebarOpen && (
            <div className="user-info">
              <span className="user-name">{admin?.nombre || 'Administrador'}</span>
              <span className="user-role">Super Admin</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <NavLink 
            to="/admin/dashboard" 
            className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
            end
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Resumen</span>}
          </NavLink>

          <NavLink 
            to="/admin/categorias" 
            className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
          >
            <FolderTree size={20} />
            {sidebarOpen && <span>Categorías</span>}
          </NavLink>

          <NavLink 
            to="/admin/productos" 
            className={({isActive}) => isActive ? "nav-item active" : "nav-item"}
          >
            <PackageSearch size={20} />
            {sidebarOpen && <span>Productos</span>}
          </NavLink>
        </nav>


      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <button className="btn-toggle-sidebar" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <div className="topbar-right">
            <button className="topbar-btn btn-volver-tienda" onClick={() => navigate('/productos')}>
              <Store size={18} />
              <span>Ir a Productos</span>
            </button>
            <button className="topbar-btn btn-logout" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>

      {!sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </div>
  );
}
