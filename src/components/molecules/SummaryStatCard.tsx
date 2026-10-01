import { theme } from '@/constants';
import { StyleSheet, Text, View } from 'react-native';

interface SummaryStatCardProps {
  label: string;
  value: number | string;
  color: string;
}

export function SummaryStatCard({ label, value, color }: SummaryStatCardProps) {
  return (
    <View style={[styles.card, { borderBottomColor: color }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderBottomWidth: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  label: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: '#222',
  },
  value: {
    fontFamily: theme.fonts.bold,
    fontSize: 26,
    lineHeight: 32,
  },
});
