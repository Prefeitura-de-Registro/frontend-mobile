import { theme } from '@/constants';
import { Check, X } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type ResultadoEncerramento = 'aprovada' | 'recusada';

type Props = {
  visible: boolean;
  titulo: string;
  protocolo: string;
  onClose: () => void;
  /** Na integracao, vira a chamada ao back. Se lancar erro, o modal mostra a mensagem de falha */
  onEncerrar: (resultado: ResultadoEncerramento) => void | Promise<void>;
};

const OPCOES: { valor: ResultadoEncerramento; label: string }[] = [
  { valor: 'aprovada', label: 'Aprovada' },
  { valor: 'recusada', label: 'Recusada' },
];

export function EncerrarSolicitacaoModal({ visible, titulo, protocolo, onClose, onEncerrar }: Props) {
  const [etapa, setEtapa] = useState<'escolha' | 'sucesso'>('escolha');
  const [resultado, setResultado] = useState<ResultadoEncerramento | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Ao fechar, volta tudo para o estado inicial (feito aqui e nao em um useEffect,
  // porque setState direto dentro de effect quebra a regra react-hooks/set-state-in-effect)
  function fechar() {
    setEtapa('escolha');
    setResultado(null);
    setEnviando(false);
    setErro(null);
    onClose();
  }

  async function encerrar() {
    if (!resultado || enviando) return;
    setEnviando(true);
    setErro(null);
    try {
      await onEncerrar(resultado);
      setEtapa('sucesso');
    } catch (error) {
      console.error('[solicitacao] erro ao encerrar', error);
      setErro('Não foi possível encerrar a solicitação.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={fechar}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={fechar}
            activeOpacity={0.7}
            accessibilityLabel="Fechar"
          >
            <X size={24} color={theme.colors.primary} />
          </TouchableOpacity>

          <Text style={styles.titulo}>{titulo}</Text>
          <Text style={styles.protocolo}>{protocolo}</Text>

          {etapa === 'escolha' ? (
            <>
              <View style={styles.opcoes}>
                {OPCOES.map((opcao) => {
                  const selecionada = resultado === opcao.valor;
                  return (
                    <TouchableOpacity
                      key={opcao.valor}
                      style={styles.opcao}
                      onPress={() => setResultado(opcao.valor)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.radio, selecionada && styles.radioSelecionado]}>
                        {selecionada && <View style={styles.radioDot} />}
                      </View>
                      <Text style={styles.opcaoLabel}>{opcao.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {erro && <Text style={styles.erro}>{erro}</Text>}

              <TouchableOpacity
                style={[styles.botao, (!resultado || enviando) && styles.botaoDesabilitado]}
                onPress={encerrar}
                disabled={!resultado || enviando}
                activeOpacity={0.8}
              >
                {enviando ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.botaoText}>Encerrar</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.sucesso}>
              <View style={styles.sucessoIcone}>
                <Check size={30} color="#FFFFFF" strokeWidth={3} />
              </View>
              <Text style={styles.sucessoTexto}>A solicitação foi encerrada com sucesso!</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  card: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  titulo: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  protocolo: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginTop: 2,
  },

  opcoes: { marginTop: 24, gap: 16, paddingHorizontal: 8 },
  opcao: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  radioSelecionado: { borderColor: theme.colors.primary },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  opcaoLabel: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    color: '#374151',
  },

  erro: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.danger,
    textAlign: 'center',
    marginTop: 16,
  },
  botao: {
    alignSelf: 'center',
    minWidth: 184,
    height: 40,
    marginTop: 24,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoDesabilitado: { opacity: 0.5 },
  botaoText: {
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: '#FFFFFF',
  },

  sucesso: { alignItems: 'center', marginTop: 20, gap: 14 },
  sucessoIcone: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#22C997',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sucessoTexto: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    textAlign: 'center',
  },
});
