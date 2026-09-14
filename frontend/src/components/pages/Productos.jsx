import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import TarjetaProducto from '../molecules/TarjetaProducto';
import ModalProductoDetalle from '../organisms/ModalProductoDetalle';
import { productosService } from '../../services/productos.service';
import { categoriasService } from '../../services/categorias.service';
import './Productos.css';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [filtrosMobileAbiertos, setFiltrosMobileAbiertos] = useState(false);
  const location = useLocation();

  const [busqueda, setBusqueda] = useState(() => {
    const q = new URLSearchParams(location.search).get('q');
    return q || '';
  });

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [prodsData, catsData] = await Promise.all([
        productosService.getAll(),
        categoriasService.getAll()
      ]);
      setProductos(prodsData);
      setCategorias(catsData);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError("No se pudieron cargar los productos. Asegúrate de que el backend esté encendido y conectado.");
    } finally {
      setLoading(false);
    }
  };

  // Sincronizar busqueda desde URL al inicializar o cambiar URL
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q');
    if (q && q !== busqueda) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBusqueda(q);
    } else if (!q) {
      cargarDatos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Efecto para la búsqueda en vivo (debounce)
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        if (busqueda.trim() === '') {
          // Si está vacío, volvemos a cargar todo (filtrado o no)
          if (categoriaSeleccionada) {
            const resultados = await productosService.filter({ categoria: categoriaSeleccionada });
            setProductos(resultados);
          } else {
            cargarDatos();
          }
          return;
        }
        const resultados = await productosService.search({ q: busqueda });
        setProductos(resultados);
      } catch (error) {
        console.error("Error en la búsqueda:", error);
        setError("Error en la búsqueda en vivo.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  const handleBuscar = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (busqueda.trim() === '') {
        cargarDatos();
        return;
      }
      const resultados = await productosService.search({ q: busqueda });
      setProductos(resultados);
    } catch (error) {
      console.error("Error al buscar:", error);
      setError("Error en la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrarCategoria = async (catId) => {
    setCategoriaSeleccionada(catId);
    try {
      setLoading(true);
      if (catId === '') {
        cargarDatos();
        return;
      }
      const resultados = await productosService.filter({ categoria: catId });
      setProductos(resultados);
    } catch (error) {
      console.error("Error al filtrar:", error);
      setError("Error filtrando por categoría.");
    } finally {
      setLoading(false);
    }
  };

  const getImagenUrl = (prod) => {
    if (prod.imagenes && prod.imagenes.length > 0) {
      const url = prod.imagenes[0].ubicacion;
      return url.startsWith('http') || url.startsWith('data:image') ? url : `${import.meta.env.VITE_API_URL}${url}`;
    }
    return prod.imagenPrincipal || "https://via.placeholder.com/300";
  };

  return (
    <div className="pagina-productos">
      <div className="productos-header">
        <h1>Catálogo de Productos</h1>
        <p>Encuentra todo lo que necesitas para tus proyectos eléctricos</p>
      </div>

      <div className="productos-contenedor">
        <aside className={`filtros-sidebar ${filtrosMobileAbiertos ? 'abierto' : ''}`}>
          <div className="filtro-caja">
            <h3><Filter size={18} /> Filtrar por</h3>

            <div className="filtro-grupo">
              <h4>Categorías</h4>
              <ul className="lista-categorias">
                <li
                  className={categoriaSeleccionada === '' ? 'activo' : ''}
                  onClick={() => handleFiltrarCategoria('')}
                >
                  Todas
                </li>
                {categorias.map(cat => (
                  <li
                    key={cat._id || cat.idCategoria}
                    className={categoriaSeleccionada === (cat._id || cat.idCategoria) ? 'activo' : ''}
                    onClick={() => handleFiltrarCategoria(cat._id || cat.idCategoria)}
                  >
                    {cat.nombre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <div className="productos-principal">

          <div className="productos-controles">
            <form onSubmit={handleBuscar} className="busqueda-form">
              <Search size={18} className="icono-busqueda" />
              <input
                type="text"
                placeholder="Buscar por nombre, descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button type="submit">Buscar</button>
            </form>
            <div className="controles-derecha">
              <button type="button" className="btn-mobile-filtros" onClick={() => setFiltrosMobileAbiertos(!filtrosMobileAbiertos)}>
                <SlidersHorizontal size={20} /> Filtros
              </button>
            </div>
          </div>

          {error && <div className="mensaje-error">{error}</div>}

          {loading ? (
            <div className="cargando">Cargando productos...</div>
          ) : (
            <div className="cuadricula-catalogo">
              {productos.length > 0 ? (
                productos.map(prod => (
                  <TarjetaProducto
                    key={prod._id || prod.idProducto}
                    id={prod._id || prod.idProducto}
                    titulo={prod.nombre}
                    precio={prod.precio}
                    imagen={getImagenUrl(prod)}
                    estado={prod.estado}
                    onClick={async () => {
                      try {
                        // Muestra un estado de carga si es necesario, pero esto es suficientemente rápido
                        const prodCompleto = await productosService.getById(prod._id || prod.idProducto);
                        setProductoSeleccionado(prodCompleto);
                      } catch (err) {
                        console.error('Error fetching full product', err);
                        setProductoSeleccionado(prod); // usa el básico en caso de error
                      }
                    }}
                  />
                ))
              ) : (
                <div className="sin-resultados">
                  <h3>No se encontraron productos</h3>
                  <p>Intenta con otros términos de búsqueda o filtros.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ModalProductoDetalle
        producto={productoSeleccionado}
        onClose={() => setProductoSeleccionado(null)}
      />
    </div>
  );
}

export { Productos };


