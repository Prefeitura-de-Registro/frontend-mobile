import { SearchInput } from '@/components/atoms/SearchInput';
import { HeaderNavigationContent } from '@/components/molecules/HeaderNavigationContent';
import { ChamadosList } from '@/components/organisms/ChamadosList';
import { FiltroBottomSheet } from '@/components/organisms/FiltroBottomSheet';
import { theme } from '@/constants';
import { listarTickets } from '@/services/tickets.service';
import { Chamado, PrioridadeChamado, TipoOcorrencia } from '@/types/chamado';
import { mapTicketToChamado } from '@/utils/ticket-mapper';
import { useRouter } from 'expo-router';
import { SlidersHorizontal } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChamadosScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Todos' | 'Abertos' | 'Em andamento' | 'Concluídos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroVisible, setFiltroVisible] = useState(false);
  const [prioridades, setPrioridades] = useState<PrioridadeChamado[]>([]);
  const [tipos, setTipos] = useState<TipoOcorrencia[]>([]);

  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarChamados = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const resposta = await listarTickets({ page: 1, limit: 50 });
      setChamados(resposta.data.map(mapTicketToChamado));
    } catch (error) {
      console.error('[chamados] erro ao listar tickets', error);
      setErro('Não foi possível carregar os chamados.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarChamados();
  }, [carregarChamados]);

  function togglePrioridade(p: PrioridadeChamado) {
    setPrioridades((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function toggleTipo(t: TipoOcorrencia) {
    setTipos((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  const chamadosFiltrados = chamados.filter((c) => {
    const matchSearch = c.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.includes(searchQuery);
    let matchTab = true;
    if (activeTab === 'Abertos') matchTab = c.status === 'aberto';
    if (activeTab === 'Em andamento') matchTab = c.status === 'em_atendimento';
    if (activeTab === 'Concluídos') matchTab = c.status === 'concluido';
    const matchPrioridade = prioridades.length === 0 || prioridades.includes(c.prioridade);
    const matchTipo = tipos.length === 0 || tipos.includes(c.tipo);
    return matchSearch && matchTab && matchPrioridade && matchTipo;
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerTopContainer}>
        <HeaderNavigationContent title="Chamados" onPressBack={() => router.back()} />

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

        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={theme.colors.primary} size="large" />
            </View>
          ) : erro ? (
            <View style={styles.centered}>
              <Text style={styles.erroText}>{erro}</Text>
              <TouchableOpacity onPress={carregarChamados} activeOpacity={0.7}>
                <Text style={styles.tentarNovamente}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ChamadosList
              chamados={chamadosFiltrados}
              onSelectChamado={(id) => router.push(`/detalhes_chamado?id=${id}`)}
            />
          )}
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerTopContainer: {
    width: '100%',
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
  filterBarRow: {
    marginBottom: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  tabText: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: '#888',
  },
  tabActive: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  listContainer: {
    flex: 1,
    marginBottom: 8,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 40,
  },
  erroText: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  tentarNovamente: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: theme.colors.primary,
  },
  footerContainer: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
  },
});
