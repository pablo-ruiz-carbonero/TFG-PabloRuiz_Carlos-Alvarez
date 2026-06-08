// Guarda de ruta: redirige al login si no hay sesion y al dashboard si el rol no tiene permiso.
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Mientras se restaura la sesion desde localStorage se muestra un spinner para evitar redirecciones prematuras
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg)',
        color: 'var(--primary)',
        fontSize: '1.5rem',
        fontWeight: 600,
        gap: '10px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--border)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span>Cargando AgroLink...</span>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    // Se guarda la ruta solicitada para redirigir al usuario de vuelta tras iniciar sesion
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // El usuario esta autenticado pero no tiene el rol requerido: se le lleva al dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
