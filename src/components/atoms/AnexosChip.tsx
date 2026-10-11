import { theme } from '@/constants';
import { Paperclip } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

interface AnexosChipProps {
  total: number;
}

export function AnexosChip({ total }: AnexosChipProps) {
  return (
    <View style={styles.container} accessibilityLabel={`${total} anexo(s)`}>
      <Paperclip size={18} color={theme.colors.primary} />
      <Text style={styles.label}>{total} anexo(s)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    height: 31,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#BAE6FD',
  },
  label: {
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    color: theme.colors.primary,
  },
});
