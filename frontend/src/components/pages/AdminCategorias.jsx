import { useState, useEffect } from 'react';
import { categoriasService } from '../../services/categorias.service';
import { Plus, Search } from 'lucide-react';
import './AdminCategorias.css';
import TablaCategoriasAdmin from '../organisms/TablaCategoriasAdmin';
import ModalFormularioCategoria from '../organisms/ModalFormularioCategoria';

function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaActual, setCategoriaActual] = useState({ _id: '', nombre: '', descripcion: '' });

  useEffect(() => {
    cargarCategorias();
  }, []);

  async function cargarCategorias() {
    try {
      setLoading(true);
      const data = await categoriasService.getAll();
      setCategorias(data);
    } catch (err) {
      setError('Error al cargar las categorías');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setCategoriaActual({ _id: '', nombre: '', descripcion: '' });
    setModalAbierto(true);
  };

  const abrirModalEditar = (categoria) => {
    setModoEdicion(true);
    setCategoriaActual(categoria);
    setModalAbierto(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.')) {
      try {
        await categoriasService.delete(id);
        cargarCategorias();
      } catch (err) {
        alert(err.response?.data?.message || 'Error al eliminar la categoría. Asegúrate de que no tenga productos asociados.');
      }
    }
  };

  const categoriasFiltradas = categorias.filter(cat => 
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading && categorias.length === 0) return <div className="cargando-admin">Cargando categorías...</div>;

  return (
    <div className="admin-modulo">
      <div className="admin-cabecera-modulo">
        <div>
          <h2>Gestión de Categorías</h2>
          <p>Crea, edita o elimina las categorías de tu catálogo.</p>
        </div>
        <button className="btn-nuevo" onClick={abrirModalNuevo}>
          <Plus size={20} /> Nueva Categoría
        </button>
      </div>

      <div className="admin-controles">
        <div className="admin-buscador">
          <Search size={18} className="icono-buscar" />
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {error ? (
        <div className="error-mensaje">{error}</div>
      ) : (
        <TablaCategoriasAdmin 
          categorias={categoriasFiltradas} 
          onEdit={abrirModalEditar} 
          onDelete={handleEliminar} 
        />
      )}

      {modalAbierto && (
        <ModalFormularioCategoria 
          modoEdicion={modoEdicion}
          categoriaInicial={categoriaActual}
          onClose={() => setModalAbierto(false)}
          onSuccess={() => {
            setModalAbierto(false);
            cargarCategorias();
          }}
        />
      )}
    </div>
  );
}

export { AdminCategorias };
