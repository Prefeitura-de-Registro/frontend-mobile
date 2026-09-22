import { theme } from '@/constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SolicitacaoCardProps {
  titulo: string;
  codigo: string;
  status: 'em andamento' | 'aprovada' | 'recusada' | 'nova solicitação';
  onPress: () => void;
}

export function SolicitacaoCard({ titulo, codigo, status, onPress }: SolicitacaoCardProps) {
  function getStatusColor() {
    switch (status) {
      case 'aprovada': return '#10B981'; // Verde
      case 'recusada': return '#EF4444'; // Vermelho
      case 'em andamento': return '#F59E0B'; // Amarelo
      case 'nova solicitação': return theme.colors.primary; // Azul
      default: return '#888888';
    }
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.headerRow}>
        <Text style={styles.titulo}>{titulo}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      <Text style={styles.codigo}>{codigo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titulo: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: '#1F2937',
  },
  codigo: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: '#6B7280',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: '#4B5563',
    textTransform: 'capitalize',
  },
});