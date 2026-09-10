import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { RadioButtonItem } from '@/components/atoms/RadioButtonItem';
import { TextAreaInput } from '@/components/atoms/TextAreaInput';
import { HeaderBackground } from '@/components/molecules/HeaderBackground';
import { HeaderNavigationContent } from '@/components/molecules/HeaderNavigationContent';
import { PhotoUploadBox } from '@/components/molecules/PhotoUploadBox';
import { InfoRow } from '@/components/organisms/InfoRow';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from './style';

// Dados mockados do chamado (na versão real virão por rota/params ou API)
const chamadoMock = {
  titulo: 'Buraco',
  codigo: '#2026-00001',
  local: 'Rua das Flores, 220',
};



type Resultado = 'resolvido' | 'parcial' | 'nao_resolvido' | null;

const opcoesResultado: { label: string; value: Resultado }[] = [
  { label: 'Resolvido', value: 'resolvido' },
  { label: 'Resolvido parcialmente', value: 'parcial' },
  { label: 'Não foi possível resolver', value: 'nao_resolvido' },
];

export default function FinalizarAtendimentoScreen() {
  const router = useRouter();

  const [resultado, setResultado] = useState<Resultado>(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [observacoes, setObservacoes] = useState('');

  function handleAdicionarFoto() {
    // Mock: em produção, abrir câmera/galeria (ex: expo-image-picker)
    setHasPhoto((prev) => !prev);
  }

  function handleFinalizar() {
    // Mock: em produção, enviar para a API
    console.log({
      chamado: chamadoMock.codigo,
      resultado,
      hasPhoto,
      observacoes,
    });
    router.back();
  }

  return (
    <ScrollView style={styles.container}>
      <HeaderBackground height={140}>
        <HeaderNavigationContent
          title="Finalizar Atendimento"
          onPressBack={() => router.back()}
        />
      </HeaderBackground>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.chamadoHeader}>
            <Text style={styles.chamadoTitulo}>{chamadoMock.titulo}</Text>
            <Text style={styles.chamadoCodigo}>{chamadoMock.codigo}</Text>
          </View>

          <InfoRow label="Local:" value={chamadoMock.local} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resultado do atendimento</Text>
            <View style={styles.radioGroup}>
              {opcoesResultado.map((opcao) => (
                <RadioButtonItem
                  key={opcao.value}
                  label={opcao.label}
                  selected={resultado === opcao.value}
                  onPress={() => setResultado(opcao.value)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comprovante do atendimento</Text>
            <Text style={styles.sectionSubtitle}>
              Adicione uma foto que comprove o serviço realizado
            </Text>
            <PhotoUploadBox hasPhoto={hasPhoto} onPress={handleAdicionarFoto} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <Text style={styles.sectionSubtitle}>Descreva o serviço realizado</Text>
            <TextAreaInput
              placeholder=""
              value={observacoes}
              onChangeText={setObservacoes}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <PrimaryButton label="Finalizar atendimento" onPress={handleFinalizar} />
          </View>

          
        </View>
      </ScrollView>
    </ScrollView>
  );
}