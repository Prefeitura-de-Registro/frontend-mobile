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
      <View>
        <TouchableOpacity onPress={onPressBack} style={styles.backButton} activeOpacity={0.8}>
          <ChevronLeft size={22} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={{width: 22, height: 22}}>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingTop: 50,
    width: '100%',
    height: 100,
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
    fontSize: 40,
    color: theme.colors.primary,
    lineHeight: 40, 
    textAlign: 'center',
  },
});