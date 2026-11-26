// Página de inicio
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SeccionHero from '../organisms/SeccionHero';
import TarjetaProducto from '../molecules/TarjetaProducto';
import ModalProductoDetalle from '../organisms/ModalProductoDetalle';
import { productosService } from '../../services/productos.service';
import { getProductoImagen } from '../../services/api';
import './PaginaInicio.css';

function PaginaInicio() {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Carga de productos destacados
  useEffect(() => {
    const cargarDestacados = async () => {
      try {
        const data = await productosService.getAll();
        const activos = Array.isArray(data) ? data.filter((p) => p.estado !== false) : [];
        const destacados = activos.filter((p) => p.productoDestacado).slice(0, 5);
        setProductosDestacados(destacados.length > 0 ? destacados : activos.slice(0, 5));
      } catch (error) {
        console.error('Error cargando productos destacados:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarDestacados();
  }, []);

  const abrirDetalleProducto = async (prod) => {
    try {
      const prodCompleto = await productosService.getById(prod._id || prod.idProducto);
      setProductoSeleccionado(prodCompleto);
    } catch (err) {
      console.error('Error al obtener detalle del producto:', err);
      setProductoSeleccionado(prod);
    }
  };

  return (
    <div className="pagina-inicio">
      <main>
        {/* Portada Hero */}
        <SeccionHero />

        {/* Productos destacados */}
        <section className="seccion-destacados">
          <div className="seccion-cabecera">
            <h2>Productos destacados</h2>
            <Link to="/productos" className="enlace-ver-todos">Ver todos los productos </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando productos...</div>
          ) : (
            <div className="cuadricula-productos">
              {productosDestacados.length > 0 ? (
                productosDestacados.map((prod) => (
                  <TarjetaProducto
                    key={prod._id || prod.idProducto}
                    id={prod._id || prod.idProducto}
                    titulo={prod.nombre}
                    precio={prod.precio}
                    imagen={getProductoImagen(prod, 'https://via.placeholder.com/300')}
                    estado={prod.estado}
                    onClick={() => abrirDetalleProducto(prod)}
                  />
                ))
              ) : (
                <div className="sin-resultados">No hay productos destacados por el momento.</div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Modal de detalle */}
      <ModalProductoDetalle
        producto={productoSeleccionado}
        onClose={() => setProductoSeleccionado(null)}
      />
    </div>
  );
}

export { PaginaInicio };
