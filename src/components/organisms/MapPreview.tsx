import { theme } from '@/constants';
import { MapPin } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { LinkText } from '../atoms/LinkText';

interface MapPreviewProps {
  title?: string;
  onVerMapaCompleto: () => void;
}

// Placeholder estático — trocar por react-native-maps (ou uma imagem de Static Maps)
// quando a lib de mapa estiver configurada no projeto (precisa de API key no Android).
export function MapPreview({ title = 'Mapa de ocorrências', onVerMapaCompleto }: MapPreviewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.placeholder}>
        <MapPin size={28} color={theme.colors.primary} />
        <Text style={styles.placeholderText}>Prévia do mapa</Text>
      </View>

      <View style={styles.linkWrapper}>
        <LinkText label="Ver mapa completo" onPress={onVerMapaCompleto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontFamily: theme.fonts.medium,
    fontSize: 15,
    color: '#333',
  },
  placeholder: {
    height: 160,
    borderRadius: 12,
    backgroundColor: '#EEF5FA',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  placeholderText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: '#777',
  },
  linkWrapper: {
    alignItems: 'center',
  },
});
