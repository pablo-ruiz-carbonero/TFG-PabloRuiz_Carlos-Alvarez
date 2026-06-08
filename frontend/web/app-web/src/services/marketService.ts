/// <reference types="vite/client" />
// Servicio CRUD del marketplace: gestión de productos con mapeo de categorías entre backend y frontend.
import { api } from './api';
import { dbService } from './mockDb';
import { Product, ProductCategory, UserRole } from '../types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ── Mappers ────────────────────────────────────────────────────────────────────

// Mapa bidireccional de categorías: 'Fitosanitarios' del backend se une a 'inputs' del frontend
const CAT_WEB_TO_BACK: Record<ProductCategory, string> = {
  seeds: 'Semillas',
  machinery: 'Maquinaria',
  crops: 'Otros',
  inputs: 'Fertilizantes',
};

const CAT_BACK_TO_WEB: Record<string, ProductCategory> = {
  Semillas: 'seeds',
  Maquinaria: 'machinery',
  Fertilizantes: 'inputs',
  Fitosanitarios: 'inputs',
  Otros: 'crops',
};

// Convierte un producto crudo del backend al tipo Product del frontend
function backendProductToWeb(raw: any): Product {
  return {
    id: raw.id?.toString() ?? '',
    title: raw.nombre ?? '',
    description: raw.descripcion ?? '',
    category: CAT_BACK_TO_WEB[raw.categoria] ?? 'crops',
    price: parseFloat(raw.precio) || 0,
    stock: raw.stock ?? 0,
    unit: raw.unidad ?? '',
    location: raw.provincia ?? '',
    sellerId: raw.usuario?.id?.toString() ?? '',
    sellerName: raw.usuario?.nombre ?? raw.usuario?.email ?? '',
    // El backend no devuelve el rol del vendedor en este endpoint; se asume 'farmer' como valor seguro
    sellerRole: 'farmer' as UserRole,
    createdAt: raw.fechaPublicacion?.toString() ?? '',
  };
}

function webProductToBackend(data: Omit<Product, 'id' | 'createdAt'>): Record<string, any> {
  return {
    nombre: data.title,
    descripcion: data.description,
    categoria: CAT_WEB_TO_BACK[data.category] ?? 'Otros',
    precio: data.price,
    unidad: data.unit,
    stock: data.stock,
    provincia: data.location,
  };
}

// ── Servicio ───────────────────────────────────────────────────────────────────

export const marketService = {
  getProducts: async (): Promise<Product[]> => {
    if (USE_MOCK) {
      await delay(500);
      return dbService.getProducts();
    }
    const raw = await api.get('/products');
    return (raw ?? []).map(backendProductToWeb);
  },

  addProduct: async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    if (USE_MOCK) {
      await delay(600);
      return dbService.addProduct(productData);
    }
    const raw = await api.post('/products', webProductToBackend(productData));
    return backendProductToWeb(raw);
  },

  updateProduct: async (productId: string, updated: Partial<Product>): Promise<Product> => {
    if (USE_MOCK) {
      await delay(400);
      return dbService.updateProduct(productId, updated);
    }
    const payload: Record<string, any> = {};
    if (updated.title !== undefined) payload.nombre = updated.title;
    if (updated.description !== undefined) payload.descripcion = updated.description;
    if (updated.category !== undefined) payload.categoria = CAT_WEB_TO_BACK[updated.category] ?? 'Otros';
    if (updated.price !== undefined) payload.precio = updated.price;
    if (updated.unit !== undefined) payload.unidad = updated.unit;
    if (updated.stock !== undefined) payload.stock = updated.stock;
    if (updated.location !== undefined) payload.provincia = updated.location;
    const raw = await api.patch(`/products/${productId}`, payload);
    return backendProductToWeb(raw);
  },

  deleteProduct: async (productId: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(400);
      return dbService.deleteProduct(productId);
    }
    await api.delete(`/products/${productId}`);
  },
};
