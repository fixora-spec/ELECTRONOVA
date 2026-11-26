// Pie de página
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PieDePagina.css';

const PieDePagina = () => {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="pie-pagina">
      <div className="pie-pagina-contenedor">
        {/* Marca y redes */}
        <div className="pie-columna">
          <Link to="/" onClick={handleScrollTop} className="pie-logo-link" title="Ir al inicio">
            <div className="pie-logo">
              <div className="logo-icono logo-icono-blanco">
                <span className="logo-foco">💡</span>
              </div>
              <div className="logo-texto">
                <span className="logo-electronova-blanco">ELECTRONOVA</span>
                <span className="logo-slogan-blanco">Soluciones eléctricas para un mejor futuro</span>
              </div>
            </div>
          </Link>
          <p className="pie-descripcion">
            Tu tienda de confianza en productos eléctricos. Calidad, variedad y el mejor servicio para tus proyectos.
          </p>
          <div className="pie-redes">
            <span className="red-icono">f</span>
            <span className="red-icono">ig</span>
            <span className="red-icono">wa</span>
            <span className="red-icono">yt</span>
          </div>
        </div>

        {/* Enlaces rápidos */}
        <div className="pie-columna">
          <h4 className="pie-titulo">Enlaces rápidos</h4>
          <ul className="pie-enlaces">
            <li><Link to="/" onClick={handleScrollTop}> Inicio</Link></li>
            <li><Link to="/productos" onClick={handleScrollTop}> Productos</Link></li>
            <li><Link to="/nosotros" onClick={handleScrollTop}> Empresa</Link></li>
            <li><Link to="/contacto" onClick={handleScrollTop}> Contacto</Link></li>
          </ul>
        </div>

        {/* Contacto */}
        <div className="pie-columna">
          <h4 className="pie-titulo">Información de contacto</h4>
          <ul className="pie-contacto">
            <li>
              <MapPin size={18} />
              <span>Av. Principal 123, Celendín - Perú</span>
            </li>
            <li>
              <Phone size={18} />
              <span>+51 987 654 321</span>
            </li>
            <li>
              <Mail size={18} />
              <span>ventas@electronova.com</span>
            </li>
            <li>
              <Clock size={18} />
              <span>Lun - Sáb: 8:00 a.m. - 6:00 p.m.</span>
            </li>
          </ul>
        </div>

        {/* Ubicación */}
        <div className="pie-columna pie-columna-mapa">
          <div className="pie-mapa-placeholder">
            <MapPin size={32} className="pie-mapa-icono" />
            <p>Visítanos en nuestra tienda</p>
            <Link to="/contacto" onClick={handleScrollTop} className="pie-mapa-enlace">Cómo llegar →</Link>
          </div>
        </div>
      </div>

      {/* Derechos de autor */}
      <div className="pie-pagina-inferior">
        <p>© 2026 ELECTRONOVA. Todos los derechos reservados.</p>
        <p>Desarrollado con tecnología para un mejor futuro.</p>
      </div>
    </footer>
  );
};

export default PieDePagina;
