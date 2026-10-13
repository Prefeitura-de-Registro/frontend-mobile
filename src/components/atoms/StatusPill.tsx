import { theme } from '@/constants';
import type { StatusChamado } from '@/types/chamado';
import { StyleSheet, Text, View } from 'react-native';

// Mesma paleta do card da lista de chamados (ChamadoListItem), para o status
// ter a mesma cor em todas as telas.
const STATUS_PILL: Record<StatusChamado, { color: string; background: string; label: string }> = {
  aberto: { color: '#E02424', background: '#F9C9C9', label: 'aberto' },
  em_atendimento: { color: theme.colors.primary, background: '#BEE3F8', label: 'em atendimento' },
  concluido: { color: '#22C79A', background: '#D2F4EA', label: 'concluído' },
};

interface StatusPillProps {
  status: StatusChamado;
}

export function StatusPill({ status }: StatusPillProps) {
  const { color, background, label } = STATUS_PILL[status];

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
  },
});
