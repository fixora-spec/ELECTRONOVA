
import { Truck, ShieldCheck, Headset } from 'lucide-react';
import Boton from '../atoms/Boton';
import imagenInicio from '../../assets/img-inicio.png';
import './SeccionHero.css';

const SeccionHero = () => {
  return (
    <section className="hero">
      <div className="hero-contenido">
        <h1 className="hero-titulo">
          Todo en <br />
          <span className="hero-destacado">productos eléctricos</span><br />
          en un solo lugar
        </h1>
        <p className="hero-descripcion">
          Encuentra la mejor calidad en materiales eléctricos para tus proyectos, hogar y negocio.
        </p>
        <Boton variant="secundario">Ver catálogo</Boton>

        <div className="hero-beneficios">
          <div className="beneficio">
            <Truck size={24} />
            <div className="beneficio-texto">
              <strong>Envíos seguros</strong>
              <span>a todo el Perú</span>
            </div>
          </div>
          <div className="beneficio">
            <ShieldCheck size={24} />
            <div className="beneficio-texto">
              <strong>Calidad</strong>
              <span>garantizada</span>
            </div>
          </div>
          <div className="beneficio">
            <Headset size={24} />
            <div className="beneficio-texto">
              <strong>Asesoría</strong>
              <span>especializada</span>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-imagen-fondo">
        <div className="hero-overlay"></div>
        <img src={imagenInicio} alt="Productos Eléctricos" className="hero-imagen-destacada" />
        <div className="hero-slogan">Iluminando tus ideas.</div>
      </div>
    </section>
  );
};
export default SeccionHero;