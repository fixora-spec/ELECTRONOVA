import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Lock, Mail, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import './Login.css';

function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (contraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (contraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      await register({ nombre, correo, contraseña });
      navigate('/productos');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar la cuenta. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-pagina-split">
      <div className="login-panel-izquierdo">
        <div className="panel-izq-contenido">
          <h1>Únete a <br/><span className="text-yellow">ELECTRONOVA</span></h1>
          <p className="subtitulo-panel">
            Crea tu cuenta de usuario para explorar todo nuestro catálogo de productos y soluciones eléctricas.
          </p>
          
          <div className="divisor-amarillo"></div>

          <div className="caracteristicas-lista">
            <div className="caracteristica-item">
              <div className="icono-circulo">⚡</div>
              <div>
                <h4>Catálogo completo</h4>
                <p>Acceso a todos los productos y especificaciones técnicas.</p>
              </div>
            </div>
            
            <div className="caracteristica-item">
              <div className="icono-circulo">🛡️</div>
              <div>
                <h4>Garantía y confianza</h4>
                <p>Materiales eléctricos de primeras marcas industriales.</p>
              </div>
            </div>
            
            <div className="caracteristica-item">
              <div className="icono-circulo">💬</div>
              <div>
                <h4>Atención personalizada</h4>
                <p>Contacto directo para cotizaciones y pedidos.</p>
              </div>
            </div>
          </div>

          <div className="slogan-inferior">
            <span className="slogan-cursiva">Soluciones eléctricas<br/>para un mejor futuro</span>
          </div>
        </div>
      </div>

      <div className="login-panel-derecho">
        <div className="login-caja-blanca">
          <div className="login-header-form">
            <div className="logo-electronova-form">
               <span className="logo-foco">💡</span> ELECTRONOVA
            </div>
            <span className="logo-slogan-form">Registro de Usuario</span>
            
            <h2>Crear cuenta</h2>
          </div>
          
          {error && <div className="login-error-msg">{error}</div>}
          
          <form onSubmit={handleSubmit} className="form-login-split">
            <div className="input-group-split">
              <div className="input-wrapper">
                <User size={18} className="input-icon-left" />
                <input 
                  type="text" 
                  placeholder="Nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="input-group-split">
              <div className="input-wrapper">
                <Mail size={18} className="input-icon-left" />
                <input 
                  type="email" 
                  placeholder="Correo electrónico"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <div className="input-group-split">
              <div className="input-wrapper">
                <Lock size={18} className="input-icon-left" />
                <input 
                  type={mostrarPass ? "text" : "password"}
                  placeholder="Contraseña (mínimo 6 caracteres)"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="btn-ver-pass"
                  onClick={() => setMostrarPass(!mostrarPass)}
                >
                  {mostrarPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="input-group-split">
              <div className="input-wrapper">
                <Lock size={18} className="input-icon-left" />
                <input 
                  type={mostrarPass ? "text" : "password"}
                  placeholder="Confirmar contraseña"
                  value={confirmarContraseña}
                  onChange={(e) => setConfirmarContraseña(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn-ingresar-split" disabled={loading}>
               {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>

            <div style={{ textAlign: 'center', margin: '16px 0 8px 0', fontSize: '0.9rem', color: '#666' }}>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" style={{ color: 'var(--primary-blue, #0d284a)', fontWeight: '600', textDecoration: 'none' }}>
                Inicia sesión aquí
              </Link>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', margin: '16px 0', paddingTop: '16px', textAlign: 'center' }}>
              <Link 
                to="/productos" 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  color: '#4b5563', 
                  fontSize: '0.9rem', 
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Continuar como invitado <ArrowRight size={16} />
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export { Register };
