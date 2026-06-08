// Servicio de administracion: estadisticas globales y gestion de usuarios, cultivos y productos de la plataforma.
import { api } from './api';

export interface AdminStats {
  totalUsers: number;
  totalCrops: number;
  totalProducts: number;
  usersByRole: { rol: string; total: string }[];
}

export interface AdminUser {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  fechaCreacion: string;
  role: { id: number; nombre: string };
}

export interface AdminCrop {
  id: number;
  nombre: string;
  variedad: string;
  superficie: number;
  status: string;
  fecha_siembra: string;
  usuario: { id: number; nombre: string; email: string };
}

export interface AdminProduct {
  id: number;
  titulo: string;
  precio: number;
  stock: number;
  categoria: string;
  fechaPublicacion: string;
  usuario: { id: number; nombre: string; email: string };
}

// Lista de roles válidos tal como los espera el backend (en castellano)
const ROLES = ['agricultor', 'distribuidor', 'proveedor', 'administrador'];

export const adminService = {
  getStats: (): Promise<AdminStats> => api.get('/admin/stats'),

  getUsers: (): Promise<AdminUser[]> => api.get('/admin/users'),

  updateUserRole: (userId: number, rol: string): Promise<AdminUser> =>
    api.patch(`/admin/users/${userId}/role`, { rol }),

  deleteUser: (userId: number): Promise<void> =>
    api.delete(`/admin/users/${userId}`),

  getAllCrops: (): Promise<AdminCrop[]> => api.get('/admin/crops'),

  getAllProducts: (): Promise<AdminProduct[]> => api.get('/admin/products'),

  deleteProduct: (productId: number): Promise<void> =>
    api.delete(`/admin/products/${productId}`),

  ROLES,
};
