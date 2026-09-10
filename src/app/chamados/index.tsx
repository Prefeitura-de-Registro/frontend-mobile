import { SearchInput } from '@/components/atoms/SearchInput';
import { HeaderBackground } from '@/components/molecules/HeaderBackground';
import { HeaderNavigationContent } from '@/components/molecules/HeaderNavigationContent';
import { ChamadosList } from '@/components/organisms/ChamadosList';
import { FiltroBottomSheet } from '@/components/organisms/FiltroBottomSheet';
import { FooterLogo } from '@/components/organisms/FooterLogo';
import { theme } from '@/constants';
import { mockChamados } from '@/data/mockChamados';
import { PrioridadeChamado, TipoOcorrencia } from '@/types/chamado';
import { useRouter } from 'expo-router';
import { SlidersHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChamadosScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Todos' | 'Abertos' | 'Em andamento' | 'Concluídos'>('Todos');
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

  // Filtragem dinâmica de chamados
  const chamadosFiltrados = mockChamados.filter((c) => {
    // Filtro por texto de busca
    const matchSearch = c.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.includes(searchQuery);
    
    // Filtro pelas abas superiores
    let matchTab = true;
    if (activeTab === 'Abertos') matchTab = c.status === 'aberto';
    if (activeTab === 'Em andamento') matchTab = c.status === 'em_atendimento';
    if (activeTab === 'Concluídos') matchTab = c.status === 'concluido';

    // Filtros do BottomSheet
    const matchPrioridade = prioridades.length === 0 || prioridades.includes(c.prioridade);
    const matchTipo = tipos.length === 0 || tipos.includes(c.tipo);

    return matchSearch && matchTab && matchPrioridade && matchTipo;
  });

  return (
    <View style={styles.container}>
      {/* Cabeçalho com degradê e botão de voltar */}
      <HeaderBackground height={130}>
        <HeaderNavigationContent title="Chamados" onPressBack={() => router.back()} />
      </HeaderBackground>

      <View style={styles.content}>
        {/* Abas de filtro superior e botão de abrir modal de filtros */}
        <View style={styles.filterBarRow}>
          <View style={styles.tabsRow}>
            {(['Todos', 'Abertos', 'Em andamento', 'Concluídos'] as const).map((tab, index, arr) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} activeOpacity={0.7}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabActive]}>
                  {tab} {index < arr.length - 1 && '| '}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={() => setFiltroVisible(true)} activeOpacity={0.7}>
            <SlidersHorizontal size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Input de busca */}
        <View style={styles.searchWrapper}>
          <SearchInput value={searchQuery} onChangeText={setSearchQuery} />
        </View>

        {/* Lista de chamados */}
        <View style={styles.listContainer}>
          <ChamadosList 
            chamados={chamadosFiltrados} 
            onSelectChamado={(id) => router.push(`/detalhes_chamado?id=${id}`)} 
          />
        </View>
      </View>

      {/* Rodapé fixo na parte inferior */}
      <View style={styles.footerContainer}>
        <FooterLogo />
      </View>

       {/* Modal de Filtros Avançados */}
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
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  filterBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  searchWrapper: {
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
    marginBottom: 12,
  },
  footerContainer: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});