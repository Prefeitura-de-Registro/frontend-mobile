import { theme } from '@/constants';
import { Mail } from 'lucide-react-native';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

interface InputMatriculaProps extends TextInputProps {}

export function InputMatricula(props: InputMatriculaProps) {
  return (
    <View style={styles.container}>
      <Mail size={20} color={theme.colors.primary} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Matrícula"
        placeholderTextColor="#888888"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 52,
    backgroundColor: '#EAEFF4',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#D0DCDD',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: '#333333',
  },
});