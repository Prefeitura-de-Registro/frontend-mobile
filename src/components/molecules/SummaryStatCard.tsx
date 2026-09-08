import { theme } from '@/constants';
import { StyleSheet, Text, View } from 'react-native';

interface SummaryStatCardProps {
  label: string;
  value: number;
  color: string;
}

export function SummaryStatCard({ label, value, color }: SummaryStatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <View style={[styles.bar, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    overflow: 'hidden',
  },
  label: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  value: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
  },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
  },
});
