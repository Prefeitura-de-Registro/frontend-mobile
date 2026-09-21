import { theme } from '@/constants';
import { PrioridadeChamado, TipoOcorrencia } from '@/types/chamado';
import { SlidersHorizontal, X } from 'lucide-react-native';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CheckboxItem } from '../atoms/CheckboxItem';
import { FilterChip } from '../atoms/FilterChip';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { SecondaryButton } from '../atoms/SecondaryButton';

const PRIORIDADES: { value: PrioridadeChamado; label: string; color: string }[] = [
  { value: 'urgente', label: 'Urgente', color: '#E53935' },
  { value: 'medio', label: 'Médio', color: '#F5A623' },
  { value: 'normal', label: 'Normal', color: '#7B61FF' },
];

const TIPOS: { value: TipoOcorrencia; label: string }[] = [
  { value: 'buraco', label: 'Buraco' },
  { value: 'iluminacao_publica', label: 'Iluminação Pública' },
  { value: 'poda_arvore', label: 'Poda de Árvore' },
  { value: 'vazamento', label: 'Vazamento' },
];

interface FiltroBottomSheetProps {
  visible: boolean;
  prioridadesSelecionadas: PrioridadeChamado[];
  tiposSelecionados: TipoOcorrencia[];
  onTogglePrioridade: (p: PrioridadeChamado) => void;
  onToggleTipo: (t: TipoOcorrencia) => void;
  onLimpar: () => void;
  onAplicar: () => void;
  onClose: () => void;
}

// Modal nativo por enquanto. Pra ter gesto de arrastar/snap points, trocar por
// @gorhom/bottom-sheet mantendo a mesma API de props.
export function FiltroBottomSheet({
  visible,
  prioridadesSelecionadas,
  tiposSelecionados,
  onTogglePrioridade,
  onToggleTipo,
  onLimpar,
  onAplicar,
  onClose,
}: FiltroBottomSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <SlidersHorizontal size={18} color="#333" />
              <Text style={styles.headerText}>Filtro</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>Prioridade</Text>
          <View style={styles.chipsRow}>
            {PRIORIDADES.map((p) => (
              <FilterChip
                key={p.value}
                label={p.label}
                color={p.color}
                selected={prioridadesSelecionadas.includes(p.value)}
                onToggle={() => onTogglePrioridade(p.value)}
              />
            ))}
          </View>

          <Text style={styles.sectionLabel}>Tipo de ocorrência</Text>
          <View style={styles.checkboxList}>
            {TIPOS.map((t) => (
              <CheckboxItem
                key={t.value}
                label={t.label}
                checked={tiposSelecionados.includes(t.value)}
                onToggle={() => onToggleTipo(t.value)}
              />
            ))}
          </View>

          <View style={styles.actions}>
            <View style={{ flex: 1 }}>
              <SecondaryButton label="Limpar filtros" onPress={onLimpar} />
            </View>
            <View style={{ flex: 1 }}>
              <PrimaryButton label="Aplicar filtros" onPress={onAplicar} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    flex: 1,
  },
  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: '#222',
  },
  sectionLabel: {
    fontFamily: theme.fonts.medium,
    fontSize: 15,
    color: '#333',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  checkboxList: {
    gap: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});
