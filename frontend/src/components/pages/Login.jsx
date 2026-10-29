import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Lock, Mail, Settings, Folder, Users, Eye, EyeOff, ArrowRight } from 'lucide-react';
import './Login.css';

function Login() {
  const [correo, setCorreo] = useState(() => localStorage.getItem('recordar_correo') || '');
  const [contraseña, setContraseña] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [recordarme, setRecordarme] = useState(() => !!localStorage.getItem('recordar_correo'));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login({ correo, contraseña, recordarme });
      
      if (recordarme) {
        localStorage.setItem('recordar_correo', correo);
      } else {
        localStorage.removeItem('recordar_correo');
      }

      // Si es administrador va a su panel, si es usuario común va al catálogo de productos
      const esAdmin = data.user?.rol === 'admin' || data.admin;
      if (esAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/productos');
      }
    } catch (err) {
      const issueMsg = err.response?.data?.issues?.[0]?.message;
      setError(issueMsg || err.response?.data?.message || err.message || 'Credenciales incorrectas. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-pagina-split">
      <div className="login-panel-izquierdo">
        <div className="panel-izq-contenido">
          <h1>Bienvenido a <br/><span className="text-yellow">ELECTRONOVA</span></h1>
          <p className="subtitulo-panel">Catálogo de productos y equipamiento eléctrico industrial y domiciliario.</p>
          
          <div className="divisor-amarillo"></div>

          <div className="caracteristicas-lista">
            <div className="caracteristica-item">
              <div className="icono-circulo"><Settings size={20} /></div>
              <div>
                <h4>Gestión integral</h4>
                <p>Acceso seguro para administración de catálogo y stock.</p>
              </div>
            </div>
            
            <div className="caracteristica-item">
              <div className="icono-circulo"><Folder size={20} /></div>
              <div>
                <h4>Categorías organizadas</h4>
                <p>Equipos, cables, luminarias y componentes industriales.</p>
              </div>
            </div>
            
            <div className="caracteristica-item">
              <div className="icono-circulo"><Users size={20} /></div>
              <div>
                <h4>Control de accesos</h4>
                <p>Separación de roles para clientes y administradores.</p>
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
            <span className="logo-slogan-form">Catálogo de Productos Eléctricos</span>
            
            <h2>Iniciar sesión</h2>
          </div>
          
          {error && <div className="login-error-msg">{error}</div>}
          
          <form onSubmit={handleSubmit} className="form-login-split">
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
                  placeholder="Contraseña"
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
            
            <div className="form-options">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                />
                <span className="checkmark"></span>
                Recordarme
              </label>

              <Link to="/forgot-password" className="link-olvido">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            
            <button type="submit" className="btn-ingresar-split" disabled={loading}>
               {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: '#666' }}>
              ¿No tienes cuenta?{' '}
              <Link to="/registro" style={{ color: 'var(--primary-blue, #0d284a)', fontWeight: '600', textDecoration: 'none' }}>
                Regístrate
              </Link>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '16px', paddingTop: '16px', textAlign: 'center' }}>
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

export { Login };
