import { theme } from '@/constants';
import { Search } from 'lucide-react-native';
import { StyleSheet, TextInput, View } from 'react-native';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChangeText, placeholder = 'Buscar chamado' }: SearchInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={'#999'}
        style={styles.input}
      />
      <Search size={18} color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#333',
  },
});
