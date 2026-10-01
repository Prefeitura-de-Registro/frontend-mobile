import { theme } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface PriorityStatCardProps {
  label: string;
  value: number | string;
  color: string;
  backgroundColor: string;
}

export function PriorityStatCard({ label, value, color, backgroundColor }: PriorityStatCardProps) {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Ionicons name="warning" size={26} color={color} />
      <View>
        <Text style={[styles.label, { color }]}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 10,
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
  },
  value: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: '#222',
  },
});
