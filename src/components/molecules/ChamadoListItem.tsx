import { theme } from '@/constants';
import { Chamado } from '@/types/chamado';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PriorityBadge } from '../atoms/PriorityBadge';
import { StatusBadge } from '../atoms/StatusBadge';

// mesma cor do StatusBadge — se extrair um util compartilhado depois, troque os dois lugares
const BAR_COLOR: Record<Chamado['status'], string> = {
  aberto: '#2ECC71',
  em_atendimento: theme.colors.primary,
  concluido: theme.colors.danger,
};

interface ChamadoListItemProps {
  chamado: Chamado;
  onPress: (id: string) => void;
}

export function ChamadoListItem({ chamado, onPress }: ChamadoListItemProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(chamado.id)}
      activeOpacity={0.7}
      style={[styles.card, { borderLeftColor: BAR_COLOR[chamado.status] }]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>{chamado.titulo}</Text>
          <Text style={styles.code}>#{chamado.id}</Text>
        </View>
        <View style={styles.badges}>
          <StatusBadge status={chamado.status} />
          <PriorityBadge prioridade={chamado.prioridade} />
        </View>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.address}>{chamado.endereco}</Text>
        <Text style={styles.sla}>{chamado.slaLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 14,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: '#222',
  },
  code: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: '#777',
  },
  badges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  address: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: '#555',
  },
  sla: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: '#333',
  },
});
