// Administración de productos
import { useState, useEffect } from 'react';
import { productosService } from '../../services/productos.service';
import { categoriasService } from '../../services/categorias.service';
import { Plus, Search } from 'lucide-react';
import './AdminCategorias.css';
import TablaProductosAdmin from '../organisms/TablaProductosAdmin';
import ModalFormularioProducto from '../organisms/ModalFormularioProducto';

const ESTADO_INICIAL_PRODUCTO = {
  _id: '',
  nombre: '',
  precio: '',
  idCategoria: '',
  descripcionCorta: '',
  descripcionCompleta: '',
  especificacionesTec: '',
  caracteristicas: '',
  productoDestacado: false,
  estado: true,
  imagenes: [],
  previewImagenes: []
};

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoActual, setProductoActual] = useState(ESTADO_INICIAL_PRODUCTO);

  // Carga de datos
  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        productosService.getAll(),
        categoriasService.getAll()
      ]);
      setProductos(prods);
      setCategorias(cats);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  }

  // Acciones de modal y estado
  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setProductoActual(ESTADO_INICIAL_PRODUCTO);
    setModalAbierto(true);
  };

  const abrirModalEditar = async (prod) => {
    try {
      setLoading(true);
      const productoCompleto = await productosService.getById(prod._id || prod.idProducto);

      setModoEdicion(true);
      setProductoActual({
        ...productoCompleto,
        idCategoria: productoCompleto.idCategoria?._id || productoCompleto.idCategoria,
        imagenes: [],
        previewImagenes:
          productoCompleto.imagenes && productoCompleto.imagenes.length > 0
            ? productoCompleto.imagenes.map((img) => img.ubicacion)
            : []
      });
      setModalAbierto(true);
    } catch (err) {
      console.error('Error al obtener el producto completo', err);
      alert('Error al cargar la información completa del producto');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productosService.delete(id);
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleToggleEstado = async (prod) => {
    const nuevoEstado = prod.estado === false;
    try {
      const formData = new FormData();
      formData.append('estado', nuevoEstado);
      await productosService.update(prod._id || prod.idProducto, formData);
      cargarDatos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('No se pudo actualizar el estado del producto');
    }
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading && productos.length === 0) return <div className="cargando-admin">Cargando productos...</div>;

  return (
    <div className="admin-modulo">
      {/* Cabecera */}
      <div className="admin-cabecera-modulo">
        <div>
          <h2>Gestión de Productos</h2>
          <p>Administra el catálogo completo de productos.</p>
        </div>
        <button className="btn-nuevo" onClick={abrirModalNuevo}>
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      {/* Buscador */}
      <div className="admin-controles">
        <div className="admin-buscador">
          <Search size={18} className="icono-buscar" />
          <input
            type="text"
            placeholder="Buscar producto por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla y modal */}
      <TablaProductosAdmin
        productos={productosFiltrados}
        categorias={categorias}
        onEdit={abrirModalEditar}
        onDelete={handleEliminar}
        onToggleEstado={handleToggleEstado}
      />

      {modalAbierto && (
        <ModalFormularioProducto
          modoEdicion={modoEdicion}
          productoInicial={productoActual}
          categorias={categorias}
          onClose={() => setModalAbierto(false)}
          onSuccess={() => {
            setModalAbierto(false);
            cargarDatos();
          }}
        />
      )}
    </div>
  );
}

export { AdminProductos };
