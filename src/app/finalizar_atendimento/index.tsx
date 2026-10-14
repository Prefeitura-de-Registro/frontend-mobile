import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { RadioButtonItem } from '@/components/atoms/RadioButtonItem';
import { TextAreaInput } from '@/components/atoms/TextAreaInput';
import { PhotoUploadBox } from '@/components/molecules/PhotoUploadBox';
import { FinalizacaoSucessoModal } from '@/components/organisms/FinalizacaoSucessoModal';
import { theme } from '@/constants';
import { useAttachments } from '@/contexts/AttachmentsContext';
import { atualizarTicket } from '@/services/tickets.service';
import type { TicketStatus } from '@/types/ticket';
import { idParaNumero } from '@/utils/detalhes-chamado';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Copy } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FinalizarAtendimentoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { id, protocolo = '#2026-00001', tipoOcorrencia = 'Buraco' } = useLocalSearchParams<{
    id: string;
    protocolo: string;
    tipoOcorrencia: string;
  }>();

  const idNumerico = idParaNumero(id);

  // Estados do Formulário
  const [resultado, setResultado] = useState<string | null>(null);
  const [observacoes, setObservacoes] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  // Estados de Controle
  const [enviando, setEnviando] = useState(false);
  const [modalSucessoVisivel, setModalSucessoVisivel] = useState(false);

  // Trazendo a função de salvar foto apenas no mobile (Mock local)
  const { adicionarAnexo } = useAttachments();

  // Validação: Resultado é obrigatório. Se quiser obrigar foto, adicione: && fotoUri !== null
  const isFormValid = resultado !== null;

  const handleCopyProtocolo = async () => {
    await Clipboard.setStringAsync(protocolo);
  };

  const handleBack = () => {
    if (resultado !== null || observacoes.trim().length > 0 || fotoUri !== null) {
      Alert.alert(
        'Descartar alterações?',
        'Se você voltar agora, perderá os dados preenchidos neste atendimento.',
        [
          { text: 'Continuar preenchendo', style: 'cancel' },
          { text: 'Sair', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  // Lógica do expo-image-picker (Sub-issue #80)
  const handleSelecionarFoto = async () => {
    Alert.alert('Comprovante', 'Escolha a origem da foto', [
      {
        text: 'Câmera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            return Alert.alert('Aviso', 'Precisamos de permissão para usar a câmera.');
          }
          const result = await ImagePicker.launchCameraAsync({
            quality: 0.7, // Comprime a imagem para não pesar no backend
          });
          if (!result.canceled) setFotoUri(result.assets[0].uri);
        },
      },
      {
        text: 'Galeria',
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
          });
          if (!result.canceled) setFotoUri(result.assets[0].uri);
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  // Integração com o Backend (Sub-issue #82) - Adaptado para o cenário atual
  const handleFinalizar = async () => {
    if (idNumerico === null || !resultado) return;

    setEnviando(true);
    try {
      // 1. Atualiza no backend APENAS o que o backend suporta hoje
      // A enviar o status 'fechado' para corresponder ao que existe no banco de dados
      await atualizarTicket(idNumerico, {
        status: 'resolvido' as TicketStatus,
        descricao: observacoes ? `Resultado: ${resultado}\nObservações: ${observacoes}` : `Resultado: ${resultado}`
      });

      // 2. Salva a foto APENAS no Frontend para simular o upload concluído
      if (fotoUri) {
        adicionarAnexo(idNumerico, fotoUri);
      }

      // 3. Abre o modal de sucesso (Sub-issue #81)
      setModalSucessoVisivel(true);
    } catch (error) {
      console.error('[finalizar_atendimento] Erro ao enviar:', error);
      Alert.alert('Erro', 'Não foi possível finalizar o atendimento. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  // Função chamada ao fechar o modal de sucesso
  const handleFecharSucesso = () => {
    setModalSucessoVisivel(false);

    // Volta EXATAMENTE 2 casas no tabuleiro (destrói 'Finalizar' e 'Detalhes').
    // O usuário cai de volta na tela de lista que originou o clique,
    // com a setinha de voltar funcionando perfeitamente para a Home.
    if (router.canGoBack()) {
      router.dismiss(2);
    } else {
      // Apenas uma segurança caso o histórico esteja quebrado
      router.replace('/');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.8} disabled={enviando}>
          <ChevronLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finalizar{'\n'}Atendimento</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.identificationContainer}>
          <View style={styles.identificationText}>
            <Text style={styles.tipoOcorrenciaText}>{tipoOcorrencia}</Text>
            <View style={styles.protocoloRow}>
              <View style={styles.protocoloBadge}>
                <Text style={styles.protocoloText}>{protocolo}</Text>
              </View>
              <TouchableOpacity onPress={handleCopyProtocolo} style={styles.copyButton}>
                <Copy size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.iconSquare}>
            <Image
              source={require('../../../assets/images/logo-estrada.png')}
              style={{ width: 50 }}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resultado do atendimento</Text>
          <View style={styles.radioGroup}>
            <RadioButtonItem
              label="Resolvido"
              selected={resultado === 'resolvido'}
              onPress={() => setResultado('resolvido')}
            />
            <RadioButtonItem
              label="Resolvido parcialmente"
              selected={resultado === 'parcial'}
              onPress={() => setResultado('parcial')}
            />
            <RadioButtonItem
              label="Não foi possível resolver"
              selected={resultado === 'nao_resolvido'}
              onPress={() => setResultado('nao_resolvido')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comprovante do atendimento</Text>
          <View style={styles.uploadContainer}>
            {/* Se houver foto, mostramos a miniatura, senão o PhotoUploadBox */}
            {fotoUri ? (
              <TouchableOpacity onPress={handleSelecionarFoto} activeOpacity={0.8}>
                <Image source={{ uri: fotoUri }} style={styles.fotoPreview} />
                <Text style={styles.trocarFotoText}>Tocar para trocar foto</Text>
              </TouchableOpacity>
            ) : (
              <PhotoUploadBox hasPhoto={false} onPress={handleSelecionarFoto} />
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <TextAreaInput
            placeholder="Digite aqui..."
            value={observacoes}
            onChangeText={setObservacoes}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <PrimaryButton
          label={enviando ? "Enviando..." : "Finalizar atendimento"}
          onPress={handleFinalizar}
          disabled={!isFormValid || enviando}
        />
      </View>

      <FinalizacaoSucessoModal
        visible={modalSucessoVisivel}
        onClose={handleFecharSucesso}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 20, backgroundColor: '#F8FAFC' },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0072AE', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  headerTitle: { fontFamily: theme.fonts.bold, fontSize: 22, color: '#000000', textAlign: 'center', lineHeight: 26 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40 },
  identificationContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  identificationText: { flex: 1 },
  tipoOcorrenciaText: { fontFamily: theme.fonts.bold, fontSize: 28, color: '#0072AE', marginBottom: 8 },
  protocoloRow: { flexDirection: 'row', alignItems: 'center' },
  protocoloBadge: { backgroundColor: '#E2E8F0', paddingHorizontal: 12, paddingVertical: 4, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 },
  protocoloText: { fontFamily: theme.fonts.medium, fontSize: 14, color: '#333333' },
  copyButton: { backgroundColor: '#0072AE', padding: 6, borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  iconSquare: { width: 64, height: 64, backgroundColor: '#BAE6FD', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: theme.fonts.bold, fontSize: 16, color: '#0072AE', marginBottom: 16 },
  radioGroup: { gap: 16, paddingLeft: 8 },
  uploadContainer: { alignItems: 'center' },
  fotoPreview: { width: 140, height: 140, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1' },
  trocarFotoText: { fontFamily: theme.fonts.medium, fontSize: 13, color: '#0072AE', textAlign: 'center', marginTop: 8 },
  footer: { paddingHorizontal: 24, paddingTop: 16, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
});