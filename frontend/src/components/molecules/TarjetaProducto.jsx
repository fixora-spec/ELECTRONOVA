import React from 'react';
import EtiquetaEstado from '../atoms/EtiquetaEstado';
import './TarjetaProducto.css';

const TarjetaProducto = ({ imagen, titulo, precio, estado }) => {
  return (
    <div className="tarjeta-producto">
      <div className="producto-imagen">
        <img src={imagen} alt={titulo} />
      </div>
      <div className="producto-info">
        <h3 className="producto-titulo">{titulo}</h3>
        <p className="producto-precio">S/ {precio.toFixed(2)}</p>
        <EtiquetaEstado estado={estado} />
      </div>
    </div>
  );
};
export default TarjetaProducto;