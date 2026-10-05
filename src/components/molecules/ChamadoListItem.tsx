import { theme } from '@/constants';
import { Chamado } from '@/types/chamado';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const STATUS_STYLE: Record<Chamado['status'], { color: string; bg: string }> = {
  aberto: { color: '#E02424', bg: '#F9C9C9' },
  em_atendimento: { color: theme.colors.primary, bg: '#BEE3F8' },
  concluido: { color: '#22C79A', bg: '#D2F4EA' },
};

const PRIORITY_COLOR = '#E02424';

interface ChamadoListItemProps {
  chamado: Chamado;
  onPress: (id: string) => void;
}

export function ChamadoListItem({ chamado, onPress }: ChamadoListItemProps) {
  const status = STATUS_STYLE[chamado.status];

  return (
    <TouchableOpacity
      onPress={() => onPress(chamado.id)}
      activeOpacity={0.7}
      style={[styles.card, { borderLeftColor: status.color }]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: status.color }]}>
            {chamado.titulo}
          </Text>
          <Text style={styles.code}>#{chamado.id}</Text>
        </View>

        <View style={styles.badges}>
          <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: status.color }]} />
            <Text style={[styles.statusText, { color: status.color }]}>
              {chamado.status.replace('_', ' ')}
            </Text>
          </View>
          <Ionicons name="warning" size={28} color={PRIORITY_COLOR} />
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={[styles.infoGroup, styles.addressGroup]}>
          <Ionicons name="location-sharp" size={24} color={status.color} />
          <Text style={styles.address} numberOfLines={1}>
            {chamado.endereco || 'Endereço não disponível'}
          </Text>
        </View>

        <View style={styles.infoGroup}>
          <Ionicons name="time" size={26} color="#FF8C00" />
          <Text style={styles.sla}>{chamado.slaLabel}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderLeftWidth: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
  },
  code: {
    fontFamily: theme.fonts.medium,
    fontSize: 18,
    color: '#111',
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressGroup: {
    flex: 1,
    marginRight: 8,
  },
  address: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: '#111',
    flexShrink: 1,
  },
  sla: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: '#111',
  },
});