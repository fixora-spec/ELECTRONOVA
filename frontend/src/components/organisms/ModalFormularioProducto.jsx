import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { productosService } from '../../services/productos.service';
import { useAuth } from '../../hooks/useAuth';

const ModalFormularioProducto = ({ modoEdicion, productoInicial, categorias, onClose, onSuccess }) => {
  const { admin } = useAuth();
  const [productoActual, setProductoActual] = useState(productoInicial);
  const [guardando, setGuardando] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductoActual({
      ...productoActual,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImagenChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const disponibles = 5 - productoActual.previewImagenes.length;
      
      if (disponibles <= 0) {
        alert("Ya has alcanzado el límite máximo de 5 imágenes.");
        e.target.value = null;
        return;
      }
      
      const archivosPermitidos = files.slice(0, disponibles);
      const nuevosArchivos = [...productoActual.imagenes, ...archivosPermitidos];
      const nuevosPreviews = [...productoActual.previewImagenes, ...archivosPermitidos.map(f => URL.createObjectURL(f))];
      
      setProductoActual({
        ...productoActual,
        imagenes: nuevosArchivos,
        previewImagenes: nuevosPreviews
      });
      
      if (files.length > disponibles) {
        alert(`Solo se agregaron ${disponibles} imagen(es). El límite es de 5 en total.`);
      }
      
      e.target.value = null;
    }
  };

  const handleEliminarImagen = (index) => {
    const nuevasPreviews = [...productoActual.previewImagenes];
    nuevasPreviews.splice(index, 1);
    
    const nuevasImagenes = [...productoActual.imagenes];
    
    if (nuevasImagenes.length === productoActual.previewImagenes.length) {
      nuevasImagenes.splice(index, 1);
    } else {
      const numExistentes = productoActual.previewImagenes.length - productoActual.imagenes.length;
      if (index >= numExistentes) {
        nuevasImagenes.splice(index - numExistentes, 1);
      }
    }

    setProductoActual({
      ...productoActual,
      imagenes: nuevasImagenes,
      previewImagenes: nuevasPreviews
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    
    try {
      const formData = new FormData();
      formData.append('nombre', productoActual.nombre);
      formData.append('precio', productoActual.precio);
      formData.append('idCategoria', productoActual.idCategoria);
      formData.append('descripcionCorta', productoActual.descripcionCorta);
      formData.append('descripcionCompleta', productoActual.descripcionCompleta);
      formData.append('especificacionesTec', productoActual.especificacionesTec);
      formData.append('caracteristicas', productoActual.caracteristicas);
      formData.append('productoDestacado', productoActual.productoDestacado);
      formData.append('idAdministrador', admin?.id || admin?._id);
      
      if (productoActual.imagenes && productoActual.imagenes.length > 0) {
        productoActual.imagenes.forEach(img => {
          formData.append('imagenes', img);
        });
      }

      const imagenesExistentesUrls = productoActual.previewImagenes.filter(p => 
        typeof p === 'string' && 
        (p.startsWith('/') || p.startsWith('http') || p.startsWith('data:image')) && 
        !p.startsWith('blob:')
      );
      formData.append('imagenesExistentes', JSON.stringify(imagenesExistentesUrls));

      if (modoEdicion) {
        await productosService.update(productoActual._id, formData);
      } else {
        await productosService.create(formData);
      }
      
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar el producto');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido" style={{ maxWidth: '800px', width: '90%' }}>
        <div className="modal-cabecera">
          <h3>{modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <button type="button" className="btn-cerrar-modal" onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-formulario" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          <div className="admin-productos-grid" style={{ overflowY: 'auto', paddingRight: '0.5rem', paddingBottom: '1rem', flex: 1 }}>
            <div>
              <div className="form-grupo">
                <label>Nombre del Producto *</label>
                <input type="text" name="nombre" value={productoActual.nombre} onChange={handleInputChange} required />
              </div>

              <div className="form-grupo" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Precio *</label>
                  <input type="number" step="0.01" name="precio" value={productoActual.precio} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>Categoría *</label>
                  <select name="idCategoria" value={productoActual.idCategoria} onChange={handleInputChange} required>
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grupo">
                <label>Descripción Corta *</label>
                <textarea name="descripcionCorta" value={productoActual.descripcionCorta} onChange={handleInputChange} rows="2" required></textarea>
              </div>

              <div className="form-grupo">
                <label>Descripción Completa</label>
                <textarea name="descripcionCompleta" value={productoActual.descripcionCompleta} onChange={handleInputChange} rows="4"></textarea>
              </div>
            </div>

            <div>
              <div className="form-grupo">
                <label>Especificaciones Técnicas</label>
                <textarea name="especificacionesTec" value={productoActual.especificacionesTec} onChange={handleInputChange} rows="3"></textarea>
              </div>

              <div className="form-grupo">
                <label>Características</label>
                <textarea name="caracteristicas" value={productoActual.caracteristicas} onChange={handleInputChange} rows="3"></textarea>
              </div>

              <div className="form-grupo">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '6px' }}>
                  <input type="checkbox" name="productoDestacado" checked={productoActual.productoDestacado} onChange={handleInputChange} style={{ width: 'auto' }} />
                  Mostrar en página de inicio (Producto Destacado)
                </label>
              </div>

              <div className="form-grupo">
                <label>Imágenes del Producto (hasta 5)</label>
                <div className="custom-file-upload">
                  <input 
                    type="file" 
                    id="file-upload" 
                    accept="image/*" 
                    multiple
                    onChange={handleImagenChange} 
                    className="file-input-hidden"
                  />
                  <label htmlFor="file-upload" className="btn-file-upload">
                    <ImageIcon size={18} />
                    Seleccionar Imágenes
                  </label>
                  <span className="file-name-display">
                    {productoActual.previewImagenes && productoActual.previewImagenes.length >= 5 
                      ? 'Límite máximo (5/5) alcanzado' 
                      : `${productoActual.previewImagenes ? 5 - productoActual.previewImagenes.length : 5} espacio(s) libre(s)`}
                  </span>
                </div>
                
                {productoActual.previewImagenes && productoActual.previewImagenes.length > 0 && (
                  <div style={{ marginTop: '0.8rem', border: '1px dashed var(--primary-blue)', padding: '0.5rem', borderRadius: '6px', backgroundColor: '#fafafa', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {productoActual.previewImagenes.map((prev, index) => (
                      <div key={index} style={{ position: 'relative', width: 'calc(20% - 0.4rem)', aspectRatio: '1/1' }}>
                        <img src={prev.startsWith('http') || prev.startsWith('blob') || prev.startsWith('data:image') ? prev : (prev.startsWith('/') ? `${import.meta.env.VITE_API_URL}${prev}` : `${import.meta.env.VITE_API_URL}/${prev}`)} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px' }} />
                        <button 
                          type="button"
                          onClick={() => handleEliminarImagen(index)}
                          style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            backgroundColor: '#d93025',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: 0,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                          title="Eliminar imagen"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-acciones" style={{ marginTop: '0', paddingTop: '1rem', flexShrink: 0 }}>
            <button type="button" className="btn-secundario" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primario" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalFormularioProducto;

