
import './ModalProductoDetalle.css';


import BotonCerrarModal from '../atoms/BotonCerrarModal';
import PrecioProducto from '../atoms/PrecioProducto';
import GaleriaProducto from '../molecules/GaleriaProducto';
import SeccionDetalleProducto from '../molecules/SeccionDetalleProducto';

export default function ModalProductoDetalle({ producto, onClose }) {
  if (!producto) return null;

  // Prevenir que clics dentro del modal lo cierren
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-detalle-overlay" onClick={onClose}>
      <div className="modal-detalle-contenido" onClick={handleModalClick}>
        <BotonCerrarModal onClick={onClose} />

        <div className="modal-detalle-grid">
          <GaleriaProducto producto={producto} />

          <div className="detalle-info">
            <span className="detalle-categoria">{producto.idCategoria?.nombre || 'Categoría no especificada'}</span>
            <h2 className="detalle-titulo">{producto.nombre}</h2>

            <div className="detalle-precio-estado" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <PrecioProducto precio={producto.precio} />
            </div>

            <p className="detalle-descripcion-corta">{producto.descripcionCorta}</p>

            <hr className="detalle-separador" />

            <div className="detalle-secciones">
              <SeccionDetalleProducto
                titulo="Descripción Completa"
                contenido={producto.descripcionCompleta}
              />

              <SeccionDetalleProducto
                titulo="Características"
                contenido={producto.caracteristicas}
              />

              <SeccionDetalleProducto
                titulo="Especificaciones Técnicas"
                contenido={producto.especificacionesTec}
                preformateado={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
