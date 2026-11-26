// Formato de precio de producto
const PrecioProducto = ({ precio, className = 'detalle-precio' }) => {
  const precioNumerico = Number(precio);
  const precioFinal = Number.isFinite(precioNumerico) ? precioNumerico.toFixed(2) : '0.00';

  return <span className={className}>S/ {precioFinal}</span>;
};

export default PrecioProducto;
