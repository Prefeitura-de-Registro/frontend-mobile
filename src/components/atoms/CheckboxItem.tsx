import { theme } from '@/constants';
import { Check } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export function CheckboxItem({ label, checked, onToggle }: CheckboxItemProps) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={styles.row}>
      <TouchableOpacity onPress={onToggle} style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Check size={14} color="white" />}
      </TouchableOpacity>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  label: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#333',
  },
});
