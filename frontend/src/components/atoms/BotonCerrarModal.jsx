
import { X } from 'lucide-react';

const BotonCerrarModal = ({ onClick, className = "btn-cerrar-detalle" }) => {
  return (
    <button className={className} onClick={onClick} aria-label="Cerrar modal">
      <X size={24} />
    </button>
  );
};

export default BotonCerrarModal;
