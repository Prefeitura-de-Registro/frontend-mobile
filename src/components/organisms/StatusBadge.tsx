import { theme } from '@/constants';
import { StyleSheet, Text, View } from 'react-native';
import type { StatusChamado } from '../../types/chamado';

// aberto usa verde fixo — não existe theme.colors.success ainda
const STATUS_CONFIG: Record<StatusChamado, { color: string; label: string }> = {
  aberto: { color: '#2ECC71', label: 'aberto' },
  em_atendimento: { color: theme.colors.primary, label: 'em atendimento' },
  concluido: { color: theme.colors.danger, label: 'concluído' },
};

interface StatusBadgeProps {
  status: StatusChamado;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { color, label } = STATUS_CONFIG[status];

  return (
    <View style={styles.container}>
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
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
  },
});
