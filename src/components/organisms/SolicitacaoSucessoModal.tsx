
import { Check, X } from 'lucide-react-native';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface SolicitacaoSucessoModalProps {
  visible: boolean;
  onClose: () => void;
  departamentoNome?: string;
}

export function SolicitacaoSucessoModal({
  visible,
  onClose,
}: SolicitacaoSucessoModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Fechar confirmação"
            hitSlop={8}
          >
            <X size={22} color="#344054" strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.iconCircle}>
            <Check size={26} color="#FFFFFF" strokeWidth={3} />
          </View>

          <Text style={styles.message}>
            Sua solicitação foi{'\n'}
            encaminhada com sucesso!
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Acompanhar solicitação"
          >
            <Text style={styles.buttonText}>
              Acompanhar solicitação
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  container: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#198754',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  message: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    color: '#111111',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 24,
  },

  button: {
    width: '100%',
    minHeight: 36,
    borderWidth: 1,
    borderColor: '#0785C1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  buttonText: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '500',
    color: '#0785C1',
    textAlign: 'center',
  },
});