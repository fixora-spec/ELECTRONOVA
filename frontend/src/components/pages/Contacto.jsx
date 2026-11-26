// Página de contacto
import { useState } from "react";
import "./Contacto.css";

// Datos de contacto
const DATOS_CONTACTO = {
  telefono: "+51 987 654 321",
  whatsapp: "51987654321",
  correo: "ventas@electronova.com",
  direccion: "Av. Principal 123, Celendín - Perú",
  horario: { dias: "Lunes a sábado", horas: "8:00 a. m. a 6:00 p. m." },
  referenciaMapa: "Celendín, Perú",
};

// Iconografía SVG
const TRAZOS = {
  telefono: ["M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"],
  correo: ["M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z", "m22 6-10 7L2 6"],
  ubicacion: ["M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z", "M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"],
  reloj: ["M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z", "M12 6v6l4 2"],
  mensaje: ["M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"],
  flecha: ["M7 17 17 7", "M7 7h10v10"],
  rayo: ["m13 2-3 8H5l6 12 3-8h5L13 2Z"],
  check: ["m5 12 4 4L19 6"],
};

function IconoContacto({ nombre, className = "" }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true" focusable="false">
      {TRAZOS[nombre].map((trazo, indice) => <path key={indice} d={trazo} />)}
    </svg>
  );
}

// Componente principal
function Contacto() {
  const [mensaje, setMensaje] = useState("");
  const [enlacePreparado, setEnlacePreparado] = useState("");
  const chatDirecto = `https://wa.me/${DATOS_CONTACTO.whatsapp}?text=${encodeURIComponent("Hola, ELECTRONOVA. Quisiera consultar sobre sus productos.")}`;
  const enlaceMapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(DATOS_CONTACTO.direccion)}`;
  const mapa = `https://maps.google.com/maps?q=${encodeURIComponent(DATOS_CONTACTO.referenciaMapa)}&z=14&output=embed`;

  function prepararConsulta(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);
    const nombre = String(datos.get("nombre") || "").trim();
    const telefono = String(datos.get("telefono") || "").trim();
    const correo = String(datos.get("correo") || "").trim();
    const motivo = String(datos.get("motivo") || "").trim();
    const consulta = String(datos.get("mensaje") || "").trim();

    if (nombre.length < 2 || consulta.length < 10) {
      const campo = formulario.elements.namedItem(nombre.length < 2 ? "nombre" : "mensaje");
      campo.setCustomValidity(nombre.length < 2
        ? "Escribe un nombre de al menos 2 caracteres."
        : "Escribe una consulta de al menos 10 caracteres.");
      campo.reportValidity();
      return;
    }

    const texto = [
      "Hola, ELECTRONOVA. Quisiera realizar una consulta.",
      `Nombre: ${nombre}`,
      telefono ? `Teléfono: ${telefono}` : null,
      correo ? `Correo: ${correo}` : null,
      `Motivo: ${motivo}`,
      "",
      consulta,
    ].filter((linea) => linea !== null).join("\n");

    const enlace = `https://wa.me/${DATOS_CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`;
    setEnlacePreparado(enlace);
    window.open(enlace, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="contacto-page">
      {/* Cabecera Hero */}
      <section className="contacto-hero" aria-labelledby="contacto-titulo">
        <div className="contacto-contenedor contacto-hero-grid">
          <div className="contacto-presentacion">
            <span className="contacto-etiqueta"><span /> CONTACTO ELECTRONOVA</span>
            <h1 id="contacto-titulo">Conectemos tu<br /><span>próximo proyecto.</span></h1>
            <p>¿Buscas un producto, necesitas una cotización o tienes alguna duda?
              Cuéntanos qué necesitas y conversemos.</p>
            <div className="contacto-acciones">
              <a className="contacto-boton contacto-boton-amarillo" href={chatDirecto}
                target="_blank" rel="noopener noreferrer">
                <IconoContacto nombre="mensaje" /> Hablar por WhatsApp
              </a>
              <a className="contacto-enlace-hero" href="#contacto-formulario">
                Preparar una consulta <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div className="contacto-hero-tarjeta">
            <div className="contacto-hero-icono"><IconoContacto nombre="rayo" /></div>
            <span className="contacto-hero-localidad">CELENDÍN · PERÚ</span>
            <h2>Una buena conexión<br />empieza conversando.</h2>
            <ul className="contacto-temas">
              {["Productos y disponibilidad", "Pedidos y cotizaciones", "Consultas sobre tu compra"].map((tema) => (
                <li key={tema}><IconoContacto nombre="check" />{tema}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Medios de contacto y formulario */}
      <div className="contacto-contenedor contacto-cuerpo">
        <section className="contacto-datos" aria-label="Nuestros medios de contacto">
          <a className="contacto-dato" href={`tel:${DATOS_CONTACTO.telefono.replace(/[^\d+]/g, "")}`}>
            <span className="contacto-dato-icono"><IconoContacto nombre="telefono" /></span>
            <span><span className="contacto-dato-titulo">Llámanos</span>
              <strong>{DATOS_CONTACTO.telefono}</strong><span className="contacto-dato-detalle">Conversemos sobre lo que necesitas</span></span>
          </a>
          <a className="contacto-dato" href={`mailto:${DATOS_CONTACTO.correo}`}>
            <span className="contacto-dato-icono"><IconoContacto nombre="correo" /></span>
            <span><span className="contacto-dato-titulo">Escríbenos</span>
              <strong>{DATOS_CONTACTO.correo}</strong><span className="contacto-dato-detalle">Consultas y cotizaciones</span></span>
          </a>
          <div className="contacto-dato">
            <span className="contacto-dato-icono"><IconoContacto nombre="reloj" /></span>
            <span><span className="contacto-dato-titulo">Horario de atención</span>
              <strong>{DATOS_CONTACTO.horario.dias}</strong><span className="contacto-dato-detalle">{DATOS_CONTACTO.horario.horas}</span></span>
          </div>
        </section>

        <div className="contacto-principal">
          <section className="contacto-formulario-panel" aria-labelledby="contacto-form-titulo">
            <span className="contacto-subtitulo">CUÉNTANOS TU IDEA</span>
            <h2 id="contacto-form-titulo">¿En qué podemos ayudarte?</h2>
            <p className="contacto-descripcion">Completa tu consulta y continúa la conversación en WhatsApp.</p>

            <form id="contacto-formulario" className="contacto-formulario" onSubmit={prepararConsulta}
              onChange={() => setEnlacePreparado("")}
              onInput={(evento) => evento.target.setCustomValidity?.("")}>
              <p className="contacto-campos-nota">Los campos con <span aria-hidden="true">*</span> son obligatorios.</p>
              <div className="contacto-fila">
                <div className="contacto-campo">
                  <label htmlFor="contacto-nombre">Nombre completo <span aria-hidden="true">*</span></label>
                  <input id="contacto-nombre" name="nombre" type="text" placeholder="Tu nombre"
                    autoComplete="name" required minLength={2} maxLength={80} />
                </div>
                <div className="contacto-campo">
                  <label htmlFor="contacto-telefono">Teléfono <span className="contacto-opcional">(opcional)</span></label>
                  <input id="contacto-telefono" name="telefono" type="tel" placeholder="Ej. 987 654 321"
                    autoComplete="tel" maxLength={25} />
                </div>
              </div>
              <div className="contacto-fila">
                <div className="contacto-campo">
                  <label htmlFor="contacto-correo">Correo <span className="contacto-opcional">(opcional)</span></label>
                  <input id="contacto-correo" name="correo" type="email" placeholder="tu@correo.com"
                    autoComplete="email" maxLength={120} />
                </div>
                <div className="contacto-campo">
                  <label htmlFor="contacto-motivo">Motivo de consulta <span aria-hidden="true">*</span></label>
                  <select id="contacto-motivo" name="motivo" required defaultValue="">
                    <option value="" disabled>Selecciona una opción</option>
                    <option>Consulta de productos</option><option>Solicitar una cotización</option>
                    <option>Disponibilidad y pedidos</option><option>Consulta sobre mi compra</option><option>Otro motivo</option>
                  </select>
                </div>
              </div>
              <div className="contacto-campo">
                <label htmlFor="contacto-mensaje">Tu mensaje <span aria-hidden="true">*</span></label>
                <textarea id="contacto-mensaje" name="mensaje" rows={5} required minLength={10} maxLength={1200}
                  placeholder="Indica el producto, la cantidad o los detalles de tu consulta…"
                  value={mensaje} onChange={(evento) => setMensaje(evento.target.value)}
                  aria-describedby="contacto-mensaje-ayuda" />
                <div id="contacto-mensaje-ayuda" className="contacto-mensaje-ayuda">
                  <span>Mínimo 10 caracteres.</span><span>{mensaje.length}/1200</span>
                </div>
              </div>
              <button className="contacto-boton contacto-boton-azul" type="submit">
                <IconoContacto nombre="mensaje" /> Continuar en WhatsApp <IconoContacto nombre="flecha" />
              </button>
              <p className="contacto-envio-nota">Se abrirá WhatsApp con tu consulta. Tú confirmas el envío del mensaje.</p>
              {enlacePreparado && (
                <div className="contacto-estado" role="status">
                  <IconoContacto nombre="check" />
                  <p>Tu consulta está preparada. Si la ventana no se abrió, <a href={enlacePreparado}
                    target="_blank" rel="noopener noreferrer">abre WhatsApp aquí</a>.</p>
                </div>
              )}
            </form>
          </section>

          {/* Mapa y atención directa */}
          <aside className="contacto-lateral" aria-label="Ubicación y atención directa">
            <section className="contacto-ubicacion" aria-labelledby="contacto-ubicacion-titulo">
              <div className="contacto-ubicacion-cabecera">
                <span className="contacto-subtitulo">VEN A VISITARNOS</span>
                <h2 id="contacto-ubicacion-titulo">Encuéntranos en Celendín</h2>
                <p><IconoContacto nombre="ubicacion" />{DATOS_CONTACTO.direccion}</p>
              </div>
              <iframe className="contacto-mapa" title="Mapa de referencia de Celendín, Perú"
                src={mapa} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              <div className="contacto-mapa-pie">
                <span>Mapa de referencia de la ciudad</span>
                <a href={enlaceMapa} target="_blank" rel="noopener noreferrer">
                  Ver dirección <IconoContacto nombre="flecha" />
                </a>
              </div>
            </section>
            <section className="contacto-atencion">
              <IconoContacto nombre="mensaje" className="contacto-atencion-icono" />
              <h2>¿Prefieres escribirnos directamente?</h2>
              <p>Inicia una conversación y cuéntanos qué estás buscando.</p>
              <a className="contacto-boton contacto-boton-blanco" href={chatDirecto}
                target="_blank" rel="noopener noreferrer">Abrir WhatsApp <IconoContacto nombre="flecha" /></a>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export { Contacto };
