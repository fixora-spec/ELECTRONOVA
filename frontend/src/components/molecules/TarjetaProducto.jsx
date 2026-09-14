

import './TarjetaProducto.css';

const TarjetaProducto = ({ imagen, titulo, precio, onClick }) => {
  return (
    <div className="tarjeta-producto" onClick={onClick}>
      <div className="producto-imagen">
        <img src={imagen} alt={titulo} />
      </div>
      <div className="producto-info">
        <h3 className="producto-titulo">{titulo}</h3>
        <p className="producto-precio">{precio.toFixed(2)}</p>
      </div>
    </div>
  );
};
export default TarjetaProducto;