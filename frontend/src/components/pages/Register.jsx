// Registro de usuarios
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Lock, Mail, User, Eye, EyeOff, ShieldCheck, Zap, HeadphonesIcon, CheckCircle2 } from 'lucide-react';
import './Login.css';

function Register() {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [mostrarConfirmPass, setMostrarConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  // Formato y validaciones
  const capitalizarPalabras = (texto) => {
    return texto
      .replace(/^\s+/, '')
      .replace(/\s{2,}/g, ' ')
      .replace(
        /(^|\s)([a-záéíóúñüA-ZÁÉÍÓÚÑÜ])([a-záéíóúñüA-ZÁÉÍÓÚÑÜ]*)/g,
        (_, espacio, primera, resto) => `${espacio}${primera.toUpperCase()}${resto.toLowerCase()}`
      );
  };

  const correoLimpio = correo.trim().toLowerCase();
  const formatoCorreoValido = /^[^\s@]{2,}@[^\s@]+\.[a-zA-Z]{2,}$/.test(correoLimpio);
  const esCorreoTemporal = /@(olipii\.com|mailinator\.com|tempmail\.com|temp-mail\.org|10minutemail\.com|yopmail\.com|guerrillamail\.com|trashmail\.com)$/i.test(correoLimpio);
  const correoValido = formatoCorreoValido && !esCorreoTemporal;
  const tieneMinLongitud = contraseña.length >= 6 && contraseña.length <= 30;
  const tieneLetra = /[a-zA-Z]/.test(contraseña);
  const tieneNumero = /[0-9]/.test(contraseña);
  const soloAlfanumerica = /^[a-zA-Z0-9]+$/.test(contraseña);
  const contraseñasCoinciden = confirmarContraseña.length > 0 && contraseña === confirmarContraseña;

  // Envío de registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (nombres.trim().length < 2 || apellidos.trim().length < 2) {
      setError('Los nombres y apellidos deben tener al menos 2 caracteres.');
      return;
    }

    if (!correoValido) {
      if (!formatoCorreoValido) {
        setError('Ingresa un correo electrónico válido (ejemplo: usuario@gmail.com).');
      } else if (esCorreoTemporal) {
        setError('No se permiten correos temporales o desechables. Ingresa un correo real.');
      } else {
        setError('El correo electrónico no es válido.');
      }
      return;
    }

    if (contraseña.length < 6 || contraseña.length > 30) {
      setError('La contraseña debe tener entre 6 y 30 caracteres.');
      return;
    }

    if (!soloAlfanumerica) {
      setError('La contraseña debe ser alfanumérica (solo letras y números, sin espacios ni símbolos).');
      return;
    }

    if (!tieneLetra || !tieneNumero) {
      setError('La contraseña debe contener letras y al menos un número.');
      return;
    }

    if (contraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const nombresFormateados = capitalizarPalabras(nombres).trim();
      const apellidosFormateados = capitalizarPalabras(apellidos).trim();
      const nombreCompleto = `${nombresFormateados} ${apellidosFormateados}`.trim();
      await register({
        nombres: nombresFormateados,
        apellidos: apellidosFormateados,
        firstname: nombresFormateados,
        lastname: apellidosFormateados,
        nombre: nombreCompleto,
        correo,
        contraseña,
        rePassword: confirmarContraseña,
        confirmarContraseña,
      });
      navigate('/productos');
    } catch (err) {
      const issueMsg = err.response?.data?.issues?.[0]?.message;
      setError(issueMsg || err.response?.data?.message || err.message || 'Error al registrar la cuenta. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-pagina-split">
      {/* Panel informativo */}
      <div className="login-panel-izquierdo">
        <div className="panel-izq-contenido">
          <h1>Únete a <br /><span className="text-yellow">ELECTRONOVA</span></h1>
          <p className="subtitulo-panel">
            Crea tu cuenta corporativa o personal para explorar todo nuestro catálogo de productos y soluciones eléctricas.
          </p>

          <div className="divisor-amarillo"></div>

          <div className="caracteristicas-lista">
            <div className="caracteristica-item">
              <div className="icono-circulo"><Zap size={20} /></div>
              <div>
                <h4>Catálogo completo</h4>
                <p>Acceso a todos los productos y especificaciones técnicas.</p>
              </div>
            </div>

            <div className="caracteristica-item">
              <div className="icono-circulo"><ShieldCheck size={20} /></div>
              <div>
                <h4>Garantía y confianza</h4>
                <p>Materiales eléctricos de primeras marcas industriales.</p>
              </div>
            </div>

            <div className="caracteristica-item">
              <div className="icono-circulo"><HeadphonesIcon size={20} /></div>
              <div>
                <h4>Atención personalizada</h4>
                <p>Contacto directo para cotizaciones y pedidos.</p>
              </div>
            </div>
          </div>

          <div className="slogan-inferior">
            <span className="slogan-cursiva">Soluciones eléctricas<br />para un mejor futuro</span>
          </div>
        </div>
      </div>

      {/* Formulario de registro */}
      <div className="login-panel-derecho">
        <div className="login-caja-blanca register-card-pro">
          <div className="register-card-accent"></div>

          <div className="login-header-form register-header-pro">
            <div className="register-brand-badge">
              <span className="logo-foco">💡</span>
              <span className="brand-text">ELECTRONOVA</span>
            </div>
            <span className="register-pill-subtitle">Registro de Cliente</span>

            <h2>Crear cuenta nueva</h2>
            <p className="register-header-desc">
              Completa tus datos personales para registrarte en la plataforma
            </p>
          </div>

          <div className="login-error-slot">
            {error && <div className="login-error-msg">{error}</div>}
          </div>

          <form onSubmit={handleSubmit} className="form-login-split register-form-pro">
            <div className="register-row-grid">
              <div className="input-group-split">
                <label className="register-label">Nombres <span className="req-dot">*</span></label>
                <div className="input-wrapper">
                  <User size={17} className="input-icon-left" />
                  <input
                    type="text"
                    placeholder="Nombres"
                    value={nombres}
                    onChange={(e) => setNombres(capitalizarPalabras(e.target.value))}
                    onBlur={() => setNombres((prev) => capitalizarPalabras(prev).trim())}
                    required
                  />
                </div>
              </div>

              <div className="input-group-split">
                <label className="register-label">Apellidos <span className="req-dot">*</span></label>
                <div className="input-wrapper">
                  <User size={17} className="input-icon-left" />
                  <input
                    type="text"
                    placeholder="Apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(capitalizarPalabras(e.target.value))}
                    onBlur={() => setApellidos((prev) => capitalizarPalabras(prev).trim())}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="input-group-split">
              <label className="register-label">Correo electrónico <span className="req-dot">*</span></label>
              <div className="input-wrapper">
                <Mail size={17} className="input-icon-left" />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="register-row-grid">
              <div className="input-group-split">
                <label className="register-label">Contraseña <span className="req-dot">*</span></label>
                <div className="input-wrapper">
                  <Lock size={17} className="input-icon-left" />
                  <input
                    type={mostrarPass ? 'text' : 'password'}
                    placeholder="Contraseña"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn-ver-pass"
                    onClick={() => setMostrarPass(!mostrarPass)}
                    tabIndex={-1}
                  >
                    {mostrarPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="input-group-split">
                <label className="register-label">Confirmar contraseña <span className="req-dot">*</span></label>
                <div className="input-wrapper">
                  <Lock size={17} className="input-icon-left" />
                  <input
                    type={mostrarConfirmPass ? 'text' : 'password'}
                    placeholder="Confirmar contraseña"
                    value={confirmarContraseña}
                    onChange={(e) => setConfirmarContraseña(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn-ver-pass"
                    onClick={() => setMostrarConfirmPass(!mostrarConfirmPass)}
                    tabIndex={-1}
                  >
                    {mostrarConfirmPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="password-criteria-box">
              <div className={`criteria-item ${tieneMinLongitud ? 'valid' : ''}`}>
                <CheckCircle2 size={14} />
                <span>Mín. 6 caracteres</span>
              </div>
              <div className={`criteria-item ${tieneLetra && tieneNumero && soloAlfanumerica ? 'valid' : contraseña.length > 0 && !soloAlfanumerica ? 'invalid' : ''}`}>
                <CheckCircle2 size={14} />
                <span>Letras y números</span>
              </div>
              <div className={`criteria-item ${confirmarContraseña.length === 0 ? '' : contraseñasCoinciden ? 'valid' : 'invalid'}`}>
                <CheckCircle2 size={14} />
                <span>
                  {confirmarContraseña.length === 0
                    ? 'Confirmación igual'
                    : contraseñasCoinciden
                      ? 'Contraseñas coinciden'
                      : 'No coinciden'}
                </span>
              </div>
            </div>

            <button type="submit" className="btn-ingresar-split btn-register-pro" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>

            <div className="register-login-redirect">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login">
                Inicia sesión aquí
              </Link>
            </div>

            <div className="register-guest-divider">
              <Link to="/productos" className="register-guest-link">
                Continuar como invitado
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export { Register };
