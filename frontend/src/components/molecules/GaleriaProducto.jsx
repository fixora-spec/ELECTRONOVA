// Galería de imágenes del producto
import { useState } from 'react';
import { resolveImageUrl } from '../../services/api';

const GaleriaProducto = ({ producto }) => {
  const [indiceActivo, setIndiceActivo] = useState(0);

  if (!producto) return null;

  const imagenes =
    producto.imagenes && producto.imagenes.length > 0
      ? producto.imagenes
      : [{ ubicacion: producto.imagenPrincipal }];

  const indiceValido = indiceActivo < imagenes.length ? indiceActivo : 0;

  return (
    <div className="detalle-galeria">
      {/* Imagen principal */}
      <div className="imagen-principal-contenedor">
        <img
          src={resolveImageUrl(imagenes[indiceValido]?.ubicacion, 'https://via.placeholder.com/600')}
          alt={producto.nombre}
          className="imagen-principal-detalle"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/600';
          }}
        />
      </div>

      {/* Miniaturas */}
      {imagenes.length > 1 && (
        <div className="miniaturas-contenedor">
          {imagenes.map((img, index) => (
            <button
              key={index}
              type="button"
              className={`miniatura-item ${index === indiceValido ? 'activa' : ''}`}
              onClick={() => setIndiceActivo(index)}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <img
                src={resolveImageUrl(img.ubicacion, 'https://via.placeholder.com/100')}
                alt={`${producto.nombre} vista ${index + 1}`}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/100';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GaleriaProducto;
