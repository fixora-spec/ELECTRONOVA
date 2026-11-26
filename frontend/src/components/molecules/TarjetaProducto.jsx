// Tarjeta de producto en catálogo
import PrecioProducto from '../atoms/PrecioProducto';
import './TarjetaProducto.css';

const TarjetaProducto = ({ imagen, titulo, precio, onClick }) => {
  return (
    <article className="tarjeta-producto">
      <div className="producto-imagen">
        <img
          src={imagen}
          alt={titulo}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300';
          }}
        />
      </div>

      <div className="producto-info">
        <h3 className="producto-titulo">{titulo}</h3>

        <div className="producto-footer">
          <PrecioProducto precio={precio} className="producto-precio" />

          <button
            className="producto-ver"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }}
          >
            Ver detalle
          </button>
        </div>
      </div>
    </article>
  );
};

export default TarjetaProducto;
