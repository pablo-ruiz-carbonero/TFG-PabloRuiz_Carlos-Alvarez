import React, { useEffect, useState } from 'react';
import { adminService, AdminStats, AdminUser, AdminCrop, AdminProduct } from '../services/adminService';
import {
  Users, Sprout, ShoppingBag, BarChart2, Trash2,
  ShieldCheck, RefreshCw, ChevronDown,
} from 'lucide-react';

type Tab = 'resumen' | 'usuarios' | 'cultivos' | 'productos';

const ROL_LABEL: Record<string, string> = {
  agricultor: 'Agricultor',
  distribuidor: 'Distribuidor',
  proveedor: 'Proveedor',
  administrador: 'Administrador',
};

const ROL_BADGE: Record<string, string> = {
  agricultor: 'badge-success',
  distribuidor: 'badge-info',
  proveedor: 'badge-warning',
  administrador: 'badge-danger',
};

export const Admin: React.FC = () => {
  const [tab, setTab] = useState<Tab>('resumen');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [crops, setCrops] = useState<AdminCrop[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, u, c, p] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        adminService.getAllCrops(),
        adminService.getAllProducts(),
      ]);
      setStats(s);
      setUsers(u);
      setCrops(c);
      setProducts(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRol: string) => {
    setActionLoading(userId);
    try {
      await adminService.updateUserRole(userId, newRol);
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, role: { ...u.role, nombre: newRol } } : u
      ));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;
    setActionLoading(userId);
    try {
      await adminService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    setActionLoading(productId);
    try {
      await adminService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'resumen',  label: 'Resumen',    icon: <BarChart2 size={16} /> },
    { key: 'usuarios', label: 'Usuarios',   icon: <Users size={16} /> },
    { key: 'cultivos', label: 'Cultivos',   icon: <Sprout size={16} /> },
    { key: 'productos',label: 'Marketplace',icon: <ShoppingBag size={16} /> },
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={28} style={{ color: 'var(--primary-light)' }} />
            Panel de Administración
          </h1>
          <p>Gestiona usuarios, cultivos y el marketplace de la plataforma.</p>
        </div>
        <button className="btn btn-secondary" onClick={loadAll} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={15} />
          Actualizar
        </button>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '0.6rem 1.1rem',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.9rem', fontWeight: tab === t.key ? 700 : 500,
              color: tab === t.key ? 'var(--primary-light)' : 'var(--text-muted)',
              borderBottom: tab === t.key ? '2px solid var(--primary-light)' : '2px solid transparent',
              marginBottom: '-1px',
              transition: 'color 0.15s',
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Cargando datos...</div>
      ) : (
        <>
          {/* ── RESUMEN ── */}
          {tab === 'resumen' && stats && (
            <div>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-content">
                    <span className="metric-title">Usuarios Totales</span>
                    <span className="metric-value">{stats.totalUsers}</span>
                    <span className="metric-desc">Registrados en la plataforma</span>
                  </div>
                  <div className="metric-icon-wrapper"><Users size={24} /></div>
                </div>
                <div className="metric-card">
                  <div className="metric-content">
                    <span className="metric-title">Cultivos</span>
                    <span className="metric-value">{stats.totalCrops}</span>
                    <span className="metric-desc">En toda la plataforma</span>
                  </div>
                  <div className="metric-icon-wrapper"><Sprout size={24} /></div>
                </div>
                <div className="metric-card">
                  <div className="metric-content">
                    <span className="metric-title">Productos</span>
                    <span className="metric-value">{stats.totalProducts}</span>
                    <span className="metric-desc">Anuncios en el marketplace</span>
                  </div>
                  <div className="metric-icon-wrapper accent"><ShoppingBag size={24} /></div>
                </div>
              </div>

              <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3 className="card-title"><Users size={18} /> Distribución de Usuarios por Rol</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  {stats.usersByRole.map(r => (
                    <div key={r.rol} style={{
                      flex: '1 1 150px',
                      padding: '1rem',
                      borderRadius: 'var(--radius)',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-light)' }}>{r.total}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {ROL_LABEL[r.rol] ?? r.rol}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── USUARIOS ── */}
          {tab === 'usuarios' && (
            <div className="card" style={{ overflowX: 'auto' }}>
              <h3 className="card-title"><Users size={18} /> Usuarios registrados ({users.length})</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={th}>ID</th>
                    <th style={th}>Nombre</th>
                    <th style={th}>Email</th>
                    <th style={th}>Teléfono</th>
                    <th style={th}>Rol</th>
                    <th style={th}>Registro</th>
                    <th style={th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={td}>{u.id}</td>
                      <td style={td}>{u.nombre ?? '—'}</td>
                      <td style={td}>{u.email}</td>
                      <td style={td}>{u.telefono ?? '—'}</td>
                      <td style={td}>
                        <span className={`badge ${ROL_BADGE[u.role?.nombre] ?? 'badge-info'}`}>
                          {ROL_LABEL[u.role?.nombre] ?? u.role?.nombre}
                        </span>
                      </td>
                      <td style={td}>{u.fechaCreacion ? new Date(u.fechaCreacion).toLocaleDateString('es-ES') : '—'}</td>
                      <td style={{ ...td, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <select
                            value={u.role?.nombre ?? ''}
                            onChange={e => handleRoleChange(u.id, e.target.value)}
                            disabled={actionLoading === u.id}
                            className="form-control"
                            style={{ paddingRight: '2rem', fontSize: '0.8rem', height: '32px', paddingTop: 0, paddingBottom: 0 }}
                          >
                            {adminService.ROLES.map(r => (
                              <option key={r} value={r}>{ROL_LABEL[r]}</option>
                            ))}
                          </select>
                          <ChevronDown size={12} style={{ position: 'absolute', right: '8px', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                        </div>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={actionLoading === u.id}
                          title="Eliminar usuario"
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── CULTIVOS ── */}
          {tab === 'cultivos' && (
            <div className="card" style={{ overflowX: 'auto' }}>
              <h3 className="card-title"><Sprout size={18} /> Todos los cultivos ({crops.length})</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={th}>ID</th>
                    <th style={th}>Nombre</th>
                    <th style={th}>Variedad</th>
                    <th style={th}>Superficie (ha)</th>
                    <th style={th}>Estado</th>
                    <th style={th}>Agricultor</th>
                    <th style={th}>Siembra</th>
                  </tr>
                </thead>
                <tbody>
                  {crops.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={td}>{c.id}</td>
                      <td style={td}>{c.nombre}</td>
                      <td style={td}>{c.variedad}</td>
                      <td style={td}>{Number(c.superficie).toFixed(2)}</td>
                      <td style={td}>
                        <span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                          {c.status === 'active' ? 'Activo' : c.status}
                        </span>
                      </td>
                      <td style={td}>{c.usuario?.nombre ?? c.usuario?.email ?? '—'}</td>
                      <td style={td}>{c.fecha_siembra ? new Date(c.fecha_siembra).toLocaleDateString('es-ES') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── PRODUCTOS ── */}
          {tab === 'productos' && (
            <div className="card" style={{ overflowX: 'auto' }}>
              <h3 className="card-title"><ShoppingBag size={18} /> Productos en marketplace ({products.length})</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                    <th style={th}>ID</th>
                    <th style={th}>Título</th>
                    <th style={th}>Categoría</th>
                    <th style={th}>Precio</th>
                    <th style={th}>Stock</th>
                    <th style={th}>Vendedor</th>
                    <th style={th}>Publicado</th>
                    <th style={th}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={td}>{p.id}</td>
                      <td style={td}>{p.titulo}</td>
                      <td style={td}>{p.categoria}</td>
                      <td style={td}>{Number(p.precio).toFixed(2)} €</td>
                      <td style={td}>{p.stock}</td>
                      <td style={td}>{p.usuario?.nombre ?? p.usuario?.email ?? '—'}</td>
                      <td style={td}>{p.fechaPublicacion ? new Date(p.fechaPublicacion).toLocaleDateString('es-ES') : '—'}</td>
                      <td style={td}>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteProduct(p.id)}
                          disabled={actionLoading === p.id}
                          title="Eliminar producto"
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.5rem 0.75rem',
  fontWeight: 600,
  whiteSpace: 'nowrap',
};

const td: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  verticalAlign: 'middle',
};
