import { theme } from '@/constants';
import { useRouter } from 'expo-router';
import {
    AlertTriangle,
    CalendarDays,
    ChevronLeft,
    Inbox,
    Search,
    SlidersHorizontal,
} from 'lucide-react-native';
import { useState } from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

export default function Solicitacoes() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [aba, setAba] = useState<Aba>('enviadas');
  const [busca, setBusca] = useState('');

  const dados = aba === 'enviadas' ? ENVIADAS : RECEBIDAS;

  return (
    <View style={styles.container}>
      {/* Cabecalho */}
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Voltar"
        >
          <ChevronLeft size={28} color="#FFFFFF" strokeWidth={3} />
        </Pressable>
        <Text style={styles.title}>Solicitações</Text>
        {/* espaco para centralizar o titulo */}
        <View style={styles.backButton} pointerEvents="none" />
      </View>

      {/* Abas */}
      <View style={styles.tabs}>
        <Pressable
          onPress={() => setAba('enviadas')}
          style={[styles.tab, aba === 'enviadas' && styles.tabActive]}
        >
          <AlertTriangle
            size={22}
            color={aba === 'enviadas' ? '#FFFFFF' : theme.colors.primary}
          />
          <Text style={[styles.tabText, aba === 'enviadas' && styles.tabTextActive]}>
            Enviadas
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setAba('recebidas')}
          style={[styles.tab, aba === 'recebidas' && styles.tabActive]}
        >
          <Inbox
            size={22}
            color={aba === 'recebidas' ? '#FFFFFF' : theme.colors.primary}
          />
          <Text style={[styles.tabText, aba === 'recebidas' && styles.tabTextActive]}>
            Recebidas
          </Text>
        </Pressable>
      </View>

      {/* Busca + filtro */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Pesquisar"
            placeholderTextColor="#8A8F98"
            style={styles.searchInput}
          />
          <Search size={16} color={theme.colors.primary} />
        </View>
        <Pressable style={styles.filterButton} accessibilityLabel="Filtrar">
          <SlidersHorizontal size={20} color={theme.colors.primary} />
        </Pressable>
      </View>

      {/* Lista */}
      <FlatList
        data={dados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const s = STATUS[item.status];
          return (
            <Pressable style={styles.card}>
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
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  tabs: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 8,
    borderRadius: 30,
    backgroundColor: '#BDD9E6',
  },
  tab: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tabActive: { backgroundColor: theme.colors.primary },
  tabText: { fontSize: 17, fontWeight: '500', color: theme.colors.primary },
  tabTextActive: { color: '#FFFFFF' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 22,
    backgroundColor: theme.colors.primary,
  },
  searchInputWrapper: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  searchInput: { flex: 1, fontSize: 15, color: '#1F2937', padding: 0 },
  filterButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  list: { padding: 24, gap: 20 },
  card: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.primary },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontSize: 14, color: '#000000' },
  protocol: { fontSize: 16, color: '#000000', marginTop: 2 },
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  chipDot: { width: 12, height: 12, borderRadius: 6 },
  chipText: { fontSize: 12 },
});
