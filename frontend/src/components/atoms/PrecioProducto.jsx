
const PrecioProducto = ({ precio, className = "detalle-precio" }) => {
  return (
    <span className={className}>
      S/ {precio?.toFixed(2) || '0.00'}
    </span>
  );
};

export default PrecioProducto;
