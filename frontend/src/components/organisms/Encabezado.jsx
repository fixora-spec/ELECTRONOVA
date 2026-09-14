import { useState } from 'react';
import { Search, User, Moon, Sun, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Encabezado.css';

const Encabezado = ({ theme, setTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
      setSearchQuery('');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="encabezado">
      <div className="encabezado-contenedor">
        
        <Link to="/" className="encabezado-logo">
          <div className="logo-icono">
            <span className="logo-foco">💡</span>
          </div>
          <div className="logo-texto">
            <span className="logo-electronova">ELECTRONOVA</span>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="encabezado-buscador mostrar-desktop">
          <input 
            type="text" 
            placeholder="Buscar productos eléctricos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn-buscar">
            <Search size={18} />
          </button>
        </form>

        <div className="encabezado-acciones">
          <nav className={`navegacion-principal ${isMenuOpen ? 'abierto' : ''}`}>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
            <Link to="/productos" onClick={() => setIsMenuOpen(false)}>Productos</Link>
            <Link to="/nosotros" onClick={() => setIsMenuOpen(false)}>Empresa</Link>
            <Link to="/contacto" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
          </nav>

          <div className="acciones-iconos">
            <button className="btn-icono btn-tema" onClick={toggleTheme} aria-label="Cambiar tema">
              {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
            </button>
            
            {isAuthenticated ? (
              <Link to="/admin/dashboard" className="btn-login-header">
                <User size={22} />
                <span className="mostrar-desktop">Panel Admin</span>
              </Link>
            ) : (
              <Link to="/login" className="btn-login-header">
                <User size={22} />
                <span className="mostrar-desktop">Acceso Admin</span>
              </Link>
            )}

            <button className="btn-icono mostrar-mobile" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSearch} className="encabezado-buscador-mobile mostrar-mobile">
        <input 
          type="text" 
          placeholder="Buscar productos eléctricos..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="btn-buscar">
          <Search size={18} />
        </button>
      </form>
    </header>
  );
};

export default Encabezado;
