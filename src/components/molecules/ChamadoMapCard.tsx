import { theme } from '@/constants';
import { PrioridadeChamado } from '@/types/chamado';
import { AlertTriangle, Clock, MapPin, X } from 'lucide-react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type StatusChamado = 'aberto' | 'em_atendimento' | 'concluido';

interface ChamadoMapCardProps {
  codigo: string;
  titulo: string;
  status: StatusChamado;
  prioridade: PrioridadeChamado;
  endereco: string;
  tempo: string;
  onFechar: () => void;
  onVerDetalhes: () => void;
}

const STATUS_CONFIG: Record<StatusChamado, { label: string; cor: string; fundo: string }> = {
  aberto: { label: 'aberto', cor: '#E02424', fundo: '#FDE2E2' },
  em_atendimento: { label: 'andamento', cor: theme.colors.primary, fundo: '#DCEBF5' },
  concluido: { label: 'concluído', cor: '#22C79A', fundo: '#DDF7EF' },
};

const COR_PRIORIDADE: Record<PrioridadeChamado, string> = {
  urgente: '#E02424',
  medio: '#F5B800',
  normal: '#1FB6D6',
};

export function ChamadoMapCard({
  codigo,
  titulo,
  status,
  prioridade,
  endereco,
  tempo,
  onFechar,
  onVerDetalhes,
}: ChamadoMapCardProps) {
  const insets = useSafeAreaInsets();
  const statusConfig = STATUS_CONFIG[status];

  return (
    <View style={[styles.sheet, { paddingBottom: 16 + insets.bottom }]}>
      <View style={styles.handle} />

      <TouchableOpacity style={styles.closeButton} onPress={onFechar} hitSlop={12}>
        <X size={24} color={theme.colors.primary} />
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.topRow}>
            <Image 
              source={require('@/assets/images/card-map-icon.png')}
              style={styles.iconBox} 
              resizeMode="contain" 
            /> 

          <View style={styles.titleBlock}>
            <Text style={styles.titulo} numberOfLines={1}>
              {titulo}
            </Text>
            <Text style={styles.codigo}>{codigo}</Text>
          </View>

          <View style={[styles.badge, { backgroundColor: statusConfig.fundo }]}>
            <View style={[styles.badgeDot, { backgroundColor: statusConfig.cor }]} />
            <Text style={[styles.badgeText, { color: statusConfig.cor }]}>{statusConfig.label}</Text>
          </View>

          <AlertTriangle size={26} color={COR_PRIORIDADE[prioridade]} />
        </View>

        <View style={styles.bottomRow}>
          <MapPin size={18} color={theme.colors.primary} />
          <Text style={styles.endereco} numberOfLines={1}>
            {endereco}
          </Text>
          <View style={styles.tempoCircle}>
            <Clock size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.tempoText}>{tempo}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.detalhesButton} onPress={onVerDetalhes} activeOpacity={0.85}>
        <Text style={styles.detalhesText}>Ver detalhes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    gap: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  handle: {
    alignSelf: 'center',
    width: 56,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D9D9D9',
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 14,
    gap: 14,
    marginTop: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#D6EAF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 36,
    height: 36,
  },
  titleBlock: {
    flex: 1,
  },
  titulo: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.primary,
  },
  codigo: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: '#555',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  badgeText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  endereco: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: '#333',
  },
  tempoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F28C28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempoText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: '#333',
  },
  detalhesButton: {
    alignSelf: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detalhesText: {
    fontFamily: theme.fonts.medium,
    fontSize: 15,
    color: '#FFFFFF',
  },
});