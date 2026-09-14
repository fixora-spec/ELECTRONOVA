import { useState } from 'react';
import { X } from 'lucide-react';
import { categoriasService } from '../../services/categorias.service';
import { useAuth } from '../../hooks/useAuth';

const ModalFormularioCategoria = ({ modoEdicion, categoriaInicial, onClose, onSuccess }) => {
  const { admin } = useAuth();
  const [categoriaActual, setCategoriaActual] = useState(categoriaInicial);
  const [guardando, setGuardando] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoriaActual({ ...categoriaActual, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    
    try {
      const dataToSend = {
        nombre: categoriaActual.nombre,
        descripcion: categoriaActual.descripcion,
        idAdministrador: admin?.id || admin?._id
      };

      if (modoEdicion) {
        await categoriasService.update(categoriaActual._id, dataToSend);
      } else {
        await categoriasService.create(dataToSend);
      }
      
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar la categoría');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-cabecera">
          <h3>{modoEdicion ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
          <button type="button" className="btn-cerrar-modal" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-formulario" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ overflowY: 'auto', paddingRight: '0.5rem', paddingBottom: '1rem', flex: 1 }}>
            <div className="form-grupo">
              <label>Nombre de la Categoría *</label>
              <input 
                type="text" 
                name="nombre" 
                value={categoriaActual.nombre} 
                onChange={handleInputChange} 
                required 
                placeholder="Ej. Iluminación LED"
              />
            </div>
            
            <div className="form-grupo">
              <label>Descripción</label>
              <textarea 
                name="descripcion" 
                value={categoriaActual.descripcion} 
                onChange={handleInputChange}
                rows="4"
                placeholder="Describe brevemente los productos de esta categoría"
              ></textarea>
            </div>
          </div>

          <div className="modal-acciones" style={{ marginTop: '0', paddingTop: '1rem', flexShrink: 0 }}>
            <button type="button" className="btn-secundario" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primario" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalFormularioCategoria;
