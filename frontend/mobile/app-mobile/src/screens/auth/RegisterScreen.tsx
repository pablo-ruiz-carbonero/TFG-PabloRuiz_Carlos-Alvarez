// src/screens/auth/RegisterScreen.tsx

import React, { JSX, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  Animated,
  ImageBackground,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import loginBg from "../../../assets/login-bg.webp";
import Divider from "../../components/Divider";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useAuthForm } from "../../features/auth/hooks/useAuthForm";
import { RootStackParamList } from "../../types/navigation";
import { colors, shared } from "../../styles/Globaltheme";
import { styles } from "../../styles/auth/register.styles";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Register">;

export default function RegisterScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp>();

  const { register } = useAuth();
  const { loading, error, execute } = useAuthForm();

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<"agricultor" | "distribuidor" | "proveedor">("agricultor");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (error) Alert.alert("Error al registrarse", error);
  }, [error]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleRegister = () => {
    if (!nombre || !email || !password) {
      Alert.alert(
        "Campos incompletos",
        "Nombre, email y contraseña son obligatorios",
      );
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Email inválido", "Introduce un email válido");
      return;
    }

    execute(async () => {
      // FIX: se pasan "nombre" y "telefono" (campos que espera el backend)
      await register({
        email,
        password,
        nombre,
        telefono: telefono || undefined,
        rol,
      });
      // Si el registro tiene éxito, AuthContext setea el user y
      // AppNavigator redirige automáticamente a MainStack.
    });
  };

  return (
    <ImageBackground
      source={loginBg}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.card,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={shared.title}>🌱 Agro Link</Text>
            <Text style={shared.subtitle}>Crear cuenta</Text>

            <TextInput
              style={shared.input}
              placeholder="Nombre completo"
              placeholderTextColor={colors.textMuted}
              onChangeText={setNombre}
              value={nombre}
            />

            <TextInput
              style={shared.input}
              placeholder="Teléfono (opcional)"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              maxLength={15}
              value={telefono}
              onChangeText={(v) =>
                setTelefono(v.replace(/[^0-9+\s\-]/g, ""))
              }
            />

            <TextInput
              style={shared.input}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
            />

            <TextInput
              style={shared.input}
              placeholder="Contraseña"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />

            {/* Selector de rol */}
            <Text style={[shared.subtitle, { fontSize: 13, marginBottom: 4 }]}>
              Tipo de usuario
            </Text>
            <View style={rolStyles.group}>
              {(["agricultor", "distribuidor", "proveedor"] as const).map((r) => (
                <Pressable
                  key={r}
                  style={[rolStyles.btn, rol === r && rolStyles.btnActive]}
                  onPress={() => setRol(r)}
                >
                  <Text style={[rolStyles.btnText, rol === r && rolStyles.btnTextActive]}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handleRegister}
              disabled={loading}
              style={({ pressed }) => [
                shared.btnPrimary,
                {
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                  opacity: loading ? 0.7 : 1,
                },
              ]}
            >
              <Text style={shared.btnPrimaryText}>
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </Text>
            </Pressable>

            <Divider />

            <Pressable
              onPress={() => navigation.navigate("Login")}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text style={styles.bottomText}>
                ¿Ya tienes cuenta?{" "}
                <Text style={styles.linkText}>Inicia sesión aquí</Text>
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const rolStyles = StyleSheet.create({
  group: { flexDirection: "row", gap: 8, marginBottom: 4 },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  btnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  btnText: { fontSize: 13, color: colors.textMuted, fontWeight: "600" },
  btnTextActive: { color: colors.white },
});
