import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FolderTree, PackageSearch, PlusCircle, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productosService } from '../../services/productos.service';
import { categoriasService } from '../../services/categorias.service';
import './DashboardAdmin.css'; // Crearemos este archivo para los estilos premium

function DashboardAdmin() {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ categorias: '--', productos: '--' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cats, prods] = await Promise.all([
          categoriasService.getAll(),
          productosService.getAll()
        ]);
        setStats({
          categorias: cats.length,
          productos: prods.length
        });
      } catch (error) {
        console.error("Error al cargar estadísticas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-admin-container">
      <div className="dashboard-header">
        <div>
          <h1>Panel de Administración</h1>
          <p>Bienvenido de nuevo, <strong>{admin?.nombre || 'Administrador'}</strong>. Aquí tienes un resumen de tu tienda.</p>
        </div>
        <div className="header-icon">
          <LayoutDashboard size={40} opacity={0.2} />
        </div>
      </div>
      
      <div className="dashboard-stats-grid">
        <div className="stat-card-premium card-blue" onClick={() => navigate('/admin/categorias')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-content">
            <div className="stat-info-premium">
              <h3>{loading ? '...' : stats.categorias}</h3>
              <p>Categorías Registradas</p>
            </div>
            <div className="stat-icon-premium">
              <FolderTree size={36} />
            </div>
          </div>
          <div className="stat-card-bg-icon"><FolderTree size={120} /></div>
        </div>

        <div className="stat-card-premium card-orange" onClick={() => navigate('/admin/productos')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-content">
            <div className="stat-info-premium">
              <h3>{loading ? '...' : stats.productos}</h3>
              <p>Productos en Catálogo</p>
            </div>
            <div className="stat-icon-premium">
              <PackageSearch size={36} />
            </div>
          </div>
          <div className="stat-card-bg-icon"><PackageSearch size={120} /></div>
        </div>
      </div>
      
      <div className="dashboard-quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <button onClick={() => navigate('/admin/productos')} className="btn-action btn-primary-action">
            <PlusCircle size={20} />
            <span>Gestionar Productos</span>
          </button>
          <button onClick={() => navigate('/admin/categorias')} className="btn-action btn-secondary-action">
            <FolderTree size={20} />
            <span>Gestionar Categorías</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export { DashboardAdmin };

