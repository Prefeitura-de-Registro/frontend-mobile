import { HeaderBackground } from '@/components/molecules/HeaderBackground';
import { HeaderGreetingContent } from '@/components/molecules/HeaderGreetingContent';
import { PriorityStatCard } from '@/components/molecules/PriorityStatCard';
import { SummaryStatCard } from '@/components/molecules/SummaryStatCard';
import { ChamadosList } from '@/components/organisms/ChamadosList';
import { FooterLogo } from '@/components/organisms/FooterLogo';
import { MapPreview } from '@/components/organisms/MapPreview';
import SplashScreen from '@/components/organisms/SplashScreen';
import { MapArea } from '@/components/organisms/MapArea';
import { theme } from '@/constants';
import { listarTickets } from '@/services/tickets.service';
import { Chamado } from '@/types/chamado';
import { mapTicketToChamado } from '@/utils/ticket-mapper';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Confira se esses valores batem com o tipo PrioridadeChamado do seu projeto.
const PRIORIDADE_URGENTE = 'urgente';
const PRIORIDADE_MEDIA = 'media';
const PRIORIDADE_NORMAL = 'normal';

const COR_ABERTO = '#E02424';
const COR_CONCLUIDO = '#22C79A';

export default function HomeOperadorScreen() {
  const router = useRouter();  
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const insets = useSafeAreaInsets();
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function carregarDadosHome() {
      try {
        const resposta = await listarTickets({ page: 1, limit: 50 });
        if (isMounted) {
          setChamados(resposta.data.map(mapTicketToChamado));
        }
      } catch (error) {
        console.error('[home] erro ao carregar tickets', error);
        if (isMounted) {
          setErro('Não foi possível carregar os dados.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    carregarDadosHome();

    return () => {
      isMounted = false;
    };
  }, []);

  const contarStatus = (status: Chamado['status']) =>
    loading ? '–' : chamados.filter((c) => c.status === status).length;
  const contarPrioridade = (prioridade: string) =>
    loading ? '–' : chamados.filter((c) => c.prioridade === prioridade).length;

  if (isSplashVisible) {
    return (
      <SplashScreen 
        onFinish={() => setIsSplashVisible(false)} 
      />
    );
  }

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <HeaderBackground height={180}>
        <HeaderGreetingContent
          userName="Carlos"
          role="Secretaria de Obras"
          avatarUri="https://i.pravatar.cc/100"
          onPressNotification={() => {
      
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

        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chamados atribuídos a você</Text>
            <TouchableOpacity
              style={styles.verTodosButton}
              onPress={() => router.push('/chamados')}
              activeOpacity={0.8}
            >
              <Text style={styles.verTodosText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <SummaryStatCard label="Abertos" value={contarStatus('aberto')} color={COR_ABERTO} />
            <SummaryStatCard
              label="Andamento"
              value={contarStatus('em_atendimento')}
              color={theme.colors.primary}
            />
            <SummaryStatCard label="Concluídos" value={contarStatus('concluido')} color={COR_CONCLUIDO} />
          </View>

          <View style={styles.row}>
            <PriorityStatCard
              label="Urgentes"
              value={contarPrioridade(PRIORIDADE_URGENTE)}
              color="#E02424"
              backgroundColor="#FDE2E2"
            />
            <PriorityStatCard
              label="Médio"
              value={contarPrioridade(PRIORIDADE_MEDIA)}
              color="#F5B800"
              backgroundColor="#FFF6D6"
            />
            <PriorityStatCard
              label="Normal"
              value={contarPrioridade(PRIORIDADE_NORMAL)}
              color="#1FB6D6"
              backgroundColor="#DDF6FB"
            />
          </View>

        <MapPreview
          onVerMapaCompleto={() => {
            
          }}
        />
      </View>

      <MapArea />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topPanel: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 16,
    zIndex: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    paddingHorizontal: 20,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 17,
    color: theme.colors.primary,
  },
  verTodosButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  verTodosText: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  erroText: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: '#777',
  },
});
