// Catálogo público de productos
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  SearchX,
  ArrowRight,
} from 'lucide-react';
import TarjetaProducto from '../molecules/TarjetaProducto';
import ModalProductoDetalle from '../organisms/ModalProductoDetalle';
import Paginacion from '../molecules/Paginacion';
import { productosService } from '../../services/productos.service';
import { categoriasService } from '../../services/categorias.service';
import { getProductoImagen } from '../../services/api';
import './Productos.css';

const SUGERENCIAS_RAPIDAS = [
  'Bentonita',
  'Indeco 14 AWG',
  'Reflector LED',
  'Termomagnético',
  'Tubos EMT',
  'Multímetro',
  'Pozo a Tierra',
  'Guantes Dieléctricos',
];

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [filtrosMobileAbiertos, setFiltrosMobileAbiertos] = useState(false);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [paginacionInfo, setPaginacionInfo] = useState(null);
  const limitePorPagina = 12;

  const location = useLocation();

  const [busqueda, setBusqueda] = useState(() => {
    const q = new URLSearchParams(location.search).get('q');
    return q || '';
  });

  // Sugerencias de autocompletado en vivo
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [, setCargandoSugerencias] = useState(false);

  const buscadorRef = useRef(null);
  const inputRef = useRef(null);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickAfuera = (e) => {
      if (buscadorRef.current && !buscadorRef.current.contains(e.target)) {
        setMostrarSugerencias(false);
      }
    };
    document.addEventListener('mousedown', handleClickAfuera);
    return () => document.removeEventListener('mousedown', handleClickAfuera);
  }, []);

  // Carga inicial de categorías
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const catsData = await categoriasService.getAll();
        setCategorias(catsData);
      } catch (err) {
        console.error('Error cargando categorías:', err);
      }
    };
    cargarCategorias();
  }, []);

  // Función principal para cargar productos
  const cargarProductos = async (pagina = 1, categoria = categoriaSeleccionada, textoBusqueda = busqueda) => {
    try {
      setLoading(true);
      setError(null);

      const respuesta = await productosService.getPaginated({
        page: pagina,
        limit: limitePorPagina,
        categoria,
        q: textoBusqueda,
      });

      if (respuesta && respuesta.data) {
        setProductos(respuesta.data);
        setPaginacionInfo(respuesta.pagination || null);
        setPaginaActual(respuesta.pagination ? respuesta.pagination.page : pagina);
      } else {
        setProductos(Array.isArray(respuesta) ? respuesta : []);
        setPaginacionInfo(null);
      }
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('No se pudieron cargar los productos. Asegúrate de que el backend esté conectado.');
    } finally {
      setLoading(false);
    }
  };

  // Sincronizar parámetro 'q' de la URL si cambia externamente
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q') || '';
    const timer = setTimeout(() => {
      setBusqueda((prev) => (prev !== q ? q : prev));
      setPaginaActual(1);
    }, 0);
    return () => clearTimeout(timer);
  }, [location.search]);

  // Cargar productos con debounce al escribir o cambiar categoría/página
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarProductos(paginaActual, categoriaSeleccionada, busqueda);
    }, 280);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaActual, categoriaSeleccionada, busqueda]);

  // Búsqueda de sugerencias en vivo mientras el usuario escribe
  useEffect(() => {
    const query = busqueda.trim();
    if (query.length < 2) {
      const resetTimer = setTimeout(() => {
        setSugerencias([]);
        setMostrarSugerencias(false);
      }, 0);
      return () => clearTimeout(resetTimer);
    }

    const timer = setTimeout(async () => {
      try {
        setCargandoSugerencias(true);
        const res = await productosService.getPaginated({
          q: query,
          categoria: categoriaSeleccionada || undefined,
          limit: 5,
        });
        const items = res?.data || (Array.isArray(res) ? res : []);
        setSugerencias(items);
        setMostrarSugerencias(items.length > 0);
      } catch (err) {
        console.error('Error al cargar sugerencias de búsqueda:', err);
      } finally {
        setCargandoSugerencias(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [busqueda, categoriaSeleccionada]);

  // Manejador de cambio en el input de búsqueda
  const handleCambioBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  // Manejador del submit de búsqueda
  const handleBuscar = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setMostrarSugerencias(false);
    setPaginaActual(1);
    cargarProductos(1, categoriaSeleccionada, busqueda);
  };

  // Limpiar el buscador
  const handleLimpiarBusqueda = () => {
    setBusqueda('');
    setSugerencias([]);
    setMostrarSugerencias(false);
    setPaginaActual(1);
    cargarProductos(1, categoriaSeleccionada, '');
    if (inputRef.current) inputRef.current.focus();
  };

  // Filtro de categoría
  const handleFiltrarCategoria = (catId) => {
    setCategoriaSeleccionada(catId);
    setFiltrosMobileAbiertos(false);
    setMostrarSugerencias(false);
    setPaginaActual(1);
    cargarProductos(1, catId, busqueda);
  };

  // Paginación
  const handleCambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
    cargarProductos(nuevaPagina, categoriaSeleccionada, busqueda);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  // Abrir modal de detalle
  const abrirDetalleProducto = async (prod) => {
    try {
      const prodCompleto = await productosService.getById(prod._id || prod.idProducto);
      setProductoSeleccionado(prodCompleto);
    } catch (err) {
      console.error('Error al obtener detalle del producto:', err);
      setProductoSeleccionado(prod);
    }
  };

  // Seleccionar producto desde la lista de sugerencias
  const handleSeleccionarSugerencia = (item) => {
    setMostrarSugerencias(false);
    abrirDetalleProducto(item);
  };

  // Aplicar sugerencia rápida desde el estado vacío
  const handleAplicarTag = (tag) => {
    setBusqueda(tag);
    setMostrarSugerencias(false);
    setPaginaActual(1);
    cargarProductos(1, categoriaSeleccionada, tag);
  };

  // Restablecer todos los filtros
  const handleRestablecerTodo = () => {
    setBusqueda('');
    setCategoriaSeleccionada('');
    setSugerencias([]);
    setMostrarSugerencias(false);
    setPaginaActual(1);
    cargarProductos(1, '', '');
    if (inputRef.current) inputRef.current.focus();
  };

  // Nombre de la categoría activa
  const categoriaActual = categorias.find((c) => (c._id || c.idCategoria) === categoriaSeleccionada);
  const categoriaNombre = categoriaActual?.nombre || '';

  return (
    <div className="pagina-productos">
      {/* Cabecera */}
      <div className="productos-header">
        <h1>Catálogo de Productos</h1>
        <p>Encuentra todo lo que necesitas para tus proyectos eléctricos</p>
      </div>

      <div className="productos-layout">
        {/* Filtros laterales */}
        <aside className={`filtros-sidebar ${filtrosMobileAbiertos ? 'mostrar' : ''}`}>
          <div className="filtro-caja">
            <div className="filtro-titulo">
              <h3>
                <Filter size={18} /> Filtrar por
              </h3>
              <button
                type="button"
                className="cerrar-filtro"
                onClick={() => setFiltrosMobileAbiertos(false)}
                title="Cerrar filtros"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grupo-categorias">
              <h4>Categorías</h4>
              <ul className="lista-categorias">
                <li
                  className={categoriaSeleccionada === '' ? 'activo' : ''}
                  onClick={() => handleFiltrarCategoria('')}
                >
                  Todas las categorías
                </li>
                {Array.isArray(categorias) &&
                  categorias
                    .filter(
                      (cat, index, self) =>
                        index ===
                        self.findIndex(
                          (c) =>
                            c.nombre?.trim().toLowerCase() ===
                            cat.nombre?.trim().toLowerCase()
                        )
                    )
                    .map((cat) => (
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

        {/* Listado y buscador */}
        <div className="productos-contenido">
          <div className="barra-productos">
            <div className="busqueda-contenedor" ref={buscadorRef}>
              <form onSubmit={handleBuscar} className="busqueda-form">
                <Search size={19} className="icono-busqueda" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar por nombre, calibre, marca, código..."
                  value={busqueda}
                  onChange={handleCambioBusqueda}
                  onFocus={() => {
                    if (sugerencias.length > 0 && busqueda.trim().length >= 2) {
                      setMostrarSugerencias(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setMostrarSugerencias(false);
                  }}
                />
                {busqueda && (
                  <button
                    type="button"
                    className="btn-limpiar"
                    onClick={handleLimpiarBusqueda}
                    title="Limpiar búsqueda"
                  >
                    <RotateCcw size={14} /> Limpiar
                  </button>
                )}
                <button type="submit" className="btn-buscar">
                  Buscar
                </button>
              </form>

              {/* Menú de sugerencias en vivo */}
              {mostrarSugerencias && sugerencias.length > 0 && (
                <div className="sugerencias-dropdown">
                  <div className="sugerencias-cabecera">
                    <Sparkles size={14} /> Sugerencias de productos
                  </div>
                  <div className="sugerencias-lista">
                    {sugerencias.map((item) => (
                      <div
                        key={item._id || item.idProducto}
                        className="sugerencia-item"
                        onClick={() => handleSeleccionarSugerencia(item)}
                      >
                        <img
                          src={getProductoImagen(item, 'https://via.placeholder.com/60')}
                          alt={item.nombre}
                          className="sugerencia-img"
                        />
                        <div className="sugerencia-info">
                          <span className="sugerencia-nombre">{item.nombre}</span>
                          <div className="sugerencia-meta">
                            <span className="sugerencia-categoria">
                              {item.idCategoria?.nombre || 'Producto'}
                            </span>
                            <span className="sugerencia-precio">
                              S/ {Number(item.precio || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className="sugerencias-footer"
                    onClick={() => {
                      setMostrarSugerencias(false);
                      handleBuscar();
                    }}
                  >
                    <span>Ver todos los resultados para "{busqueda}"</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="btn-filtro-mobile"
              onClick={() => setFiltrosMobileAbiertos(true)}
            >
              <SlidersHorizontal size={20} /> Filtros
            </button>
          </div>

          {/* Banner de búsqueda activa */}
          {busqueda.trim() && (
            <div className="banner-resultados-busqueda">
              <div className="banner-texto">
                <Sparkles size={16} className="icono-sparkle" />
                <span>
                  Resultados para <strong>"{busqueda}"</strong>
                  {categoriaNombre && (
                    <> en la categoría <strong>"{categoriaNombre}"</strong></>
                  )}
                  {' '}—{' '}
                  <span className="contador-badge">
                    {paginacionInfo ? paginacionInfo.total : productos.length} producto{((paginacionInfo ? paginacionInfo.total : productos.length) === 1) ? '' : 's'} encontrado{((paginacionInfo ? paginacionInfo.total : productos.length) === 1) ? '' : 's'}
                  </span>
                </span>
              </div>
            </div>
          )}

          {error && <div className="mensaje-error">{error}</div>}

          {loading ? (
            <div className="cargando">Cargando productos...</div>
          ) : (
            <>
              <div className="grid-productos">
                {productos.length > 0 ? (
                  productos.map((prod) => (
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
                  <div className="sin-resultados-pro">
                    <div className="icono-vacio-wrapper">
                      <SearchX size={48} />
                    </div>
                    <h3>No encontramos productos</h3>
                    <p>
                      {busqueda.trim()
                        ? `No hay coincidencias para "${busqueda}"${
                            categoriaNombre ? ` en la categoría "${categoriaNombre}"` : ''
                          }.`
                        : 'No hay productos disponibles en esta sección.'}
                    </p>

                    {busqueda.trim() && (
                      <div className="sugerencias-busqueda-tags">
                        <span className="sugerencias-label">Búsquedas sugeridas:</span>
                        <div className="tags-flex">
                          {SUGERENCIAS_RAPIDAS.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              className="tag-sugerencia"
                              onClick={() => handleAplicarTag(tag)}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="acciones-sin-resultados">
                      {categoriaSeleccionada && (
                        <button
                          type="button"
                          className="btn-buscar-todas-cats"
                          onClick={() => handleFiltrarCategoria('')}
                        >
                          Buscar en todas las categorías
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-restablecer-todo"
                        onClick={handleRestablecerTodo}
                      >
                        <RotateCcw size={15} /> Ver todo el catálogo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {productos.length > 0 && (
                <Paginacion
                  pagination={paginacionInfo}
                  onCambiarPagina={handleCambiarPagina}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de detalle */}
      <ModalProductoDetalle
        producto={productoSeleccionado}
        onClose={() => setProductoSeleccionado(null)}
      />
    </div>
  );
}

export { Productos };
export default Productos;
