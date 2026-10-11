import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { TextAreaInput } from '@/components/atoms/TextAreaInput';
import { theme } from '@/constants';
import { mockDepartamentos } from '@/data/mockDepartamentos';
import type { TicketDepartamento } from '@/types/ticket';
import { Check, ChevronDown, ChevronUp, Paperclip, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export interface SolicitacaoAtendimento {
  departamento: TicketDepartamento;
  descricao: string;
}

interface SolicitarAtendimentoModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (solicitacao: SolicitacaoAtendimento) => void;
  departamentos?: TicketDepartamento[];
  /** Departamento que já aparece selecionado, marcado como "(sugestão)". */
  departamentoSugeridoId?: number;
  onAnexarFotos?: () => void;
}

export function SolicitarAtendimentoModal({
  visible,
  onClose,
  onSubmit,
  departamentos = mockDepartamentos,
  departamentoSugeridoId,
  onAnexarFotos,
}: SolicitarAtendimentoModalProps) {
  const [escolhidoId, setEscolhidoId] = useState<number | null>(null);
  const [listaAberta, setListaAberta] = useState(false);
  const [descricao, setDescricao] = useState('');

  // Enquanto a pessoa não escolhe, vale a sugestão.
  const departamentoId = escolhidoId ?? departamentoSugeridoId ?? null;
  const departamento = departamentos.find((item) => item.id === departamentoId) ?? null;
  const formularioValido = departamento !== null && descricao.trim().length > 0;

  function limpar() {
    setEscolhidoId(null);
    setListaAberta(false);
    setDescricao('');
  }

  function fechar() {
    limpar();
    onClose();
  }

  function enviar() {
    if (!departamento || !formularioValido) return;
    const solicitacao = { departamento, descricao: descricao.trim() };
    limpar();
    onSubmit(solicitacao);
  }

  function escolher(id: number) {
    setEscolhidoId(id);
    setListaAberta(false);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={fechar}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
          >
            <View style={styles.header}>
              <Text style={styles.title} accessibilityRole="header">
                Solicitar Atendimento
              </Text>
              <TouchableOpacity
                onPress={fechar}
                activeOpacity={0.7}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Fechar"
              >
                <X size={22} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Selecionar departamento</Text>
            <TouchableOpacity
              style={[styles.selectBox, listaAberta && styles.selectBoxAberto]}
              onPress={() => setListaAberta((aberta) => !aberta)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Selecionar departamento"
            >
              <Text style={styles.selectText} numberOfLines={1}>
                {departamento ? departamento.nome : 'Selecione um departamento'}
                {departamento && departamento.id === departamentoSugeridoId && (
                  <Text style={styles.suggestion}> (sugestão)</Text>
                )}
              </Text>
              {listaAberta ? (
                <ChevronUp size={18} color="#666" />
              ) : (
                <ChevronDown size={18} color="#666" />
              )}
            </TouchableOpacity>

            {listaAberta && (
              <View style={styles.lista}>
                {departamentos.map((item) => {
                  const selecionado = item.id === departamentoId;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.opcao}
                      onPress={() => escolher(item.id)}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityState={{ selected: selecionado }}
                    >
                      <Text style={[styles.opcaoTexto, selecionado && styles.opcaoSelecionada]}>
                        {item.nome}
                        {item.id === departamentoSugeridoId && (
                          <Text style={styles.suggestion}> (sugestão)</Text>
                        )}
                      </Text>
                      {selecionado && <Check size={18} color={theme.colors.primary} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <Text style={[styles.label, styles.labelDescricao]}>Descrição</Text>
            <TextAreaInput
              placeholder="Explique por que o atendimento deve ser feito por esse departamento"
              value={descricao}
              onChangeText={setDescricao}
            />

            <TouchableOpacity style={styles.attachRow} activeOpacity={0.7} onPress={onAnexarFotos}>
              <Paperclip size={18} color={theme.colors.primary} />
              <Text style={styles.attachText}>Anexar fotos</Text>
            </TouchableOpacity>

            <PrimaryButton label="Solicitar" onPress={enviar} disabled={!formularioValido} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    elevation: 5,
  },
  content: {
    padding: 24,
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
  labelDescricao: {
    marginTop: 16,
  },
  selectBox: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0DCDD',
    paddingHorizontal: 14,
    backgroundColor: '#FAFAFA',
  },
  selectBoxAberto: {
    borderColor: theme.colors.primary,
  },
  selectText: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#333333',
  },
  suggestion: {
    color: '#666666',
    fontSize: 12,
  },
  lista: {
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0DCDD',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  opcaoTexto: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#333333',
  },
  opcaoSelecionada: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
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
});
