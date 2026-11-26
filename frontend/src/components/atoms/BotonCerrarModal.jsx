// Botón de cierre de modal
import { X } from 'lucide-react';

const BotonCerrarModal = ({ onClick, className = 'btn-cerrar-detalle' }) => {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label="Cerrar ventana"
    >
      <X size={24} />
    </button>
  );
};

export default BotonCerrarModal;
