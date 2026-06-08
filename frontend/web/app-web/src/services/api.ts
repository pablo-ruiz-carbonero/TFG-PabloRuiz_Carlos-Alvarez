// Cliente HTTP centralizado que añade el token JWT a cada petición y gestiona errores globales.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  data?: any;
}

// Función interna que construye y ejecuta cada petición HTTP
async function request(endpoint: string, { method, data, headers, ...customOptions }: RequestOptions = {}) {
  // Leer el token en cada llamada para reflejar cambios de sesión en caliente
  const token = localStorage.getItem('agro_token');

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    // Si no se especifica método, se infiere: POST cuando hay body, GET en caso contrario
    method: method || (data ? 'POST' : 'GET'),
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...customOptions,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  // Normalizar la URL eliminando barras duplicadas entre BASE_URL y el endpoint
  const url = `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  try {
    const response = await fetch(url, config);

    // Cierre de sesión global ante token expirado o inválido
    if (response.status === 401) {
      localStorage.removeItem('agro_token');
      localStorage.removeItem('agro_user');
      window.dispatchEvent(new Event('auth_logout'));
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error de red: ${response.status}`);
    }

    // Return empty if 204
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API Error on ${url}:`, error);
    throw error;
  }
}

export const api = {
  get: (endpoint: string, options?: RequestOptions) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, data?: any, options?: RequestOptions) => request(endpoint, { ...options, data, method: 'POST' }),
  put: (endpoint: string, data?: any, options?: RequestOptions) => request(endpoint, { ...options, data, method: 'PUT' }),
  patch: (endpoint: string, data?: any, options?: RequestOptions) => request(endpoint, { ...options, data, method: 'PATCH' }),
  delete: (endpoint: string, options?: RequestOptions) => request(endpoint, { ...options, method: 'DELETE' }),
};
