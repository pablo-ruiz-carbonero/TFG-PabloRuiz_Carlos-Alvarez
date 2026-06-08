// src/features/crops/hooks/useCrops.ts
// Acceso tipado al CropsContext. Lanza un error si se usa fuera del provider.

import { useContext } from "react";
import { CropsContext } from "../context/CropsContext";

export const useCrops = () => {
  const ctx = useContext(CropsContext);
  if (!ctx) throw new Error("useCrops debe usarse dentro de CropsProvider");
  return ctx;
};
