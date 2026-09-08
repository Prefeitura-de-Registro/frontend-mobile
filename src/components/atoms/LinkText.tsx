import { theme } from '@/constants';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface LinkTextProps {
  label: string;
  onPress?: () => void;
}

export function LinkText({ label, onPress }: LinkTextProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});
