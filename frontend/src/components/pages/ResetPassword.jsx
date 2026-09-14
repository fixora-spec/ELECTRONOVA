import { useState } from 'react';
import { Lock, EyeOff, Eye, Save } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import './Login.css';

function ResetPassword() {
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const id = searchParams.get('id');
  
  const [mensaje, setMensaje] = useState(() => {
    if (!token || !id) {
      return { tipo: 'error', texto: 'Enlace inválido o incompleto. Faltan parámetros de seguridad.' };
    }
    return { tipo: '', texto: '' };
  });
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    if (nuevaContrasena !== confirmarContrasena) {
      return setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden.' });
    }

    if (!token || !id) return;

    setLoading(true);
    try {
      const res = await authService.resetPassword(id, token, nuevaContrasena);
      setMensaje({ tipo: 'exito', texto: res.message || 'Contraseña actualizada correctamente.' });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'Error al actualizar. El enlace puede haber expirado.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-pagina-split" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="login-panel-derecho" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
        <div className="login-caja-blanca" style={{ width: '100%' }}>
          
          <div className="login-header-form" style={{ textAlign: 'center' }}>
            <div className="logo-electronova-form" style={{ justifyContent: 'center' }}>
               <span className="logo-foco">💡</span> ELECTRONOVA
            </div>
            <h2>Crear Nueva Contraseña</h2>
            <p>Ingresa tu nueva contraseña a continuación.</p>
          </div>

          {mensaje.texto && (
            <div className={mensaje.tipo === 'error' ? 'login-error-msg' : 'login-success-msg'} style={{ 
              backgroundColor: mensaje.tipo === 'error' ? '#fee2e2' : '#dcfce7',
              color: mensaje.tipo === 'error' ? '#b91c1c' : '#15803d',
              padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.95rem'
            }}>
              {mensaje.texto}
              {mensaje.tipo === 'exito' && <p style={{marginTop: '10px'}}>Redirigiendo al login...</p>}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-login-split">
            <div className="input-group-split">
              <div className="input-wrapper">
                <Lock size={18} className="input-icon-left" />
                <input 
                  type={mostrarPass ? "text" : "password"}
                  placeholder="Nueva contraseña"
                  value={nuevaContrasena}
                  onChange={(e) => setNuevaContrasena(e.target.value)}
                  required 
                  disabled={!token || !id || mensaje.tipo === 'exito'}
                />
                <button 
                  type="button" 
                  className="btn-ver-pass"
                  onClick={() => setMostrarPass(!mostrarPass)}
                  disabled={!token || !id || mensaje.tipo === 'exito'}
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
                  value={confirmarContrasena}
                  onChange={(e) => setConfirmarContrasena(e.target.value)}
                  required 
                  disabled={!token || !id || mensaje.tipo === 'exito'}
                />
              </div>
            </div>

            <button type="submit" className="btn-ingresar-split" disabled={loading || !token || !id || mensaje.tipo === 'exito'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? 'Guardando...' : <><Save size={18} /> Guardar Contraseña</>}
            </button>
            
            <div className="login-footer-form" style={{ marginTop: '20px' }}>
              <Link to="/login" className="link-olvido">Ir al inicio de sesión</Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export { ResetPassword };

