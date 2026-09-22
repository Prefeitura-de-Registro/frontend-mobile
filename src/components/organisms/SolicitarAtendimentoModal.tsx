import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { TextAreaInput } from '@/components/atoms/TextAreaInput';
import { theme } from '@/constants';
import { Paperclip, X } from 'lucide-react-native';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SolicitarAtendimentoModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function SolicitarAtendimentoModal({ visible, onClose, onSubmit }: SolicitarAtendimentoModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Solicitar Atendimento</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={22} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Selecionar departamento</Text>
          <View style={styles.selectBox}>
            <Text style={styles.selectText}>Departamento de Educação <Text style={styles.suggestion}>(sugestão)</Text></Text>
          </View>

          <Text style={styles.label}>Descrição</Text>
          <TextAreaInput placeholder="" value="" onChangeText={() => {}} />

          <TouchableOpacity style={styles.attachRow} activeOpacity={0.7}>
            <Paperclip size={18} color={theme.colors.primary} />
            <Text style={styles.attachText}>Anexar fotos</Text>
          </TouchableOpacity>

          <View style={styles.buttonWrapper}>
            <PrimaryButton label="Solicitar" onPress={onSubmit} />
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
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.primary,
  },
  label: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: '#333333',
    marginBottom: 6,
  },
  selectBox: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0DCDD',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  selectText: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#333333',
  },
  suggestion: {
    color: '#666666',
    fontSize: 12,
  },
  attachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 16,
  },
  attachText: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: theme.colors.primary,
  },
  buttonWrapper: {
    marginTop: 8,
  },
});