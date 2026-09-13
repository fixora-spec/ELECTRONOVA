import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import './PieDePagina.css';

const PieDePagina = () => {
  return (
    <footer className="pie-pagina">
      <div className="pie-pagina-contenedor">

        {/* Columna Logo */}
        <div className="pie-columna">
          <div className="pie-logo">
            <div className="logo-icono logo-icono-blanco">
              <span className="logo-foco">💡</span>
            </div>
            <div className="logo-texto">
              <span className="logo-electronova-blanco">ELECTRONOVA</span>
              <span className="logo-slogan-blanco">Soluciones eléctricas para un mejor futuro</span>
            </div>
          </div>
          <p className="pie-descripcion">
            Tu tienda de confianza en productos eléctricos. Calidad, variedad y el mejor servicio para tus proyectos.
          </p>
          <div className="pie-redes">
            {/* Aquí irían los iconos de redes sociales */}
            <span className="red-icono">f</span>
            <span className="red-icono">ig</span>
            <span className="red-icono">wa</span>
            <span className="red-icono">yt</span>
          </div>
        </div>

        {/* Columna Enlaces */}
        <div className="pie-columna">
          <h4 className="pie-titulo">Enlaces rápidos</h4>
          <ul className="pie-enlaces">
            <li><a href="/"> Inicio</a></li>
            <li><a href="/productos"> Productos</a></li>
            <li><a href="/categorias"> Categorías</a></li>
            <li><a href="/nosotros">Nosotros</a></li>
            <li><a href="/contacto"> Contacto</a></li>
          </ul>
        </div>

        {/* Columna Contacto */}
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

        {/* Columna Mapa */}
        <div className="pie-columna pie-columna-mapa">
          <div className="pie-mapa-placeholder">
            <MapPin size={32} className="pie-mapa-icono" />
            <p>Visítanos en nuestra tienda</p>
            <a href="#" className="pie-mapa-enlace">Cómo llegar →</a>
          </div>
        </div>

      </div>

      <div className="pie-pagina-inferior">
        <p>© 2026 ELECTRONOVA. Todos los derechos reservados.</p>
        <p>Desarrollado con tecnología para un mejor futuro.</p>
      </div>
    </footer>
  );
};

export default PieDePagina;
