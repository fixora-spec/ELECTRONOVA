
const SeccionDetalleProducto = ({ titulo, contenido, preformateado = false, conScroll = false }) => {
  if (!contenido) return null;

  return (
    <div className="detalle-seccion">
      <h3>{titulo}</h3>
      <div className={conScroll ? "descripcion-con-scroll" : ""}>
        {preformateado ? (
          <p className="texto-preformateado">{contenido}</p>
        ) : (
          <p>{contenido}</p>
        )}
      </div>
    </div>
  );
};

export default SeccionDetalleProducto;
