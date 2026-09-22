import { theme } from '@/constants';
import { Paperclip, Send } from 'lucide-react-native';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface ChatInputBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAttach: () => void;
}

export function ChatInputBox({ value, onChangeText, onSend, onAttach }: ChatInputBoxProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onAttach} style={styles.attachButton} activeOpacity={0.7}>
        <Paperclip size={20} color={theme.colors.primary} />
      </TouchableOpacity>
      
      <TextInput
        style={styles.input}
        placeholder="Responder..."
        placeholderTextColor="#88888"
        value={value}
        onChangeText={onChangeText}
        multiline
      />

      <TouchableOpacity onPress={onSend} style={styles.sendButton} activeOpacity={0.8}>
        <Send size={18} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D0DCDD',
    gap: 8,
  },
  attachButton: {
    padding: 6,
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#333333',
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});