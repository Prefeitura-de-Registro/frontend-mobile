import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Redirect, Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { theme } from '@/constants';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

SplashScreen.preventAutoHideAsync();

// ─── GAMBIARRA DE DESENVOLVIMENTO (REMOVER ANTES DO COMMIT) ──────────────────
// BYPASS_LOGIN: pula a guarda de login e deixa abrir qualquer tela.
// DEV_ROTA_INICIAL: se preenchida, o app abre direto nessa rota (uma vez só).
//   Ex.: '/detalhes_chamado?id=1'  |  null para abrir na tela normal.
// O `__DEV__` garante que isso nunca vale em build de produção.
const BYPASS_LOGIN = __DEV__ && true;
const DEV_ROTA_INICIAL: string | null = '/detalhes_chamado?id=1';
let devRotaJaAberta = false;
// ─────────────────────────────────────────────────────────────────────────────

// Guarda de rota simples: sem usuário logado -> manda pro /sign_in; logado
// tentando abrir o /sign_in de novo -> manda pra /chamados. Baseado no
// primeiro segmento da URL (nome da pasta em src/app).
function AuthGate({ children }: { children: React.ReactNode }) {
  const { usuario, carregando } = useAuth();
  const segments = useSegments();

  if (carregando && !BYPASS_LOGIN) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  if (BYPASS_LOGIN) {
    if (DEV_ROTA_INICIAL && !devRotaJaAberta) {
      devRotaJaAberta = true;
      return <Redirect href={DEV_ROTA_INICIAL as never} />;
    }

    return <>{children}</>;
  }

  const naTelaDeLogin = segments[0] === 'sign_in';

  if (!usuario && !naTelaDeLogin) {
    return <Redirect href="/sign_in" />;
  }

  if (usuario && naTelaDeLogin) {
    return <Redirect href="/" />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthGate>
    </AuthProvider>
  );
}
