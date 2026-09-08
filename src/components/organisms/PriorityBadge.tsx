import { theme } from '@/constants';
import { StyleSheet, Text, View } from 'react-native';
import type { PrioridadeChamado } from '../../types/chamado';

// medio e normal usam cor fixa — não existe theme.colors.warning/.info ainda
const PRIORITY_CONFIG: Record<PrioridadeChamado, { color: string; label: string }> = {
  urgente: { color: theme.colors.danger, label: 'Urgente' },
  medio: { color: '#F5A623', label: 'Médio' },
  normal: { color: '#7B61FF', label: 'Normal' },
};

interface PriorityBadgeProps {
  prioridade: PrioridadeChamado;
}

export function PriorityBadge({ prioridade }: PriorityBadgeProps) {
  const { color, label } = PRIORITY_CONFIG[prioridade];

  return (
    <View style={styles.container}>
      <Text style={[styles.triangle, { color }]}>▲</Text>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  triangle: {
    fontSize: 10,
  },
  label: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
  },
});
