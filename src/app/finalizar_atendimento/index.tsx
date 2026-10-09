import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { RadioButtonItem } from '@/components/atoms/RadioButtonItem';
import { TextAreaInput } from '@/components/atoms/TextAreaInput';
import { PhotoUploadBox } from '@/components/molecules/PhotoUploadBox';
import { theme } from '@/constants';
import * as Clipboard from 'expo-clipboard';
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

  // Parâmetros recebidos da tela de Detalhes (tipagem via Expo Router)
  const { id, protocolo = '#2026-00001', tipoOcorrencia = 'Buraco' } = useLocalSearchParams<{
    id: string;
    protocolo: string;
    tipoOcorrencia: string;
  }>();

  // Estados do Formulário
  const [resultado, setResultado] = useState<string | null>(null);
  const [observacoes, setObservacoes] = useState('');
  // O estado da foto será integrado na sub-issue, mas deixamos preparado
  const [temFoto, setTemFoto] = useState(false);

  // Validação: Botão só ativa se houver um resultado selecionado
  const isFormValid = resultado !== null;

  const handleCopyProtocolo = async () => {
    await Clipboard.setStringAsync(protocolo);
    // Aqui no futuro pode entrar um Toast de "Copiado!"
  };

  const handleBack = () => {
    // Regra: Evitar perda acidental de dados
    if (resultado !== null || observacoes.trim().length > 0 || temFoto) {
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

  const handleFinalizar = () => {
    console.log('Dados para enviar:', { id, resultado, observacoes, temFoto });
    // Lógica de envio e Modal de sucesso virão nas sub-issues!
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Cabeçalho Customizado */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.8}>
          <ChevronLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Finalizar{'\n'}Atendimento
        </Text>
        <View style={{ width: 44 }} /> {/* View vazia para balancear o flex */}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Identificação do Chamado (Pode ser substituído pelo seu CardChamadoDetalhe se ele tiver essa variação exata) */}
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

        {/* Seção: Resultado do Atendimento */}
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

        {/* Seção: Comprovante */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comprovante do atendimento</Text>
          <View style={styles.uploadContainer}>
            <PhotoUploadBox
              hasPhoto={temFoto}
              onPress={() => setTemFoto(true)}
            />
          </View>
        </View>

        {/* Seção: Observações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <TextAreaInput
            placeholder="Digite aqui..."
            value={observacoes}
            onChangeText={setObservacoes}
          />
        </View>

      </ScrollView>

      {/* Botão Fixo no Rodapé */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <PrimaryButton
          label="Finalizar atendimento"
          onPress={handleFinalizar}
          disabled={!isFormValid}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Cor de fundo base do app
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0072AE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 26,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  identificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  identificationText: {
    flex: 1,
  },
  tipoOcorrenciaText: {
    fontFamily: theme.fonts.bold,
    fontSize: 28,
    color: '#0072AE',
    marginBottom: 8,
  },
  protocoloRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  protocoloBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  protocoloText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: '#333333',
  },
  copyButton: {
    backgroundColor: '#0072AE',
    padding: 6,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  iconSquare: {
    width: 64,
    height: 64,
    backgroundColor: '#BAE6FD',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: '#0072AE',
    marginBottom: 16,
  },
  radioGroup: {
    gap: 16, // Espaçamento entre os RadioButtons
    paddingLeft: 8,
  },
  uploadContainer: {
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});