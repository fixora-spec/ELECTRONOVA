// Control de paginación
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import './Paginacion.css';

export function Paginacion({ pagination, onCambiarPagina }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;
  const inicio = (page - 1) * limit + 1;
  const fin = Math.min(page * limit, total);

  // Cálculo de páginas visibles
  const obtenerNumerosPagina = () => {
    const paginas = [];
    const delta = 2;
    const rangoIzquierdo = Math.max(1, page - delta);
    const rangoDerecho = Math.min(totalPages, page + delta);

    for (let i = rangoIzquierdo; i <= rangoDerecho; i++) {
      paginas.push(i);
    }

    return { paginas, mostrarInicio: rangoIzquierdo > 1, mostrarFin: rangoDerecho < totalPages };
  };

  const { paginas, mostrarInicio, mostrarFin } = obtenerNumerosPagina();

  return (
    <nav className="paginacion-contenedor" aria-label="Navegación de páginas">
      {/* Resumen de registros */}
      <div className="paginacion-info-pill">
        <span>Mostrando</span>
        <span className="paginacion-resaltado">{inicio} - {fin}</span>
        <span>de</span>
        <span className="paginacion-resaltado">{total}</span>
        <span>productos</span>
      </div>

      {/* Botones de navegación en dock */}
      <div className="paginacion-dock">
        <button
          type="button"
          className="paginacion-btn paginacion-btn-nav"
          disabled={page === 1}
          onClick={() => onCambiarPagina(1)}
          title="Primera página"
          aria-label="Primera página"
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          type="button"
          className="paginacion-btn paginacion-btn-prev"
          disabled={!pagination.hasPrevPage}
          onClick={() => onCambiarPagina(page - 1)}
          title="Página anterior"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
          <span className="btn-texto">Anterior</span>
        </button>

        <div className="paginacion-numeros-grupo">
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
        </div>

        <button
          type="button"
          className="paginacion-btn paginacion-btn-next"
          disabled={!pagination.hasNextPage}
          onClick={() => onCambiarPagina(page + 1)}
          title="Página siguiente"
          aria-label="Página siguiente"
        >
          <span className="btn-texto">Siguiente</span>
          <ChevronRight size={16} />
        </button>

        <button
          type="button"
          className="paginacion-btn paginacion-btn-nav"
          disabled={page === totalPages}
          onClick={() => onCambiarPagina(totalPages)}
          title="Última página"
          aria-label="Última página"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </nav>
  );
}

export default Paginacion;
