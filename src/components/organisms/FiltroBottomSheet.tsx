import { theme } from '@/constants';
import { StatusChamado, TipoOcorrencia } from '@/types/chamado';
import { SlidersHorizontal, X } from 'lucide-react-native';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CheckboxItem } from '../atoms/CheckboxItem';
import { FilterChip } from '../atoms/FilterChip';

export const SUCCESS_COLOR = '#2ECC9A';

export const STATUS_OPTIONS: {
  value: StatusChamado;
  label: string; // usado no modal
  activeLabel: string; // usado nos chips de filtros ativos
  color: string;
}[] = [
  { value: 'aberto', label: 'Abertos', activeLabel: 'Abertos', color: theme.colors.danger },
  { value: 'em_atendimento', label: 'Andamento', activeLabel: 'Andamento', color: theme.colors.primary },
  { value: 'concluido', label: 'Concluído', activeLabel: 'Concluídos', color: SUCCESS_COLOR },
];

export const TIPOS: { value: TipoOcorrencia; label: string }[] = [
  { value: 'buraco', label: 'Buraco' },
  { value: 'iluminacao_publica', label: 'Iluminação Pública' },
  { value: 'poda_arvore', label: 'Poda de Árvore' },
  { value: 'vazamento', label: 'Vazamento' },
];

interface FiltroBottomSheetProps {
  visible: boolean;
  statusSelecionados: StatusChamado[];
  tiposSelecionados: TipoOcorrencia[];
  onToggleStatus: (s: StatusChamado) => void;
  onToggleTipo: (t: TipoOcorrencia) => void;
  onLimpar: () => void;
  onAplicar: () => void;
  onClose: () => void;
}

export function FiltroBottomSheet({
  visible,
  statusSelecionados,
  tiposSelecionados,
  onToggleStatus,
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
              <SlidersHorizontal size={26} color={theme.colors.primary} />
              <Text style={styles.headerText}>Filtro</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <X size={28} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>Prioridade</Text>
          <View style={styles.chipsRow}>
            {STATUS_OPTIONS.map((s) => (
              <FilterChip
                key={s.value}
                label={s.label}
                color={s.color}
                selected={statusSelecionados.includes(s.value)}
                onToggle={() => onToggleStatus(s.value)}
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
            <TouchableOpacity style={styles.btnOutline} onPress={onLimpar} activeOpacity={0.8}>
              <Text style={styles.btnOutlineText}>Limpar filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnFilled} onPress={onAplicar} activeOpacity={0.8}>
              <Text style={styles.btnFilledText}>Aplicar filtros</Text>
            </TouchableOpacity>
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
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    fontFamily: theme.fonts.bold,
    fontSize: 26,
    color: theme.colors.primary,
  },
  sectionLabel: {
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    color: '#222',
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
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
  },
  btnOutline: {
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: 'white',
  },
  btnOutlineText: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.primary,
  },
  btnFilled: {
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
  },
  btnFilledText: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: 'white',
  },
});