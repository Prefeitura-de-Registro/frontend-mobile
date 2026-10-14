import { theme } from '@/constants';
import { ChevronLeft } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderDetalhesChamadoProps {
  onPressBack: () => void;
}

// Título em duas linhas e duas cores ("Detalhes do" preto / "Chamado" azul),
// por isso não reaproveita o HeaderNavigationContent (título de uma cor só).
export function HeaderDetalhesChamado({ onPressBack }: HeaderDetalhesChamadoProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 28 }]}>
      <View accessibilityRole="header" accessibilityLabel="Detalhes do Chamado">
        <Text style={styles.linhaSuperior}>
          <Text style={styles.linhaSuperiorNegrito}>Detalhes</Text> do
        </Text>
        <Text style={styles.linhaInferior}>Chamado</Text>
      </View>

      <TouchableOpacity
        onPress={onPressBack}
        style={styles.backButton}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
      >
        <ChevronLeft size={28} color="white" strokeWidth={3} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 24,
    backgroundColor: theme.colors.background,
  },
  linhaSuperior: {
    fontFamily: theme.fonts.regular,
    fontSize: 32,
    lineHeight: 38,
    color: '#111111',
    textAlign: 'center',
  },
  linhaSuperiorNegrito: {
    fontFamily: theme.fonts.bold,
  },
  linhaInferior: {
    fontFamily: theme.fonts.bold,
    fontSize: 40,
    lineHeight: 44,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  // Alinhado à linha "Chamado" (a de baixo), como no Figma.
  backButton: {
    position: 'absolute',
    left: 26,
    bottom: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});
