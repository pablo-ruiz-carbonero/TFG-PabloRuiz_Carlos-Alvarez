// Contexto global de autenticacion: proporciona el usuario activo y las funciones de sesion a toda la app.
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';
import { dbService } from '../services/mockDb';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, passwordHash: string) => Promise<void>;
  register: (name: string, email: string, passwordHash: string, phone: string, role: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (name: string, phone: string, password?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Al montar el proveedor, se recupera la sesion guardada y se suscribe al evento global de cierre de sesion
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('agro_token');
      const cachedUser = localStorage.getItem('agro_user');

      if (token && cachedUser) {
        try {
          // Restaurar usuario desde cache sin necesidad de una peticion al backend
          setUser(JSON.parse(cachedUser));
        } catch (e) {
          console.error('Error parsing cached user', e);
          localStorage.removeItem('agro_token');
          localStorage.removeItem('agro_user');
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Escuchar el evento 'auth_logout' que emite api.ts al recibir un 401
    const handleLogoutEvent = () => {
      logout();
    };

    window.addEventListener('auth_logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth_logout', handleLogoutEvent);
    };
  }, []);

  const login = async (email: string, passwordHash: string) => {
    setLoading(true);
    try {
      const response = await authService.login(email, passwordHash);
      setUser(response.user);
      localStorage.setItem('agro_token', response.token);
      localStorage.setItem('agro_user', JSON.stringify(response.user));
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, passwordHash: string, phone: string, role: UserRole) => {
    setLoading(true);
    try {
      const response = await authService.register(name, email, passwordHash, phone, role);
      setUser(response.user);
      localStorage.setItem('agro_token', response.token);
      localStorage.setItem('agro_user', JSON.stringify(response.user));
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agro_token');
    localStorage.removeItem('agro_user');
  };

  // Permite cambiar el rol activo en tiempo real para demostraciones del TFG sin necesidad de re-registrarse
  const switchRole = (role: UserRole) => {
    if (!user) return;

    // Se añade el rol entre paréntesis al nombre para indicar visualmente el rol activo en la demo
    const updatedUser: User = {
      ...user,
      name: `${user.name.split(' (')[0]} (${role.charAt(0).toUpperCase() + role.slice(1)})`,
      role,
    };
    setUser(updatedUser);
    localStorage.setItem('agro_user', JSON.stringify(updatedUser));

    // En modo mock también se actualiza la base de datos local para que el cambio persista
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      const db = dbService.getUsers();
      const userInDb = db.find(u => u.id === user.id);
      if (userInDb) {
        userInDb.role = role;
        const fullDb = JSON.parse(localStorage.getItem('agro_db') || '{}');
        fullDb.users = fullDb.users.map((u: any) => u.id === user.id ? { ...u, role } : u);
        localStorage.setItem('agro_db', JSON.stringify(fullDb));
      }
    }
  };

  const updateProfile = async (name: string, phone: string, password?: string) => {
    if (!user) return;
    setLoading(true);
    try {
      const updated = await authService.updateProfile(user.id, name, phone, password);
      // Si el rol de demo estaba activo (nombre con paréntesis), se conserva el formato visual
      const finalUser = {
        ...updated,
        role: user.role,
        name: user.name.includes('(') ? `${updated.name} (${user.role.charAt(0).toUpperCase() + user.role.slice(1)})` : updated.name
      };
      setUser(finalUser);
      localStorage.setItem('agro_user', JSON.stringify(finalUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, switchRole, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir el contexto de autenticacion desde cualquier componente hijo
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
