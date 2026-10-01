import { theme } from '@/constants';
import { MapPin } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

interface MapAreaProps {
  hint?: string;
}

// Placeholder que ocupa todo o espaço disponível.
// Trocar por um MapView (react-native-maps) quando a lib estiver configurada.
export function MapArea({
  hint = 'Toque em um chamado no mapa para ver mais informações',
}: MapAreaProps) {
  return (
    <View style={styles.container}>
      <MapPin size={36} color={theme.colors.primary} />
      <Text style={styles.placeholderText}>Prévia do mapa</Text>

      <View style={styles.hint}>
        <Text style={styles.hintText}>{hint}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EEF4',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  placeholderText: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: '#777',
  },
  hint: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  hintText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});
