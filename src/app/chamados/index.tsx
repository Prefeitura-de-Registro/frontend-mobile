import { SearchInput } from '@/components/atoms/SearchInput';
import { HeaderNavigationContent } from '@/components/molecules/HeaderNavigationContent';
import { ChamadosList } from '@/components/organisms/ChamadosList';
import { FiltroBottomSheet, STATUS_OPTIONS, TIPOS } from '@/components/organisms/FiltroBottomSheet';
import { theme } from '@/constants';
import { listarTickets } from '@/services/tickets.service';
import { Chamado, StatusChamado, TipoOcorrencia } from '@/types/chamado';
import { mapTicketToChamado } from '@/utils/ticket-mapper';
import { useRouter } from 'expo-router';
import { SlidersHorizontal, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Filtros {
  status: StatusChamado[];
  tipos: TipoOcorrencia[];
}

const FILTROS_VAZIOS: Filtros = { status: [], tipos: [] };

function toggle<T>(lista: T[], item: T): T[] {
  return lista.includes(item) ? lista.filter((i) => i !== item) : [...lista, item];
}

export default function ChamadosScreen() {
  const router = useRouter();
  const [activeTab] = useState<'Todos' | 'Abertos' | 'Em andamento' | 'Concluídos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroVisible, setFiltroVisible] = useState(false);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS); // aplicado
  const [rascunho, setRascunho] = useState<Filtros>(FILTROS_VAZIOS); // marcado dentro do modal

  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;

    listarTickets({ page: 1, limit: 50 })
      .then((resposta) => {
        if (cancelado) return;
        setChamados(resposta.data.map(mapTicketToChamado));
        setErro(null);
      })
      .catch((error) => {
        if (cancelado) return;
        console.error('[chamados] erro ao listar tickets', error);
        setErro('Não foi possível carregar os chamados.');
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [tentativa]);

  function tentarNovamente() {
    setLoading(true);
    setErro(null);
    setTentativa((t) => t + 1);
  }

  function abrirFiltro() {
    setRascunho(filtros);
    setFiltroVisible(true);
  }

  function aplicarFiltros() {
    setFiltros(rascunho);
    setFiltroVisible(false);
  }

  const chamadosFiltrados = chamados.filter((c) => {
    const matchSearch = c.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.includes(searchQuery);
    let matchTab = true;
    if (activeTab === 'Abertos') matchTab = c.status === 'aberto';
    if (activeTab === 'Em andamento') matchTab = c.status === 'em_atendimento';
    if (activeTab === 'Concluídos') matchTab = c.status === 'concluido';
    const matchStatus = filtros.status.length === 0 || filtros.status.includes(c.status);
    const matchTipo = filtros.tipos.length === 0 || filtros.tipos.includes(c.tipo);
    return matchSearch && matchTab && matchStatus && matchTipo;
  });

  // chips ativos: tipos (escuros) primeiro, depois status coloridos
  const chipsAtivos = [
    ...filtros.tipos.map((value) => ({
      key: `tipo-${value}`,
      label: TIPOS.find((t) => t.value === value)?.label ?? value,
      color: '#2B2B2B',
      onRemove: () => setFiltros((f) => ({ ...f, tipos: f.tipos.filter((t) => t !== value) })),
    })),
    ...filtros.status.map((value) => {
      const opt = STATUS_OPTIONS.find((s) => s.value === value);
      return {
        key: `status-${value}`,
        label: opt?.activeLabel ?? value,
        color: opt?.color ?? theme.colors.primary,
        onRemove: () => setFiltros((f) => ({ ...f, status: f.status.filter((s) => s !== value) })),
      };
    }),
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerTopContainer}>
        <HeaderNavigationContent title="Chamados" onPressBack={() => router.back()} />

        <View style={styles.searchFilterRow}>
          <View style={styles.searchWrapper}>
            <SearchInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Pesquisar" />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={abrirFiltro} activeOpacity={0.8}>
            <SlidersHorizontal size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {chipsAtivos.length > 0 && (
          <View style={styles.activeFilters}>
            {chipsAtivos.map((chip) => (
              <TouchableOpacity
                key={chip.key}
                style={[styles.activeChip, { backgroundColor: chip.color }]}
                onPress={chip.onRemove}
                activeOpacity={0.8}
              >
                <Text style={styles.activeChipText}>{chip.label}</Text>
                <View style={styles.activeChipClose}>
                  <X size={9} color={chip.color} strokeWidth={3} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={theme.colors.primary} size="large" />
            </View>
          ) : erro ? (
            <View style={styles.centered}>
              <Text style={styles.erroText}>{erro}</Text>
              <TouchableOpacity onPress={tentarNovamente} activeOpacity={0.7}>
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
        statusSelecionados={rascunho.status}
        tiposSelecionados={rascunho.tipos}
        onToggleStatus={(s) => setRascunho((r) => ({ ...r, status: toggle(r.status, s) }))}
        onToggleTipo={(t) => setRascunho((r) => ({ ...r, tipos: toggle(r.tipos, t) }))}
        onLimpar={() => setRascunho(FILTROS_VAZIOS)}
        onAplicar={aplicarFiltros}
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
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
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 14,
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 5,
    borderRadius: 16,
  },
  activeChipText: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: 'white',
  },
  activeChipClose: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
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
});