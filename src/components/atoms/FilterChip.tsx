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
      activeOpacity={0.7}
      style={[
        styles.chip,
        { borderColor: color },
        selected && { backgroundColor: color },
      ]}
    >
      <Text style={[styles.label, { color: selected ? 'white' : color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  label: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
  },
});
