import { useState, useEffect } from 'react';

const GaleriaProducto = ({ producto }) => {
  const [indiceActivo, setIndiceActivo] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndiceActivo(0);
  }, [producto]);

  const getAbsUrl = (url) => {
    if (!url) return "https://via.placeholder.com/600";
    return url.startsWith('http') || url.startsWith('data:image') ? url : `${import.meta.env.VITE_API_URL}${url}`;
  };

  return (
    <div className="detalle-galeria">
      <div className="imagen-principal-contenedor">
        {producto.imagenes && producto.imagenes.length > 0 ? (
          producto.imagenes.map((img, idx) => (
            <img 
              key={idx}
              src={getAbsUrl(img.ubicacion)} 
              alt={`${producto.nombre} - ${idx + 1}`} 
              className="imagen-principal-detalle"
              style={{ display: idx === indiceActivo ? 'block' : 'none' }}
            />
          ))
        ) : (
          <img 
            src={getAbsUrl(producto.imagenPrincipal)} 
            alt={producto.nombre} 
            className="imagen-principal-detalle" 
            style={{ display: 'block' }} 
          />
        )}
      </div>
      
      {producto.imagenes && producto.imagenes.length > 1 && (
        <div className="miniaturas-contenedor">
          {producto.imagenes.map((img, idx) => (
            <div 
              key={idx} 
              className={`miniatura-item ${idx === indiceActivo ? 'activa' : ''}`}
              onClick={() => setIndiceActivo(idx)}
            >
              <img src={getAbsUrl(img.ubicacion)} alt={`Vista ${idx + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GaleriaProducto;

