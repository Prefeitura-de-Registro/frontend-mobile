import { theme } from '@/constants';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RadioButtonItemProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function RadioButtonItem({ label, selected, onPress }: RadioButtonItemProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.circle, selected && styles.circleSelected]}>
        {selected && <View style={styles.dot} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CCD3DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  circleSelected: {
    borderColor: theme.colors.primary,
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  label: {
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: '#333',
  },
});