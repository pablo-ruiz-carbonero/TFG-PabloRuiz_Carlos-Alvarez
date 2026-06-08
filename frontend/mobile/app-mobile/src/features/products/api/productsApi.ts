// src/features/products/api/productsApi.ts
// Capa de red para el módulo de productos del marketplace.
// Expone operaciones CRUD y la consulta de productos propios del usuario.

import { Product, CreateProductDto, UpdateProductDto } from "../types/products.types";
import { getToken } from "../../auth/utils/tokenStorage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Convierte la respuesta del backend (snake_case español) al modelo del frontend
const mapProduct = (raw: any): Product => ({
  id: raw.id.toString(),
  name: raw.nombre,
  category: raw.categoria,
  price: parseFloat(raw.precio),
  unit: raw.unidad,
  stock: raw.stock,
  description: raw.descripcion ?? "",
  location: raw.provincia ?? "",
  province: raw.provincia ?? "",
  seller: {
    id: raw.usuario?.id?.toString() ?? "",
    name: raw.usuario?.nombre ?? raw.usuario?.email ?? "Vendedor",
    initials: (() => {
      const n: string = raw.usuario?.nombre ?? raw.usuario?.email ?? "?";
      return n.split(" ").slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? "").join("") || "??";
    })(),
    rating: 0,
    sales: 0,
    location: raw.provincia ?? "",
  },
  images: Array.isArray(raw.imagenes) ? raw.imagenes : [],
  createdAt: raw.fechaPublicacion ?? "",
});

const authHeaders = async (): Promise<HeadersInit> => {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `HTTP ${res.status}`);
  }
  return res.json();
};

// ─────────────────────────────────────────────────────────────────────────────

export const getAllProductsRequest = async (): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/products`, {
    headers: await authHeaders(),
  });
  const data = await handleResponse(res);
  return data.map(mapProduct);
};

export const getProductByIdRequest = async (id: string): Promise<Product> => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    headers: await authHeaders(),
  });
  const data = await handleResponse(res);
  return mapProduct(data);
};

export const getMyProductsRequest = async (): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/products/mine`, {
    headers: await authHeaders(),
  });
  const data = await handleResponse(res);
  return data.map(mapProduct);
};

export const createProductRequest = async (
  dto: CreateProductDto
): Promise<Product> => {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({
      nombre: dto.name,
      categoria: dto.category,
      precio: dto.price,
      unidad: dto.unit,
      stock: dto.stock,
      descripcion: dto.description,
      provincia: dto.province,
      imagenes: dto.images ?? [],
    }),
  });
  const data = await handleResponse(res);
  return mapProduct(data);
};

export const updateProductRequest = async (
  id: string,
  dto: UpdateProductDto
): Promise<Product> => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: await authHeaders(),
    body: JSON.stringify({
      nombre: dto.name,
      categoria: dto.category,
      precio: dto.price,
      unidad: dto.unit,
      stock: dto.stock,
      descripcion: dto.description,
      provincia: dto.province,
    }),
  });
  const data = await handleResponse(res);
  return mapProduct(data);
};

export const deleteProductRequest = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  await handleResponse(res);
};