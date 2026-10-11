import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { theme } from '@/constants';
import { Check } from 'lucide-react-native';
import { Modal, StyleSheet, Text, View } from 'react-native';

interface SolicitacaoSucessoModalProps {
  visible: boolean;
  onClose: () => void;
  departamentoNome?: string;
}

export function SolicitacaoSucessoModal({
  visible,
  onClose,
  departamentoNome,
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
          <View style={styles.iconCircle}>
            <Check size={40} color="white" strokeWidth={3} />
          </View>

          <Text style={styles.title} accessibilityRole="header">
            Solicitação enviada!
          </Text>
          <Text style={styles.message}>Sua solicitação de atendimento foi enviada para:</Text>
          {departamentoNome ? <Text style={styles.departamento}>{departamentoNome}</Text> : null}

          <View style={styles.buttonWrapper}>
            <PrimaryButton label="Voltar ao chamado" onPress={onClose} />
          </View>
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
    padding: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    elevation: 5,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  departamento: {
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    color: '#333333',
    textAlign: 'center',
    marginTop: 4,
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 24,
  },
});
