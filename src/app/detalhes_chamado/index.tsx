import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeaderBackground } from '@/components/molecules/HeaderBackground';
import { HeaderNavigationContent } from '@/components/molecules/HeaderNavigationContent';
import { CardChamadoDetalhe } from '@/components/organisms/CardChamadoDetalhe';
import { FooterLogo } from '@/components/organisms/FooterLogo';
import { Chamado } from '@/types/chamado';

import { styles } from './style';

export default function DetalhesChamadoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const chamadoMock: Chamado = {
    id: '2026-00001',
    titulo: 'Buraco',
    tipo: 'buraco',
    criadoEm: '28/08/2026',
    status: 'em_atendimento',
    descricao:
      'Há um buraco de grande porte na via, dificultando a passagem de veículos e oferecendo risco aos motoristas.',
    fotos: ['imagem1.jpg', 'imagem2.jpg'],
    endereco: 'Rua das Flores, 123',
    prioridade: 'urgente',
    slaLabel: '48h',
  };

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
              chamado={chamadoMock}
              onTransferir={() => console.log('Transferir acionado')}
              onAtender={() => console.log('Atender acionado')}
              onFinalizar={() => console.log('Finalizar acionado')}
            />
          </View>
        </View>
      </ScrollView>

      <FooterLogo />
    </View>
  );
}
