import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.warn(
    '[api] EXPO_PUBLIC_API_URL não definida. Crie um .env na raiz do projeto ' +
      '(veja .env.example) com a URL do backend.',
  );
}

export const TOKEN_STORAGE_KEY = 'auth_token';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Injeta o token salvo no SecureStore em toda requisição. Quem grava esse
// token é o AuthContext (src/contexts/AuthContext.tsx), logo após o login.
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

/**
 * Callback setado pelo AuthContext. O axios roda fora da árvore de
 * componentes, então precisa desse "canal" pra avisar o app quando um 401
 * chegar (token expirado/inválido) e derrubar a sessão local.
 */
let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(callback: (() => void) | null) {
  onUnauthorized = callback;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      onUnauthorized?.();
    }

    return Promise.reject(error);
  },
);
