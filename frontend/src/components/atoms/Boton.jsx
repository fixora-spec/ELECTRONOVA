
import './Boton.css';

const Boton = ({ children, variant = 'primario', onClick, icon: Icon, className = '' }) => {
  return (
    <button className={`boton boton-${variant} ${className}`} onClick={onClick}>
      {Icon && <Icon className="boton-icono" size={18} />}
      {children}
    </button>
  );
};

export default Boton;
