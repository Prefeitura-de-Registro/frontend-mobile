import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { RadioButtonItem } from '@/components/atoms/RadioButtonItem';
import { TextAreaInput } from '@/components/atoms/TextAreaInput';
import { HeaderBackground } from '@/components/molecules/HeaderBackground';
import { HeaderNavigationContent } from '@/components/molecules/HeaderNavigationContent';
import { PhotoUploadBox } from '@/components/molecules/PhotoUploadBox';
import { InfoRow } from '@/components/organisms/InfoRow';
import { theme } from '@/constants';
import { mockChamados } from '@/data/mockChamados'; // Importa o mock oficial
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type Resultado = 'resolvido' | 'parcial' | 'nao_resolvido' | null;

const opcoesResultado: { label: string; value: Resultado }[] = [
  { label: 'Resolvido', value: 'resolvido' },
  { label: 'Resolvido parcialmente', value: 'parcial' },
  { label: 'Não foi possível resolver', value: 'nao_resolvido' },
];

export default function FinalizarAtendimentoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const chamadoEncontrado = mockChamados.find((c) => c.id === id) || mockChamados[0];
  
  const chamadoMock = {
    titulo: chamadoEncontrado.titulo,
    codigo: `#${chamadoEncontrado.id}`,
    local: chamadoEncontrado.endereco,
  };

  const [resultado, setResultado] = useState<Resultado>(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [observacoes, setObservacoes] = useState('');

  function handleAdicionarFoto() {
    setHasPhoto((prev) => !prev);
  }

  function handleFinalizar() {
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

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'white',
      
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 60,
    },
    card: {
      marginTop: -20,
      marginHorizontal: 24,
      backgroundColor: '#F6F6F6',
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 28,
      gap: 20,
      
    },
    chamadoHeader: {
      alignItems: 'center',
      gap: 4,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#DCE2E8',
    },
    chamadoTitulo: {
      fontFamily: theme.fonts.bold,
      fontSize: 22,
      color: theme.colors.primary,
    },
    chamadoCodigo: {
      fontFamily: theme.fonts.regular,
      fontSize: 13,
      color: '#333',
    },
    section: {
      gap: 8,
      
    },
    sectionTitle: {
      fontFamily: theme.fonts.bold,
      fontSize: 15,
      color: '#222',
    },
    sectionSubtitle: {
      fontFamily: theme.fonts.regular,
      fontSize: 13,
      color: '#777',
      marginTop: -4,
    },
    radioGroup: {
      gap: 2,
    },
    buttonWrapper: {
      marginTop: 8,
    },
})