import { SearchInput } from '@/components/atoms/SearchInput';
import { HeaderNavigationContent } from '@/components/molecules/HeaderNavigationContent';
import { FiltroBottomSheet } from '@/components/organisms/FiltroBottomSheet';
import { theme } from '@/constants';
import { useRouter } from 'expo-router';
import { AlertTriangle, CalendarDays, Inbox, SlidersHorizontal } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Integração com a API Real e Utils
import { listarSolicitacoes, listarTickets } from '@/services/tickets.service';
import { PrioridadeChamado, TipoOcorrencia } from '@/types/chamado';
import { inferirTipoOcorrencia } from '@/utils/ticket-mapper';

type Aba = 'enviadas' | 'recebidas';
type Status = 'nova' | 'pendente' | 'em_analise' | 'em_atendimento' | 'aprovada' | 'respondida' | 'recusada';

type Solicitacao = {
  id: string;
  ticketId?: string; // ID do ticket pai, necessário para a tela de detalhes
  titulo: string;
  protocolo: string;
  data: string;
  status: Status;
  prioridade?: PrioridadeChamado;
  tipo?: TipoOcorrencia;
};

// Mock das Recebidas expandido (Enquanto o backend não cria uma rota global de recebidas)
const RECEBIDAS_MOCK: Solicitacao[] = [
  { id: '4', titulo: 'Iluminação Pública (Mock)', protocolo: '#2026-00005', data: '28/09/2026', status: 'nova' },
  { id: '5', titulo: 'Poda de Árvore', protocolo: '#2026-00012', data: '10/10/2026', status: 'em_analise' },
  { id: '6', titulo: 'Manutenção de Via', protocolo: '#2026-00015', data: '12/10/2026', status: 'pendente' },
  { id: '7', titulo: 'Reparo em Bueiro', protocolo: '#2026-00020', data: '12/10/2026', status: 'aprovada' }
];

const STATUS_MAP: Record<string, { label: string; bg: string; dot: string; text: string }> = {
  nova: { label: 'nova solicitação', bg: '#B9E6FE', dot: theme.colors.primary, text: theme.colors.primary },
  pendente: { label: 'pendente', bg: '#B9E6FE', dot: theme.colors.primary, text: theme.colors.primary },
  em_analise: { label: 'em análise', bg: '#B9E6FE', dot: theme.colors.primary, text: theme.colors.primary },
  em_atendimento: { label: 'em atendimento', bg: '#B9E6FE', dot: theme.colors.primary, text: theme.colors.primary },
  aprovada: { label: 'aprovada', bg: '#D1FAE5', dot: '#22C997', text: '#16A37A' },
  respondida: { label: 'respondida', bg: '#D1FAE5', dot: '#22C997', text: '#16A37A' },
  recusada: { label: 'recusada', bg: '#FCB5B5', dot: theme.colors.danger, text: theme.colors.danger },
};

export default function SolicitacoesScreen() {
  const router = useRouter();
  const [aba, setAba] = useState<Aba>('enviadas');
  const [searchQuery, setSearchQuery] = useState('');
  const [enviadas, setEnviadas] = useState<Solicitacao[]>([]);
  // Comeca true porque a aba inicial (enviadas) busca os dados assim que a tela abre
  const [loading, setLoading] = useState(true);

  // Estados do Filtro
  const [filtroVisible, setFiltroVisible] = useState(false);
  const [prioridades, setPrioridades] = useState<PrioridadeChamado[]>([]);
  const [tipos, setTipos] = useState<TipoOcorrencia[]>([]);

  function togglePrioridade(p: PrioridadeChamado) {
    setPrioridades((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function toggleTipo(t: TipoOcorrencia) {
    setTipos((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  useEffect(() => {
    if (aba !== 'enviadas') return;

    let cancelado = false;

    // A busca fica dentro do effect: os setState rodam depois dos await,
    // entao nao disparam a regra react-hooks/set-state-in-effect
    async function carregarEnviadas() {
      try {
        const ticketsData = await listarTickets({ limit: 50 });

        if (!ticketsData.data || ticketsData.data.length === 0) {
          if (!cancelado) setEnviadas([]);
          return;
        }

        const promessas = ticketsData.data.map(async (ticket) => {
          const solicitacoes = await listarSolicitacoes(ticket.id);

          return solicitacoes.map((s: any) => ({
            id: String(s.id),
            ticketId: String(ticket.id),
            titulo: ticket.categoria?.nome || `Ticket #${ticket.id}`,
            protocolo: `TKT-${ticket.id}`,
            data: new Date(s.createdAt).toLocaleDateString('pt-BR'),
            status: s.status,
            prioridade: ticket.prioridade,
            tipo: ticket.categoria?.nome ? inferirTipoOcorrencia(ticket.categoria.nome) : 'buraco',
          }));
        });

        const arraysDeSolicitacoes = await Promise.all(promessas);
        if (!cancelado) setEnviadas(arraysDeSolicitacoes.flat());
      } catch (error) {
        console.error('Erro ao buscar solicitações enviadas:', error);
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    carregarEnviadas();

    return () => {
      cancelado = true;
    };
  }, [aba]);

  const listaBase = aba === 'enviadas' ? enviadas : RECEBIDAS_MOCK;
  const chamadosFiltrados = listaBase.filter((c) => {
    const matchSearch = c.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || c.protocolo.includes(searchQuery);
    const matchPrioridade = prioridades.length === 0 || (c.prioridade && prioridades.includes(c.prioridade));
    const matchTipo = tipos.length === 0 || (c.tipo && tipos.includes(c.tipo));
    
    return matchSearch && matchPrioridade && matchTipo;
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerTopContainer}>
        <HeaderNavigationContent title="Solicitações" onPressBack={() => router.back()} />
        
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, aba === 'enviadas' && styles.tabActive]}
            onPress={() => setAba('enviadas')}
            activeOpacity={0.8}
          >
            <AlertTriangle size={20} color={aba === 'enviadas' ? '#FFFFFF' : theme.colors.primary} />
            <Text style={[styles.tabText, aba === 'enviadas' && styles.tabTextActive]}>Enviadas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, aba === 'recebidas' && styles.tabActive]}
            onPress={() => setAba('recebidas')}
            activeOpacity={0.8}
          >
            <Inbox size={20} color={aba === 'recebidas' ? '#FFFFFF' : theme.colors.primary} />
            <Text style={[styles.tabText, aba === 'recebidas' && styles.tabTextActive]}>Recebidas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchFilterRow}>
          <View style={styles.searchWrapper}>
            <SearchInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Pesquisar" />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFiltroVisible(true)}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {aba === 'enviadas' && loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={chamadosFiltrados}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
                Nenhuma solicitação encontrada.
              </Text>
            }
            renderItem={({ item }) => {
              const s = STATUS_MAP[item.status] || STATUS_MAP['nova'];
              return (
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({ 
                      pathname: './solicitacoes/[id]', 
                      params: { id: item.id, ticketId: item.ticketId, tipo: aba } 
                    })
                  }
                >
                  <View style={styles.cardTop}>
                    <Text style={styles.cardTitle}>{item.titulo}</Text>
                    <View style={styles.dateRow}>
                      <CalendarDays size={14} color={theme.colors.primary} />
                      <Text style={styles.dateText}>{item.data}</Text>
                    </View>
                  </View>
                  <Text style={styles.protocol}>{item.protocolo}</Text>
                  <View style={[styles.chip, { backgroundColor: s.bg }]}>
                    <View style={[styles.chipDot, { backgroundColor: s.dot }]} />
                    <Text style={[styles.chipText, { color: s.text }]}>{s.label}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
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
  container: { flex: 1, backgroundColor: '#F2F2F2' },
  headerTopContainer: { width: '100%' },
  tabs: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, padding: 6, borderRadius: 999, backgroundColor: '#BDD9E6' },
  tab: { flex: 1, height: 40, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  tabActive: { backgroundColor: theme.colors.primary },
  tabText: { fontFamily: theme.fonts.regular, fontSize: 16, color: theme.colors.primary },
  tabTextActive: { fontFamily: theme.fonts.bold, color: '#FFFFFF' },
  searchFilterRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: theme.colors.primary },
  searchWrapper: { flex: 1, backgroundColor: '#FFFFFF', height: 44, justifyContent: 'center', borderRadius: 999, paddingHorizontal: 20, paddingVertical: 0, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  filterButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  list: { gap: 16, paddingBottom: 24 },
  card: { padding: 16, borderRadius: 18, backgroundColor: '#FFFFFF', elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 3 } },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontFamily: theme.fonts.bold, fontSize: 17, color: theme.colors.primary },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontFamily: theme.fonts.regular, fontSize: 13, color: '#000000' },
  protocol: { fontFamily: theme.fonts.regular, fontSize: 15, color: '#000000', marginTop: 2 },
  chip: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  chipDot: { width: 12, height: 12, borderRadius: 6 },
  chipText: { fontFamily: theme.fonts.regular, fontSize: 12 },
});
