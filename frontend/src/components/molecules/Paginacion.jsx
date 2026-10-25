import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import './Paginacion.css';

export function Paginacion({ pagination, onCambiarPagina }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;

  // Calcular rango de elementos mostrados
  const inicio = (page - 1) * limit + 1;
  const fin = Math.min(page * limit, total);

  // Generar arreglo de números de página para mostrar
  const obtenerNumerosPagina = () => {
    const paginas = [];
    const delta = 2; // Cantidad de páginas a los lados de la actual

    const rangoIzquierdo = Math.max(1, page - delta);
    const rangoDerecho = Math.min(totalPages, page + delta);

    for (let i = rangoIzquierdo; i <= rangoDerecho; i++) {
      paginas.push(i);
    }

    return { paginas, mostrarInicio: rangoIzquierdo > 1, mostrarFin: rangoDerecho < totalPages };
  };

  const { paginas, mostrarInicio, mostrarFin } = obtenerNumerosPagina();

  return (
    <div className="paginacion-contenedor">
      <div className="paginacion-info">
        Mostrando <strong>{inicio}</strong> - <strong>{fin}</strong> de <strong>{total}</strong> productos
      </div>

      <div className="paginacion-botones">
        {/* Ir al inicio */}
        <button
          type="button"
          className="paginacion-btn"
          disabled={page === 1}
          onClick={() => onCambiarPagina(1)}
          title="Primera página"
        >
          <ChevronsLeft size={18} />
        </button>

        {/* Anterior */}
        <button
          type="button"
          className="paginacion-btn"
          disabled={!pagination.hasPrevPage}
          onClick={() => onCambiarPagina(page - 1)}
          title="Página anterior"
        >
          <ChevronLeft size={18} />
          <span className="btn-texto">Anterior</span>
        </button>

        {/* Primera página si está lejos */}
        {mostrarInicio && (
          <>
            <button
              type="button"
              className={`paginacion-numero ${page === 1 ? 'activo' : ''}`}
              onClick={() => onCambiarPagina(1)}
            >
              1
            </button>
            <span className="paginacion-puntos">...</span>
          </>
        )}

        {/* Números de página */}
        {paginas.map((num) => (
          <button
            key={num}
            type="button"
            className={`paginacion-numero ${page === num ? 'activo' : ''}`}
            onClick={() => onCambiarPagina(num)}
          >
            {num}
          </button>
        ))}

        {/* Última página si está lejos */}
        {mostrarFin && (
          <>
            <span className="paginacion-puntos">...</span>
            <button
              type="button"
              className={`paginacion-numero ${page === totalPages ? 'activo' : ''}`}
              onClick={() => onCambiarPagina(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Siguiente */}
        <button
          type="button"
          className="paginacion-btn"
          disabled={!pagination.hasNextPage}
          onClick={() => onCambiarPagina(page + 1)}
          title="Página siguiente"
        >
          <span className="btn-texto">Siguiente</span>
          <ChevronRight size={18} />
        </button>

        {/* Ir al final */}
        <button
          type="button"
          className="paginacion-btn"
          disabled={page === totalPages}
          onClick={() => onCambiarPagina(totalPages)}
          title="Última página"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default Paginacion;
