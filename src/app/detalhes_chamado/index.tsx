import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeaderBackground } from '@/components/molecules/HeaderBackground';
import { HeaderNavigationContent } from '@/components/molecules/HeaderNavigationContent';
import { CardChamadoDetalhe } from '@/components/organisms/CardChamadoDetalhe';
import { FooterLogo } from '@/components/organisms/FooterLogo';
import { mockChamados } from '@/data/mockChamados'; // Importa o mock oficial

import { styles } from './style';

export default function DetalhesChamadoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const chamadoAtual = mockChamados.find((c) => c.id === id) || mockChamados[0];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <HeaderBackground>
          <View style={{ paddingBottom: 24 }}>
            <HeaderNavigationContent
              title={'Detalhes do\nChamado'}
              onPressBack={() => router.back()}
            />
          </View>
        </HeaderBackground>

        <View style={styles.contentContainer}>
          <View style={styles.cardWrapper}>
            <CardChamadoDetalhe
              chamado={chamadoAtual}
              onTransferir={() => console.log('Transferir acionado')}
              onAtender={() => console.log('Atender acionado')}
              onFinalizar={() => router.push(`/finalizar_atendimento?id=${chamadoAtual.id}`)}
            />
          </View>
        </View>
      </ScrollView>

      <FooterLogo />
    </View>
  );
}