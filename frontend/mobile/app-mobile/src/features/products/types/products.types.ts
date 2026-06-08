// src/features/products/types/products.types.ts
// Modelos de dominio, enumeraciones y DTOs del marketplace de productos agrícolas.

export type ProductCategory =
  | "Semillas"
  | "Fertilizantes"
  | "Maquinaria"
  | "Fitosanitarios"
  | "Otros";

export type ProductUnit = "€/kg" | "€/u" | "€/L" | "€/ha" | "€/saco";

export interface Seller {
  id: string;
  name: string;
  initials: string;
  rating: number;
  sales: number;
  location: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: ProductUnit;
  stock: number;
  description: string;
  location: string;
  province: string;
  seller: Seller;
  images: string[];
  createdAt: string;
}

export interface CreateProductDto {
  name: string;
  category: ProductCategory;
  price: number;
  unit: ProductUnit;
  stock: number;
  description: string;
  province: string;
  images?: string[];
}

export interface UpdateProductDto {
  name?: string;
  category?: ProductCategory;
  price?: number;
  unit?: ProductUnit;
  stock?: number;
  description?: string;
  province?: string;
}
