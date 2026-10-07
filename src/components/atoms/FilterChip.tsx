import { theme } from '@/constants';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface FilterChipProps {
  label: string;
  color: string;
  selected: boolean;
  onToggle: () => void;
}

export function FilterChip({ label, color, selected, onToggle }: FilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      style={[
        styles.chip,
        { borderColor: color, backgroundColor: selected ? color : 'transparent' },
      ]}
    >
      <Text style={[styles.label, { color: selected ? 'white' : color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    minWidth: 88,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  label: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
  },
});