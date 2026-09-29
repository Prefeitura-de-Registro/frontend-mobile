import { theme } from '@/constants';
import { ChevronLeft } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderNavigationContentProps {
  title: string;
  onPressBack: () => void;
}

export function HeaderNavigationContent({ title, onPressBack }: HeaderNavigationContentProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.row, { paddingTop: insets.top + 16 }]}>
      <TouchableOpacity onPress={onPressBack} style={styles.backButton} activeOpacity={0.8}>
        <ChevronLeft size={28} color="white" strokeWidth={3} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 40,
    lineHeight: 48,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  spacer: {
    width: 44,
    height: 44,
  },
});