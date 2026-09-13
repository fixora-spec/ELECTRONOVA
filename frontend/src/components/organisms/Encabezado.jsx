import React from 'react';
import { Search, Moon, Sun, User } from 'lucide-react';
import Boton from '../atoms/Boton';
import './Encabezado.css';

const Encabezado = ({ theme, setTheme }) => {
  return (
    <header className="encabezado">
      <div className="encabezado-logo">
        <div className="logo-icono">
          <span className="logo-foco">💡</span>
        </div>
        <div className="logo-texto">
          <span className="logo-electronova">ELECTRONOVA</span>
          <span className="logo-slogan">Catálogo de Productos Eléctricos</span>
        </div>
      </div>
      
      <nav className="encabezado-nav">
        <ul>
          <li className="activo"><a href="/">Inicio</a></li>
          <li><a href="/productos">Productos</a></li>
          <li><a href="/categorias">Categorías</a></li>
          <li><a href="/nosotros">Nosotros</a></li>
          <li><a href="/contacto">Contacto</a></li>
        </ul>
      </nav>

      <div className="encabezado-acciones">
        <div className="barra-busqueda">
          <Search size={18} className="icono-busqueda" />
          <input type="text" placeholder="Buscar productos..." />
        </div>
        
        <button 
          className="tema-toggle" 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center' }}
          title="Cambiar tema"
        >
          {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
        </button>
        
        <Boton variant="primario" icon={User}>
          Iniciar sesión
        </Boton>
      </div>
    </header>
  );
};

export default Encabezado;
