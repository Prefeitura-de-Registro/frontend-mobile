import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { HeaderBackground } from '@/components/molecules/HeaderBackground';
import { HeaderGreetingContent } from '@/components/molecules/HeaderGreetingContent';
import { SummaryStatCard } from '@/components/molecules/SummaryStatCard';
import { CardChamadoDetalhe } from '@/components/organisms/CardChamadoDetalhe';
import { ChamadosList } from '@/components/organisms/ChamadosList';
import { FiltroBottomSheet } from '@/components/organisms/FiltroBottomSheet';
import { MapPreview } from '@/components/organisms/MapPreview';
import { theme } from '@/constants';
import { mockChamados } from '@/data/mockChamados';
import { PrioridadeChamado, TipoOcorrencia } from '@/types/chamado';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function OrganismsShowcaseScreen() {
  const [filtroVisible, setFiltroVisible] = useState(false);
  const [prioridades, setPrioridades] = useState<PrioridadeChamado[]>([]);
  const [tipos, setTipos] = useState<TipoOcorrencia[]>([]);

  function togglePrioridade(p: PrioridadeChamado) {
    setPrioridades((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function toggleTipo(t: TipoOcorrencia) {
    setTipos((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  const abertos = mockChamados.filter((c) => c.status === 'aberto').length;
  const emAndamento = mockChamados.filter((c) => c.status === 'em_atendimento').length;
  const concluidos = mockChamados.filter((c) => c.status === 'concluido').length;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <HeaderBackground height={150}>
        <HeaderGreetingContent
          userName="Carlos"
          role="Secretaria de Obras"
          avatarUri="https://i.pravatar.cc/100"
          onPressNotification={() => {}}
        />
      </HeaderBackground>

      <View style={styles.container}>
        <Text style={styles.sectionTitle}>SummaryStatCard</Text>
        <View style={styles.statsRow}>
          <SummaryStatCard label="Abertos" value={abertos} color="#2ECC71" />
          <SummaryStatCard label="Andamento" value={emAndamento} color={theme.colors.primary} />
          <SummaryStatCard label="Concluídos" value={concluidos} color={theme.colors.danger} />
        </View>

        <Text style={styles.sectionTitle}>ChamadosList</Text>
        <View style={{ height: 320 }}>
          <ChamadosList chamados={mockChamados} onSelectChamado={() => {}} scrollEnabled={false} />
        </View>

        <Text style={styles.sectionTitle}>MapPreview</Text>
        <MapPreview onVerMapaCompleto={() => {}} />

        <Text style={styles.sectionTitle}>CardChamadoDetalhe (aberto)</Text>
        <CardChamadoDetalhe chamado={mockChamados[1]} />

        <Text style={styles.sectionTitle}>CardChamadoDetalhe (em atendimento)</Text>
        <CardChamadoDetalhe chamado={mockChamados[0]} />

        <Text style={styles.sectionTitle}>FiltroBottomSheet</Text>
        <PrimaryButton label="Abrir filtro" onPress={() => setFiltroVisible(true)} />
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: '#888',
    textTransform: 'uppercase',
    marginTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
