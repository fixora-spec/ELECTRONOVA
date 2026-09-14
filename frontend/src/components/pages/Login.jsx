import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Lock, Mail, Settings, Folder, Image, Users, Eye, EyeOff } from 'lucide-react';
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
      await login({ correo, contraseña });
      
      if (recordarme) {
        localStorage.setItem('recordar_correo', correo);
      } else {
        localStorage.removeItem('recordar_correo');
      }

      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-pagina-split">
      <div className="login-panel-izquierdo">
        <div className="panel-izq-contenido">
          <h1>Bienvenido al<br/>sistema <span className="text-yellow">ELECTRONOVA</span></h1>
          <p className="subtitulo-panel">Accede al panel administrativo para gestionar el catálogo de productos eléctricos.</p>
          
          <div className="divisor-amarillo"></div>

          <div className="caracteristicas-lista">
            <div className="caracteristica-item">
              <div className="icono-circulo"><Settings size={20} /></div>
              <div>
                <h4>Gestiona productos</h4>
                <p>Registra, edita y actualiza tu catálogo.</p>
              </div>
            </div>
            
            <div className="caracteristica-item">
              <div className="icono-circulo"><Folder size={20} /></div>
              <div>
                <h4>Administra categorías</h4>
                <p>Organiza tus productos de forma simple.</p>
              </div>
            </div>
            
            <div className="caracteristica-item">
              <div className="icono-circulo"><Image size={20} /></div>
              <div>
                <h4>Gestiona imágenes</h4>
                <p>Mantén tu catálogo siempre actualizado.</p>
              </div>
            </div>
            
            <div className="caracteristica-item">
              <div className="icono-circulo"><Users size={20} /></div>
              <div>
                <h4>Control de usuarios</h4>
                <p>Administra el acceso al sistema.</p>
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
            <p>Accede al panel administrativo</p>
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
            </div>
            
            <button type="submit" className="btn-ingresar-split" disabled={loading}>
               {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
            

          </form>

          <div className="login-footer-form" style={{ marginTop: '1.5rem', opacity: 0.7 }}>
            Solo personal autorizado puede acceder al sistema.
          </div>
        </div>
      </div>
    </div>
  );
}

export { Login };

