// Sección de información del producto
const SeccionDetalleProducto = ({
  titulo,
  contenido,
  preformateado = false,
  conScroll = false
}) => {
  if (!contenido || contenido.trim() === '') {
    return null;
  }

  return (
    <section className="detalle-seccion">
      <h3>{titulo}</h3>
      <div className={conScroll ? 'descripcion-con-scroll' : ''}>
        {preformateado ? (
          <div className="texto-preformateado">{contenido}</div>
        ) : (
          <p>{contenido}</p>
        )}
      </div>
    </section>
  );
};

export default SeccionDetalleProducto;
