// Página institucional Nosotros
import { useNavigate } from "react-router-dom";
import "./Nosotros.css";

import imagenUno from "../../assets/Nosotros/imagen.uno.png";
import imagenDos from "../../assets/Nosotros/imagen.dos.png";
import imagenTres from "../../assets/Nosotros/imagen.tres.png";
import imagenCuatro from "../../assets/Nosotros/imagen.cuatro.png";

function Nosotros() {
  const navigate = useNavigate();

  return (
    <main className="nosotros">
      {/* Hero */}
      <section className="hero-nosotros">
        <div className="hero-contenido">
          <span className="etiqueta">NOSOTROS</span>
          <h1>Sobre <strong>ELECTRONOVA</strong></h1>
          <p>
            Somos una tienda especializada en productos eléctricos
            que nace con el propósito de llevar soluciones confiables,
            seguras y de calidad a hogares, profesionales y empresas
            en todo el Perú.
          </p>
          <button type="button" onClick={() => navigate("/productos")}>
            Conoce más →
          </button>
        </div>

        <div className="hero-imagen">
          <img src={imagenUno} alt="Tienda Electronova" />
        </div>
      </section>

      {/* Beneficios */}
      <section className="beneficios">
        <div className="beneficio">
          <h3>Calidad garantizada</h3>
          <p>Trabajamos con las mejores marcas del mercado.</p>
        </div>

        <div className="beneficio">
          <h3>Atención personalizada</h3>
          <p>Te asesoramos en cada paso de tu compra.</p>
        </div>

        <div className="beneficio">
          <h3>Productos confiables</h3>
          <p>Soluciones seguras para tus proyectos.</p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="mision-vision">
        <div className="esencia">
          <span>NUESTRA ESENCIA</span>
          <h2>Misión y Visión</h2>
          <p>
            Trabajamos cada día para ser tu aliado en soluciones
            eléctricas, brindando productos de calidad, un servicio
            excepcional y contribuyendo al desarrollo de un futuro
            más seguro e iluminado.
          </p>
        </div>

        <div className="tarjetas-mision">
          <article className="tarjeta">
            <img src={imagenTres} alt="Nuestra misión" />
            <h3>Nuestra Misión</h3>
            <p>
              Brindar productos eléctricos de alta calidad con un
              servicio confiable y personalizado.
            </p>
          </article>

          <article className="tarjeta">
            <img src={imagenCuatro} alt="Nuestra visión" />
            <h3>Nuestra Visión</h3>
            <p>
              Ser la tienda líder en soluciones eléctricas,
              reconocida por innovación, confianza y compromiso.
            </p>
          </article>
        </div>
      </section>

      {/* Soluciones */}
      <section className="soluciones">
        <div className="soluciones-imagen">
          <img src={imagenDos} alt="Equipo Electronova" />
        </div>

        <div className="soluciones-texto">
          <h2>¿Por qué elegir ELECTRONOVA?</h2>
          <p>
            Porque combinamos experiencia, calidad y un verdadero
            compromiso con nuestros clientes. Aquí encuentras más
            que productos, encuentras soluciones.
          </p>
        </div>
      </section>
    </main>
  );
}

export { Nosotros };
