// Servicio de autenticación: login, registro, perfil y actualización de datos del usuario.
import { api } from './api';
import { dbService } from './mockDb';
import { User, UserRole } from '../types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ── Mappers backend → web ──────────────────────────────────────────────────────

// Traduce el nombre de rol en castellano del backend al enum interno del frontend
function mapRol(rol?: string | null): UserRole {
  const m: Record<string, UserRole> = {
    agricultor: 'farmer',
    distribuidor: 'distributor',
    proveedor: 'supplier',
    administrador: 'admin',
  };
  // Si el rol no está en el mapa, se asume 'farmer' como valor por defecto
  return m[rol?.toLowerCase() ?? ''] ?? 'farmer';
}

// Convierte la respuesta cruda del backend al tipo User del frontend
function mapBackendUser(raw: any): User {
  return {
    id: raw.id?.toString() ?? '',
    // El backend puede devolver 'nombre' o 'name' según el endpoint
    name: raw.nombre ?? raw.name ?? raw.email ?? '',
    email: raw.email ?? '',
    phone: raw.telefono ?? raw.phone ?? '',
    role: mapRol(raw.rol ?? raw.role),
  };
}

// ── Servicio ───────────────────────────────────────────────────────────────────

export const authService = {
  login: async (email: string, passwordHash: string): Promise<{ user: User; token: string }> => {
    if (USE_MOCK) {
      await delay(600);
      const res = dbService.login(email, passwordHash);
      if (!res) throw new Error('Credenciales incorrectas (Email o contraseña no válidos)');
      return res;
    }
    const raw = await api.post('/auth/login', { email, password: passwordHash });
    return { token: raw.accessToken, user: mapBackendUser(raw.user) };
  },

  register: async (
    name: string,
    email: string,
    passwordHash: string,
    phone: string,
    role: UserRole,
  ): Promise<{ user: User; token: string }> => {
    if (USE_MOCK) {
      await delay(800);
      const dbUsers = dbService.getUsers();
      if (dbUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('El correo electrónico ya está registrado');
      }
      return dbService.register(name, email, passwordHash, phone, role);
    }
    // Mapa inverso: convierte el rol interno del frontend al nombre de rol del backend
    const ROL_MAP: Record<string, string> = {
      farmer: 'agricultor',
      distributor: 'distribuidor',
      supplier: 'proveedor',
      admin: 'administrador',
    };
    const raw = await api.post('/auth/register', {
      nombre: name,
      email,
      password: passwordHash,
      telefono: phone,
      rol: ROL_MAP[role] ?? 'agricultor',
    });
    return { token: raw.accessToken, user: mapBackendUser(raw.user) };
  },

  getProfile: async (): Promise<User> => {
    if (USE_MOCK) {
      await delay(100);
      const cached = localStorage.getItem('agro_user');
      if (!cached) throw new Error('No session');
      return JSON.parse(cached);
    }
    const raw = await api.get('/auth/me');
    return mapBackendUser(raw);
  },

  updateProfile: async (
    userId: string,
    name: string,
    phone: string,
    _password?: string,
  ): Promise<User> => {
    if (USE_MOCK) {
      await delay(500);
      const fullDb = JSON.parse(localStorage.getItem('agro_db') || '{}');
      const idx = fullDb.users.findIndex((u: any) => u.id === userId);
      if (idx === -1) throw new Error('Usuario no encontrado');
      fullDb.users[idx] = { ...fullDb.users[idx], name, phone };
      localStorage.setItem('agro_db', JSON.stringify(fullDb));
      const u = fullDb.users[idx];
      return { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role };
    }
    // El DTO del backend acepta { name, phone } como alias de { nombre, telefono }
    const raw = await api.patch('/auth/profile', { name, phone });
    return mapBackendUser(raw);
  },
};
