import { HeaderBackground } from '@/components/molecules/HeaderBackground';
import { HeaderGreetingContent } from '@/components/molecules/HeaderGreetingContent';
import { SummaryStatCard } from '@/components/molecules/SummaryStatCard';
import { ChamadosList } from '@/components/organisms/ChamadosList';
import { FooterLogo } from '@/components/organisms/FooterLogo';
import { MapPreview } from '@/components/organisms/MapPreview';
import { theme } from '@/constants';
import { mockChamados } from '@/data/mockChamados';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// ajuste o caminho abaixo se o nome/local do arquivo for outro no seu projeto


export default function HomeOperadorScreen() {
  const router = useRouter();

  const abertos = mockChamados.filter((c) => c.status === 'aberto').length;
  const emAndamento = mockChamados.filter((c) => c.status === 'em_atendimento').length;
  const concluidos = mockChamados.filter((c) => c.status === 'concluido').length;
  const urgentes = mockChamados.filter((c) => c.prioridade === 'urgente');

  function irParaDetalhe(id: string) {
    router.push(`/chamados/${id}`);
  }

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <HeaderBackground height={180}>
        <HeaderGreetingContent
          userName="Carlos"
          role="Secretaria de Obras"
          avatarUri="https://i.pravatar.cc/100"
          onPressNotification={() => {
            // TODO: navegar pra tela de notificações
          }}
        />
      </HeaderBackground>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Chamados atribuídos a você</Text>
          <TouchableOpacity onPress={() => router.push('/chamados')}>
            <Text style={styles.verTodos}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <SummaryStatCard label="Abertos" value={abertos} color="#2ECC71" />
          <SummaryStatCard label="Andamento" value={emAndamento} color={theme.colors.primary} />
          <SummaryStatCard label="Concluídos" value={concluidos} color={theme.colors.danger} />
        </View>

        <Text style={styles.sectionTitle}>Urgentes</Text>
        <ChamadosList chamados={urgentes} onSelectChamado={irParaDetalhe} scrollEnabled={false} />

        <MapPreview
          onVerMapaCompleto={() => {
            // TODO: navegar pra tela de mapa completo
          }}
        />
      </View>
      <FooterLogo />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: '#222',
  },
  verTodos: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.primary,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
