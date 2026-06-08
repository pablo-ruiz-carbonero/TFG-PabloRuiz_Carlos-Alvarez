// src/features/products/hooks/useProducts.ts
// Acceso tipado al ProductsContext. Lanza un error si se usa fuera del provider.

import { useContext } from "react";
import { ProductsContext } from "../context/ProductsContext";

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts debe usarse dentro de ProductsProvider");
  return ctx;
};