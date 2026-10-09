import { SearchInput } from '@/components/atoms/SearchInput';
import { HeaderNavigationContent } from '@/components/molecules/HeaderNavigationContent';
import { FiltroBottomSheet } from '@/components/organisms/FiltroBottomSheet';
import { theme } from '@/constants';
import { PrioridadeChamado, TipoOcorrencia } from '@/types/chamado';
import { useRouter } from 'expo-router';
import { AlertTriangle, CalendarDays, Inbox, SlidersHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Aba = 'enviadas' | 'recebidas';
type Status = 'nova' | 'em_atendimento' | 'aprovada' | 'recusada';

type Solicitacao = {
  id: string;
  titulo: string;
  protocolo: string;
  data: string;
  status: Status;
};

// Mock so para o design (a integracao vem na sub-issue)
const ENVIADAS: Solicitacao[] = [
  { id: '1', titulo: 'Poda de Árvore', protocolo: '#2026-00011', data: '28/09/2026', status: 'em_atendimento' },
  { id: '2', titulo: 'Poda de Árvore', protocolo: '#2026-00012', data: '28/09/2026', status: 'aprovada' },
  { id: '3', titulo: 'Poda de Árvore', protocolo: '#2026-00013', data: '28/09/2026', status: 'recusada' },
];

const RECEBIDAS: Solicitacao[] = [
  { id: '4', titulo: 'Iluminação Pública', protocolo: '#2026-00005', data: '28/09/2026', status: 'nova' },
];

// theme nao tem success/info, entao as cores de status ficam locais na tela
const STATUS: Record<Status, { label: string; bg: string; dot: string; text: string }> = {
  nova: { label: 'nova solicitação', bg: '#B9E6FE', dot: theme.colors.primary, text: theme.colors.primary },
  em_atendimento: { label: 'em atendimento', bg: '#B9E6FE', dot: theme.colors.primary, text: theme.colors.primary },
  aprovada: { label: 'aprovada', bg: '#D1FAE5', dot: '#22C997', text: '#16A37A' },
  recusada: { label: 'recusada', bg: '#FCB5B5', dot: theme.colors.danger, text: theme.colors.danger },
};

export default function SolicitacoesScreen() {
  const router = useRouter();
  const [aba, setAba] = useState<Aba>('enviadas');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroVisible, setFiltroVisible] = useState(false);
  const [prioridades, setPrioridades] = useState<PrioridadeChamado[]>([]);
  const [tipos, setTipos] = useState<TipoOcorrencia[]>([]);

  function togglePrioridade(p: PrioridadeChamado) {
    setPrioridades((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function toggleTipo(t: TipoOcorrencia) {
    setTipos((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  const dados = (aba === 'enviadas' ? ENVIADAS : RECEBIDAS).filter(
    (s) =>
      s.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.protocolo.includes(searchQuery),
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerTopContainer}>
        <HeaderNavigationContent title="Solicitações" onPressBack={() => router.back()} />

        {/* Abas */}
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

        {/* Busca + filtro */}
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
        <FlatList
          data={dados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const s = STATUS[item.status];
            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                // onPress={() => router.push(`/solicitacao/${item.id}`)}
                onPress={() => router.push(`/`)}
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
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  headerTopContainer: {
    width: '100%',
  },

  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 6,
    borderRadius: 999,
    backgroundColor: '#BDD9E6',
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tabActive: { backgroundColor: theme.colors.primary },
  tabText: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: theme.colors.primary,
  },
  tabTextActive: {
    fontFamily: theme.fonts.bold,
    color: '#FFFFFF',
  },

  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: theme.colors.primary,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: 44,
    justifyContent: 'center',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
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
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  list: { gap: 16, paddingBottom: 24 },
  card: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 17,
    color: theme.colors.primary,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: '#000000',
  },
  protocol: {
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: '#000000',
    marginTop: 2,
  },
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipDot: { width: 12, height: 12, borderRadius: 6 },
  chipText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
  },
});
