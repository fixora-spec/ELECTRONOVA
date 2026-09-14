import { useState, useEffect } from 'react';
import SeccionHero from '../organisms/SeccionHero';
import TarjetaProducto from '../molecules/TarjetaProducto';
import ModalProductoDetalle from '../organisms/ModalProductoDetalle';
import { productosService } from '../../services/productos.service';
import './PaginaInicio.css';

function PaginaInicio() {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const cargarDestacados = async () => {
      try {
        const data = await productosService.getAll();
        // Filtrar solo los destacados si existe la propiedad, o mostrar los primeros 5
        const destacados = data.filter(p => p.productoDestacado).slice(0, 5);
        setProductosDestacados(destacados.length > 0 ? destacados : data.slice(0, 5));
      } catch (error) {
        console.error("Error cargando productos destacados:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDestacados();
  }, []);

  const getImagenUrl = (prod) => {
    if (prod.imagenes && prod.imagenes.length > 0) {
      const url = prod.imagenes[0].ubicacion;
      return url.startsWith('http') || url.startsWith('data:image') ? url : `${import.meta.env.VITE_API_URL}${url}`;
    }
    return prod.imagenPrincipal || "https://via.placeholder.com/300";
  };

  return (
    <div className="pagina-inicio">
      <main>
        <SeccionHero />

        <section className="seccion-destacados">
          <div className="seccion-cabecera">
            <h2>Productos destacados</h2>
            <a href="/productos" className="enlace-ver-todos">Ver todos los productos </a>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando productos...</div>
          ) : (
            <div className="cuadricula-productos">
              {productosDestacados.length > 0 ? (
                productosDestacados.map(prod => (
                  <TarjetaProducto
                    key={prod._id || prod.idProducto}
                    id={prod._id || prod.idProducto}
                    titulo={prod.nombre}
                    precio={prod.precio}
                    imagen={getImagenUrl(prod)}
                    estado={prod.estado}
                    onClick={async () => {
                      try {
                        const prodCompleto = await productosService.getById(prod._id || prod.idProducto);
                        setProductoSeleccionado(prodCompleto);
                      } catch (err) {
                        console.error('Error fetching full product', err);
                        setProductoSeleccionado(prod);
                      }
                    }}
                  />
                ))
              ) : (
                <div className="sin-resultados">No hay productos destacados por el momento.</div>
              )}
            </div>
          )}
        </section>
      </main>

      <ModalProductoDetalle
        producto={productoSeleccionado}
        onClose={() => setProductoSeleccionado(null)}
      />
    </div>
  );
}
export { PaginaInicio };


