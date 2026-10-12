import { theme } from '@/constants';
import { Mensagem } from '@/types/mensagem';
import { Paperclip, Send } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  mensagens: Mensagem[];
  /** Setor do usuario logado: define de que lado fica cada bolha */
  meuSetorId: string;
  onEnviar: (texto: string) => void;
  onAnexar?: () => void;
  /** No iOS, ajuste se o teclado cobrir o campo (altura do que fica acima do chat) */
  keyboardVerticalOffset?: number;
};

type Item =
  | { tipo: 'data'; id: string; label: string }
  | { tipo: 'mensagem'; id: string; mensagem: Mensagem };

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

function chaveDoDia(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function formatarData(d: Date) {
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

function formatarHora(d: Date) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// "Departamento de Obras" -> "DO"
function siglaDoSetor(nome: string) {
  const palavras = nome.split(' ').filter(Boolean);
  if (palavras.length === 0) return '';
  if (palavras.length === 1) return palavras[0].slice(0, 2).toUpperCase();
  return (palavras[0][0] + palavras[palavras.length - 1][0]).toUpperCase();
}

// Ordena por data e intercala um separador a cada dia novo
function montarItens(mensagens: Mensagem[]): Item[] {
  const ordenadas = [...mensagens].sort(
    (a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime(),
  );
  const itens: Item[] = [];
  let diaAnterior = '';
  for (const mensagem of ordenadas) {
    const data = new Date(mensagem.criadoEm);
    const dia = chaveDoDia(data);
    if (dia !== diaAnterior) {
      itens.push({ tipo: 'data', id: `data-${dia}`, label: formatarData(data) });
      diaAnterior = dia;
    }
    itens.push({ tipo: 'mensagem', id: mensagem.id, mensagem });
  }
  return itens;
}

export function ComunicacaoChat({
  mensagens,
  meuSetorId,
  onEnviar,
  onAnexar,
  keyboardVerticalOffset = 0,
}: Props) {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<Item>>(null);
  const [texto, setTexto] = useState('');

  const itens = useMemo(() => montarItens(mensagens), [mensagens]);
  const podeEnviar = texto.trim().length > 0;

  function enviar() {
    if (!podeEnviar) return;
    onEnviar(texto.trim());
    setTexto('');
  }

  function renderItem({ item }: { item: Item }) {
    if (item.tipo === 'data') {
      return (
        <View style={styles.dateRow}>
          <View style={styles.dateLine} />
          <View style={styles.datePill}>
            <Text style={styles.dateText}>{item.label}</Text>
          </View>
          <View style={styles.dateLine} />
        </View>
      );
    }

    const { mensagem } = item;
    const minha = mensagem.setorId === meuSetorId;

    const avatar = (
      <View style={[styles.avatar, minha ? styles.avatarMine : styles.avatarOther]}>
        <Text style={[styles.avatarText, minha ? styles.avatarTextMine : styles.avatarTextOther]}>
          {siglaDoSetor(mensagem.setorNome)}
        </Text>
      </View>
    );

    return (
      <View style={[styles.messageRow, minha ? styles.rowMine : styles.rowOther]}>
        {!minha && avatar}
        <View style={[styles.messageContent, minha ? styles.alignEnd : styles.alignStart]}>
          <Text style={styles.setorNome}>{mensagem.setorNome}</Text>
          <View style={[styles.bubble, minha ? styles.bubbleMine : styles.bubbleOther]}>
            <Text style={[styles.bubbleText, minha && styles.bubbleTextMine]}>{mensagem.texto}</Text>
            {mensagem.qtdAnexos > 0 && (
              <View style={styles.anexosRow}>
                <Paperclip size={12} color={minha ? '#FFFFFF' : '#000000'} />
                <Text style={[styles.anexosText, minha && styles.bubbleTextMine]}>
                  {mensagem.qtdAnexos} anexo(s)
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.hora}>{formatarHora(new Date(mensagem.criadoEm))}</Text>
        </View>
        {minha && avatar}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <FlatList
        ref={listRef}
        data={itens}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={[styles.inputRow, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            value={texto}
            onChangeText={setTexto}
            placeholder="Escreva sua mensagem"
            placeholderTextColor="#8A8F98"
            style={styles.input}
            multiline
          />
          <TouchableOpacity
            onPress={enviar}
            disabled={!podeEnviar}
            activeOpacity={0.7}
            accessibilityLabel="Enviar mensagem"
          >
            <Send size={18} color={theme.colors.primary} style={{ opacity: podeEnviar ? 1 : 0.4 }} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={onAnexar}
          activeOpacity={0.8}
          accessibilityLabel="Anexar arquivo"
        >
          <Paperclip size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 24, gap: 20 },

  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateLine: { flex: 1, height: 1, backgroundColor: '#DDE3EA' },
  datePill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#DFE7F0',
  },
  dateText: { fontFamily: theme.fonts.regular, fontSize: 12, color: '#6B7280' },

  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  rowMine: { justifyContent: 'flex-end' },
  rowOther: { justifyContent: 'flex-start' },
  messageContent: { maxWidth: '75%', gap: 4 },
  alignEnd: { alignItems: 'flex-end' },
  alignStart: { alignItems: 'flex-start' },

  setorNome: {
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: theme.colors.primary,
  },
  bubble: {
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  bubbleMine: { backgroundColor: theme.colors.primary },
  bubbleOther: { backgroundColor: '#FFFFFF' },
  bubbleText: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: '#1F2937',
  },
  bubbleTextMine: { color: '#FFFFFF' },
  anexosRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 14 },
  anexosText: { fontFamily: theme.fonts.regular, fontSize: 10, color: '#000000' },
  hora: { fontFamily: theme.fonts.regular, fontSize: 11, color: '#8A8F98' },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Cor por lado (minha = azul, outro = amarelo), como no design
  avatarMine: { backgroundColor: theme.colors.primary },
  avatarOther: { backgroundColor: '#FFC20E' },
  avatarText: { fontFamily: theme.fonts.bold, fontSize: 18 },
  avatarTextMine: { color: '#FFFFFF' },
  avatarTextOther: { color: '#000000' },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  inputWrapper: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: '#F2F2F2',
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: '#1F2937',
    paddingVertical: 8,
  },
  attachButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#B9E6FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
