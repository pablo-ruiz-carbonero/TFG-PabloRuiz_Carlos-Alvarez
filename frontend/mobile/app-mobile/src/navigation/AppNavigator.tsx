// src/navigation/AppNavigator.tsx
// Raíz de la navegación: muestra AuthStack si el usuario no está autenticado
// o MainStack si ya hay una sesión activa. Muestra un spinner durante la carga inicial.

import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../features/auth/hooks/useAuth";
import AuthStack from "./AuthStack";
import MainStack from "./MainStack";

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <MainStack /> : <AuthStack />;
};

export default AppNavigator;