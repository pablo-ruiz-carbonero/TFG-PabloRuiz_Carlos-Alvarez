// src/features/auth/hooks/useAuth.ts
// Acceso tipado al AuthContext. Lanza un error si se usa fuera del provider.

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
};
