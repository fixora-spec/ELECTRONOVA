import { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import './Login.css';

function ForgotPassword() {
  const [correo, setCorreo] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });
    setLoading(true);

    try {
      const res = await authService.forgotPassword(correo);
      setMensaje({ tipo: 'exito', texto: res.message || 'Se ha enviado un correo con las instrucciones.' });
      setCorreo('');
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'Hubo un error al intentar enviar el correo.' });
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
            <h2>Recuperar Contraseña</h2>
            <p>Ingresa tu correo para recibir un enlace de recuperación.</p>
          </div>

          {mensaje.texto && (
            <div className={mensaje.tipo === 'error' ? 'login-error-msg' : 'login-success-msg'} style={{ 
              backgroundColor: mensaje.tipo === 'error' ? '#fee2e2' : '#dcfce7',
              color: mensaje.tipo === 'error' ? '#b91c1c' : '#15803d',
              padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.95rem'
            }}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-login-split">
            <div className="input-group-split">
              <div className="input-wrapper">
                <Mail size={18} className="input-icon-left" />
                <input 
                  type="email" 
                  placeholder="Ingresa tu correo electrónico"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn-ingresar-split" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? 'Enviando...' : <><Send size={18} /> Enviar enlace</>}
            </button>
            
            <div className="login-footer-form" style={{ marginTop: '20px' }}>
              <Link to="/login" className="link-olvido" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <ArrowLeft size={16} /> Volver a Iniciar Sesión
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export { ForgotPassword };

