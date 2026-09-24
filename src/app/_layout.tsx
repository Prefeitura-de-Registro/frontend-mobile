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

// Guarda de rota simples: sem usuário logado -> manda pro /sign_in; logado
// tentando abrir o /sign_in de novo -> manda pra /chamados. Baseado no
// primeiro segmento da URL (nome da pasta em src/app).
function AuthGate({ children }: { children: React.ReactNode }) {
  const { usuario, carregando } = useAuth();
  const segments = useSegments();

  if (carregando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
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
