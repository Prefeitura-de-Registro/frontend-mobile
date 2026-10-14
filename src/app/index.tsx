import { SearchInput } from '@/components/atoms/SearchInput';
import { HeaderBackground } from '@/components/molecules/HeaderBackground';
import { HeaderGreetingContent } from '@/components/molecules/HeaderGreetingContent';
import { PriorityStatCard } from '@/components/molecules/PriorityStatCard';
import { SummaryStatCard } from '@/components/molecules/SummaryStatCard';
import { FiltroBottomSheet } from '@/components/organisms/FiltroBottomSheet';
import { MapArea, PONTOS_EXEMPLO } from '@/components/organisms/MapArea';
import { theme } from '@/constants';
import { useAuth } from '@/contexts/AuthContext'; // ajuste o caminho
import { listarTickets } from '@/services/tickets.service';
import { Chamado, PrioridadeChamado, TipoOcorrencia } from '@/types/chamado';
import { mapTicketToChamado } from '@/utils/ticket-mapper';
import { useRouter } from 'expo-router';
import { SlidersHorizontal } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIORIDADE_URGENTE = 'urgente';
const PRIORIDADE_MEDIA = 'medio';
const PRIORIDADE_NORMAL = 'normal';

const COR_ABERTO = '#E02424';
const COR_CONCLUIDO = '#22C79A';

export default function HomeOperadorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();

  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [mapaExpandido, setMapaExpandido] = useState(false);
  const [busca, setBusca] = useState('');
  const [filtroVisible, setFiltroVisible] = useState(false);
  const [prioridades, setPrioridades] = useState<PrioridadeChamado[]>([]);
  const [tipos, setTipos] = useState<TipoOcorrencia[]>([]);

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

  // No Android, o botão voltar recolhe o mapa em vez de sair da tela
  useEffect(() => {
    if (!mapaExpandido) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setMapaExpandido(false);
      return true;
    });
    return () => sub.remove();
  }, [mapaExpandido]);

  const contarStatus = (status: Chamado['status']) =>
    loading ? '–' : chamados.filter((c) => c.status === status).length;
  const contarPrioridade = (prioridade: string) =>
    loading ? '–' : chamados.filter((c) => c.prioridade === prioridade).length;

  function togglePrioridade(p: PrioridadeChamado) {
    setPrioridades((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function toggleTipo(t: TipoOcorrencia) {
    setTipos((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  // TODO: trocar PONTOS_EXEMPLO pelos chamados reais quando houver coordenadas
  const pontosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return PONTOS_EXEMPLO.filter((p) => {
      const matchBusca =
        termo === '' ||
        p.titulo.toLowerCase().includes(termo) ||
        p.endereco.toLowerCase().includes(termo);
      const matchPrioridade = prioridades.length === 0 || prioridades.includes(p.prioridade);
      const matchTipo = tipos.length === 0 || (p.tipo != null && tipos.includes(p.tipo));
      return matchBusca && matchPrioridade && matchTipo;
    });
  }, [busca, prioridades, tipos]);

  return (
    <View style={styles.screen}>
      <View style={[styles.topPanel, mapaExpandido && styles.topPanelRecolhido]}>
        <View style={{ paddingTop: insets.top }}>
          <HeaderBackground height={90} backgroundColor="#FFFFFF">
            <HeaderGreetingContent
              userName="Carlos"
              role="Secretaria de Obras"
              avatarUri="https://i.pravatar.cc/100"
              onPressNotification={signOut} // TODO: temporário, trocar por navegação para notificações
            />
          </HeaderBackground>
        </View>

        {!mapaExpandido && (
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

            {erro ? <Text style={styles.erroText}>{erro}</Text> : null}
          </View>
        )}
      </View>

      <View style={styles.mapaWrapper}>
        <MapArea
          pontos={pontosFiltrados}
          expandido={mapaExpandido}
          onAlternarExpandir={() => setMapaExpandido((v) => !v)}
          onVerDetalhes={(id) => router.push(`/detalhes_chamado?id=${id}`)}
        />

        {mapaExpandido && (
          <View style={styles.searchFilterRow}>
            <View style={styles.searchWrapper}>
              <SearchInput value={busca} onChangeText={setBusca} placeholder="Pesquisar" />
            </View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFiltroVisible(true)}
              activeOpacity={0.8}
            >
              <SlidersHorizontal size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FiltroBottomSheet
        visible={filtroVisible}
        prioridadesSelecionadas={prioridades}
        tiposSelecionados={tipos}
        onTogglePrioridade={togglePrioridade}
        onToggleTipo={toggleTipo}
        onLimpar={() => {
          setPrioridades([]);
          setTipos([]);
        }}
        onAplicar={() => setFiltroVisible(false)}
        onClose={() => setFiltroVisible(false)}
      />
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
  topPanelRecolhido: {
    paddingBottom: 0,
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
  mapaWrapper: {
    flex: 1,
  },
  searchFilterRow: {
    position: 'absolute',
    top: 16,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchWrapper: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});