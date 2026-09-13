import React from 'react';
import './EtiquetaEstado.css';

const EtiquetaEstado = ({ estado }) => {
  return (
    <span className="etiqueta-estado etiqueta-stock">
      {estado}
    </span>
  );
};

export default EtiquetaEstado;
