// Tabla de administración de productos
import { Edit2, Trash2, ImageIcon } from 'lucide-react';
import { getProductoImagen } from '../../services/api';

const TablaProductosAdmin = ({ productos, categorias, onEdit, onDelete, onToggleEstado }) => {
  // Utilidades de formato
  const getCategoriaNombre = (id) => {
    if (typeof id === 'object' && id !== null) return id.nombre;
    const cat = categorias.find((c) => c._id === id);
    return cat ? cat.nombre : 'Sin categoría';
  };

  return (
    <div className="tabla-contenedor">
      <table className="tabla-admin">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Destacado</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((prod) => {
              const imgUrl = getProductoImagen(prod);
              return (
                <tr key={prod._id}>
                  <td>
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={prod.nombre}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <div style={{ width: '50px', height: '50px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', color: '#aaa' }}>
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </td>
                  <td className="fw-bold">{prod.nombre}</td>
                  <td>{getCategoriaNombre(prod.idCategoria)}</td>
                  <td>S/ {prod.precio?.toFixed(2) || '0.00'}</td>
                  <td>{prod.productoDestacado ? 'Sí' : 'No'}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => (onToggleEstado ? onToggleEstado(prod) : onEdit(prod))}
                      className={`badge-estado ${prod.estado !== false ? 'activo' : 'inactivo'}`}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: prod.estado !== false ? '#e6f4ea' : '#fce8e6',
                        color: prod.estado !== false ? '#137333' : '#c5221f',
                        transition: 'all 0.2s ease'
                      }}
                      title="Haz clic para cambiar el estado (Activo / Inactivo)"
                    >
                      {prod.estado !== false ? '● Activo' : '○ Inactivo'}
                    </button>
                  </td>
                  <td>
                    <div className="acciones-celda">
                      <button className="btn-accion btn-editar" onClick={() => onEdit(prod)} title="Editar">
                        <Edit2 size={18} />
                      </button>
                      <button className="btn-accion btn-eliminar" onClick={() => onDelete(prod._id)} title="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="texto-centrado">No se encontraron productos.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaProductosAdmin;
