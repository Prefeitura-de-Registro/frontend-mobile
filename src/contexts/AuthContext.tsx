import * as SecureStore from 'expo-secure-store';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { login as loginRequest, UsuarioLogado } from '@/services/auth.service';
import { setOnUnauthorized, TOKEN_STORAGE_KEY } from '@/services/api';

const USER_STORAGE_KEY = 'auth_user';

interface AuthContextValue {
  usuario: UsuarioLogado | null;
  carregando: boolean;
  signIn: (identificador: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  // "carregando" cobre o tempo de ler o SecureStore na abertura do app —
  // enquanto isso o AuthGate (_layout.tsx) mostra um spinner em vez de
  // decidir precocemente se manda pra /sign_in ou pra /chamados.
  const [carregando, setCarregando] = useState(true);

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY);
    await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
    setUsuario(null);
  }, []);

  // Registra o callback que o axios chama sozinho quando toma um 401
  // (ver services/api.ts) — sessão expirada/token inválido cai aqui.
  useEffect(() => {
    setOnUnauthorized(() => {
      signOut();
    });

    return () => setOnUnauthorized(null);
  }, [signOut]);

  // Ao abrir o app, tenta restaurar a sessão salva no SecureStore.
  useEffect(() => {
    (async () => {
      const [token, usuarioSalvo] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_STORAGE_KEY),
        SecureStore.getItemAsync(USER_STORAGE_KEY),
      ]);

      if (token && usuarioSalvo) {
        setUsuario(JSON.parse(usuarioSalvo));
      }

      setCarregando(false);
    })();
  }, []);

  const signIn = useCallback(async (identificador: string, senha: string) => {
    const { usuario: usuarioLogado, token } = await loginRequest(identificador, senha);

    await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, token);
    await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(usuarioLogado));

    setUsuario(usuarioLogado);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, carregando, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um <AuthProvider>');
  }

  return context;
}
