import { theme } from '@/constants';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export function TextAreaInput({ style, ...rest }: TextInputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      placeholderTextColor="#999"
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3E7EC',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 90,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#333',
  },
});