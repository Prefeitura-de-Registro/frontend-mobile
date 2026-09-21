import { theme } from '@/constants';
import { ChevronLeft } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderNavigationContentProps {
  title: string;
  onPressBack: () => void;
}

export function HeaderNavigationContent({ title, onPressBack }: HeaderNavigationContentProps) {
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onPressBack} style={styles.backButton} activeOpacity={0.8}>
        <ChevronLeft size={22} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center', 
    gap: 75,
    paddingTop: 50
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    color: theme.colors.primary,
    lineHeight: 26, 
    textAlign: 'center',
  },
});