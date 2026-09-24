import { HeaderBackground } from '@/components/molecules/HeaderBackground';
import { HeaderNavigationContent } from '@/components/molecules/HeaderNavigationContent';
import { CardChamadoDetalhe } from '@/components/organisms/CardChamadoDetalhe';
import { FooterLogo } from '@/components/organisms/FooterLogo';
import { theme } from '@/constants';
import { assumirTicket, buscarTicketPorId } from '@/services/tickets.service';
import { Chamado } from '@/types/chamado';
import { mapTicketToChamado } from '@/utils/ticket-mapper';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DetalhesChamadoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Antes vinha de mockChamados.find(...); agora é carregado da API
  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [assumindo, setAssumindo] = useState(false);

  const carregarChamado = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setErro(null);

    try {
      const ticket = await buscarTicketPorId(Number(id));
      setChamado(mapTicketToChamado(ticket));
    } catch (error) {
      console.error('[detalhes_chamado] erro ao buscar ticket', error);
      setErro('Não foi possível carregar esse chamado.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    carregarChamado();
  }, [carregarChamado]);

  async function handleAtender() {
    if (!id) return;

    setAssumindo(true);

    try {
      const ticketAtualizado = await assumirTicket(Number(id));
      setChamado(mapTicketToChamado(ticketAtualizado));
    } catch (error) {
      // TODO: mostrar um toast/alerta de erro pro usuário — por exemplo,
      // o backend retorna 409 se o ticket já tiver sido assumido por outra
      // pessoa entre o momento em que a tela carregou e o clique aqui.
      console.error('[detalhes_chamado] erro ao assumir ticket', error);
    } finally {
      setAssumindo(false);
    }
  }

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
            {loading ? (
              <ActivityIndicator color={theme.colors.primary} size="large" />
            ) : erro || !chamado ? (
              <Text>{erro ?? 'Chamado não encontrado.'}</Text>
            ) : (
              <CardChamadoDetalhe
                chamado={chamado}
                onTransferir={() => {
                  // TODO: ainda não existe tela/fluxo de "transferir" no
                  // app. No backend isso é POST /api/tickets/:id/solicitacoes
                  // (precisa escolher o departamento de destino antes).
                  console.log('Transferir acionado');
                }}
                onAtender={assumindo ? undefined : handleAtender}
                onFinalizar={() => router.push(`/finalizar_atendimento?id=${chamado.id}`)}
              />
            )}
          </View>
        </View>
      </ScrollView>

      <FooterLogo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {},
  footer: {
    alignItems: 'center',
    marginTop: 28,
  },
  logo: {
    width: 150,
    height: 48,
    opacity: 0.9,
  },
})