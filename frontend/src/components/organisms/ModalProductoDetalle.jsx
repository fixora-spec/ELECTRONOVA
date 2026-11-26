// Modal de detalle de producto
import { useEffect } from 'react';
import './ModalProductoDetalle.css';

import BotonCerrarModal from '../atoms/BotonCerrarModal';
import PrecioProducto from '../atoms/PrecioProducto';
import EtiquetaEstado from '../atoms/EtiquetaEstado';
import GaleriaProducto from '../molecules/GaleriaProducto';
import SeccionDetalleProducto from '../molecules/SeccionDetalleProducto';

export default function ModalProductoDetalle({ producto, onClose }) {
  useEffect(() => {
    if (producto) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [producto]);

  if (!producto) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-detalle-overlay" onClick={onClose}>
      <div className="modal-detalle-contenido" onClick={handleModalClick}>
        <BotonCerrarModal onClick={onClose} />

        <div className="modal-detalle-grid">
          {/* Galería */}
          <div className="modal-detalle-galeria">
            <GaleriaProducto producto={producto} />
          </div>

          {/* Información del producto */}
          <div className="detalle-info">
            <span className="detalle-categoria">
              {producto.idCategoria?.nombre || 'Categoría no especificada'}
            </span>

            <h2 className="detalle-titulo">{producto.nombre}</h2>

            <div className="detalle-precio-estado">
              <PrecioProducto precio={producto.precio} />
              <EtiquetaEstado estado={producto.estado} />
            </div>

            {producto.descripcionCorta && (
              <p className="detalle-descripcion-corta">{producto.descripcionCorta}</p>
            )}

            <hr className="detalle-separador" />

            <div className="detalle-secciones">
              {producto.descripcionCompleta && (
                <SeccionDetalleProducto
                  titulo="Descripción Completa"
                  contenido={producto.descripcionCompleta}
                />
              )}

              {producto.caracteristicas && (
                <SeccionDetalleProducto
                  titulo="Características"
                  contenido={producto.caracteristicas}
                />
              )}

              {producto.especificacionesTec && (
                <SeccionDetalleProducto
                  titulo="Especificaciones Técnicas"
                  contenido={producto.especificacionesTec}
                  preformateado={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
