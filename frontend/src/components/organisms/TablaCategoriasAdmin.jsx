
import { Edit2, Trash2 } from 'lucide-react';

const TablaCategoriasAdmin = ({ categorias, onEdit, onDelete }) => {
  return (
    <div className="tabla-contenedor">
      <table className="tabla-admin">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length > 0 ? (
            categorias.map((cat) => (
              <tr key={cat._id}>
                <td className="fw-bold">{cat.nombre}</td>
                <td>{cat.descripcion || <span className="text-muted">Sin descripción</span>}</td>
                <td>
                  <div className="acciones-celda">
                    <button className="btn-accion btn-editar" onClick={() => onEdit(cat)} title="Editar">
                      <Edit2 size={18} />
                    </button>
                    <button className="btn-accion btn-eliminar" onClick={() => onDelete(cat._id)} title="Eliminar">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="texto-centrado">No se encontraron categorías.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaCategoriasAdmin;
