import { Component } from 'react';
import './ErrorBoundary.css';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Actualiza el estado para mostrar la interfaz de reserva
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error en un servicio de reportes
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier interfaz de reserva personalizada
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <AlertTriangle className="error-icon" size={64} />
            <h1>¡Uy! Algo salió mal.</h1>
            <p>
              Ha ocurrido un error inesperado. Estamos trabajando para solucionarlo.
              Por favor, intenta recargar la página.
            </p>
            <div className="error-boundary-actions">
              <button 
                className="btn-recargar" 
                onClick={() => window.location.reload()}
              >
                Recargar página
              </button>
              <a href="/" className="btn-volver-inicio">
                Volver al inicio
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
