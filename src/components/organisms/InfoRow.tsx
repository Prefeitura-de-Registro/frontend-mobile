import { theme } from '@/constants';
import { StyleSheet, Text, View } from 'react-native';

interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  label: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: '#333',
  },
  value: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#666',
  },
});
