import { HeaderBackground } from '@/components/molecules/HeaderBackground';
import { HeaderGreetingContent } from '@/components/molecules/HeaderGreetingContent';
import { SummaryStatCard } from '@/components/molecules/SummaryStatCard';
import { ChamadosList } from '@/components/organisms/ChamadosList';
import { FooterLogo } from '@/components/organisms/FooterLogo';
import { MapPreview } from '@/components/organisms/MapPreview';
import { theme } from '@/constants';
import { listarTickets } from '@/services/tickets.service';
import { Chamado } from '@/types/chamado';
import { mapTicketToChamado } from '@/utils/ticket-mapper';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeOperadorScreen() {
  const router = useRouter();
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDadosHome = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const resposta = await listarTickets({ page: 1, limit: 50 });
      setChamados(resposta.data.map(mapTicketToChamado));
    } catch (error) {
      console.error('[home] erro ao carregar tickets', error);
      setErro('Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDadosHome();
  }, [carregarDadosHome]);

  const abertos = chamados.filter((c) => c.status === 'aberto').length;
  const emAndamento = chamados.filter((c) => c.status === 'em_atendimento').length;
  const concluidos = chamados.filter((c) => c.status === 'concluido').length;
  const urgentes = chamados.filter((c) => c.prioridade === 'urgente');

  function irParaDetalhe(id: string) {
    router.push(`/detalhes_chamado?id=${id}`);
  }

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <HeaderBackground height={180}>
        <HeaderGreetingContent
          userName="Carlos"
          role="Secretaria de Obras"
          avatarUri="https://i.pravatar.cc/100"
          onPressNotification={() => {
            // TODO: navegar pra tela de notificação
          }}
        />
      </HeaderBackground>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Chamados atribuídos a você</Text>
          <TouchableOpacity onPress={() => router.push('/chamados')}>
            <Text style={styles.verTodos}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <SummaryStatCard label="Abertos" value={abertos} color="#2ECC71" />
          <SummaryStatCard label="Andamento" value={emAndamento} color={theme.colors.primary} />
          <SummaryStatCard label="Concluídos" value={concluidos} color={theme.colors.danger} />
        </View>

        <Text style={styles.sectionTitle}>Urgentes</Text>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </View>
        ) : erro ? (
          <View style={styles.centered}>
            <Text style={styles.erroText}>{erro}</Text>
          </View>
        ) : (
          <ChamadosList chamados={urgentes} onSelectChamado={irParaDetalhe} scrollEnabled={false} />
        )}

        <MapPreview
          onVerMapaCompleto={() => {
            // TODO: navegar pra tela de mapa completo
          }}
        />
      </View>

      <FooterLogo />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: '#222',
  },
  verTodos: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.primary,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  centered: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  erroText: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#777',
  },
});