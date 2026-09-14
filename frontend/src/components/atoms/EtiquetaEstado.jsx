
import { CheckCircle2, XCircle } from 'lucide-react';
import './EtiquetaEstado.css';

const EtiquetaEstado = ({ estado }) => {
  // estado viene como string ("En stock", "Agotado") o booleano (true, false)
  // por si acaso, lo parseamos visualmente
  const isAgotado = estado === false || estado === 'Agotado';
  
  return (
    <span className={`etiqueta-estado ${isAgotado ? 'etiqueta-agotado' : 'etiqueta-stock'}`}>
      {isAgotado ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
      {isAgotado ? 'Agotado' : 'En Stock'}
    </span>
  );
};

export default EtiquetaEstado;
