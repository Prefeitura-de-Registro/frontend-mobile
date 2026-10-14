import { HeaderNavigationContent } from '@/components/molecules/HeaderNavigationContent';
import { ComunicacaoChat } from '@/components/organisms/ComunicacaoChat';
import {
  EncerrarSolicitacaoModal,
  ResultadoEncerramento,
} from '@/components/organisms/EncerrarSolicitacaoModal';
import { theme } from '@/constants';
import { api } from '@/services/api';
import { buscarTicketPorId, listarSolicitacoes } from '@/services/tickets.service';
import { Mensagem } from '@/types/mensagem';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CalendarDays, ExternalLink, Image as ImageIcon, Send } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Aba = 'detalhes' | 'comunicacao';
type Tipo = 'enviadas' | 'recebidas';
type Status = 'nova' | 'pendente' | 'em_analise' | 'em_atendimento' | 'andamento' | 'aprovada' | 'respondida' | 'recusada';

const SETORES_AVATAR = [
  { sigla: 'DO', bg: theme.colors.primary, text: '#FFFFFF' },
  { sigla: 'DE', bg: '#FFC20E', text: '#000000' },
];

const MOCKS: any = {
  recebidas: {
    solicitacao: {
      titulo: 'Iluminação Pública (Mock)',
      protocolo: '#2026-00005',
      status: 'nova',
      destino: 'Departamento de Iluminação Pública',
      descricao: 'Durante a vistoria foi identificada uma estrutura de concreto danificada pela queda da árvore. Solicito a remoção.',
      anexos: [{ id: 'a1' }, { id: 'a2' }],
      solicitadoEm: '10/09/2026 às 10h40',
      setores: SETORES_AVATAR,
    },
    meuSetor: { id: 'iluminacao', nome: 'Departamento de Iluminação Pública' },
    mensagens: [
      {
        id: 'r1',
        setorId: 'obras',
        setorNome: 'Departamento de Obras',
        texto: 'Durante a vistoria foi identificada uma estrutura de concreto danificada pela queda da árvore. Solicito a remoção.',
        qtdAnexos: 2,
        criadoEm: '2026-09-10T10:40:00',
      },
    ],
  },
};

const STATUS_MAP: Record<string, { label: string; bg: string; dot: string; text: string }> = {
  nova: { label: 'nova', bg: '#B9E6FE', dot: theme.colors.primary, text: theme.colors.primary },
  pendente: { label: 'pendente', bg: '#B9E6FE', dot: theme.colors.primary, text: theme.colors.primary },
  em_analise: { label: 'em análise', bg: '#B9E6FE', dot: theme.colors.primary, text: theme.colors.primary },
  em_atendimento: { label: 'em atendimento', bg: '#B9E6FE', dot: theme.colors.primary, text: theme.colors.primary },
  andamento: { label: 'andamento', bg: '#B9E6FE', dot: theme.colors.primary, text: theme.colors.primary },
  aprovada: { label: 'aprovada', bg: '#D1FAE5', dot: '#22C997', text: '#16A37A' },
  respondida: { label: 'respondida', bg: '#D1FAE5', dot: '#22C997', text: '#16A37A' },
  recusada: { label: 'recusada', bg: '#FCB5B5', dot: theme.colors.danger, text: theme.colors.danger },
};

export default function DetalhesSolicitacaoScreen() {
  const router = useRouter();
  const { id, ticketId, tipo } = useLocalSearchParams<{ id: string; ticketId?: string; tipo?: string }>();
  const tipoAtual: Tipo = tipo === 'recebidas' ? 'recebidas' : 'enviadas';

  // Recebidas ainda usam mock: o valor ja entra nos estados iniciais (sem setState dentro do effect)
  const mock = tipoAtual === 'recebidas' ? MOCKS.recebidas : null;

  const [loading, setLoading] = useState(!mock);
  const [solicitacao, setSolicitacao] = useState<any>(mock?.solicitacao ?? null);
  const [status, setStatus] = useState<Status>(mock?.solicitacao.status ?? 'nova');
  const [mensagens, setMensagens] = useState<Mensagem[]>(mock?.mensagens ?? []);
  const [aba, setAba] = useState<Aba>('detalhes');
  const [encerrarVisivel, setEncerrarVisivel] = useState(false);

  useEffect(() => {
    if (tipoAtual === 'recebidas') return;

    async function fetchDetalhes() {
      try {
        if (!ticketId) return;
        
        // Busca ticket e solicitações simultaneamente para a tela de detalhes
        const ticket = await buscarTicketPorId(Number(ticketId));
        const sols = await listarSolicitacoes(Number(ticketId));
        const solReal = sols.find((s: any) => String(s.id) === id);

        if (solReal) {
          const siglaOrigem = ticket.departamento?.nome ? ticket.departamento.nome.substring(0, 2).toUpperCase() : 'OR';
          const siglaDestino = solReal.departamentoSolicitado?.nome ? solReal.departamentoSolicitado.nome.substring(0, 2).toUpperCase() : 'DE';

          setSolicitacao({
            titulo: ticket.categoria?.nome || `Ticket #${ticket.id}`,
            protocolo: `TKT-${ticket.id}`,
            status: solReal.status,
            destino: solReal.departamentoSolicitado?.nome || 'Departamento Solicitado',
            descricao: solReal.descricao,
            anexos: [], 
            solicitadoEm: new Date(solReal.createdAt).toLocaleString('pt-BR'),
            setores: [
              { sigla: siglaOrigem, bg: theme.colors.primary, text: '#FFFFFF' },
              { sigla: siglaDestino, bg: '#FFC20E', text: '#000000' }
            ]
          });
          
          setStatus(solReal.status);
          setMensagens([]); 
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes da solicitação real:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDetalhes();
  }, [id, ticketId, tipoAtual]);

  if (loading || !solicitacao) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const s = STATUS_MAP[status] || STATUS_MAP['nova'];
  const encerrada = status === 'respondida' || status === 'recusada' || status === 'aprovada';

  const acao =
    tipoAtual === 'recebidas'
      ? { label: 'Responder Solicitação', preenchido: true }
      : { label: 'Visualizar status', preenchido: false };

  function enviarMensagem(texto: string) {
    setMensagens((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        setorId: 'meu_setor',
        setorNome: 'Meu Departamento',
        texto,
        qtdAnexos: 0,
        criadoEm: new Date().toISOString(),
      },
    ]);
  }

  async function encerrarSolicitacao(resultado: ResultadoEncerramento) {
    const statusBackend = resultado === 'aprovada' ? 'respondida' : 'recusada';
    await api.patch(`/api/solicitacoes/${id}`, {
      status: statusBackend,
      resposta: "Parecer finalizado via aplicativo mobile."
    });
    setStatus(statusBackend as Status);
  }

  return (
    <View style={styles.container}>
      <HeaderNavigationContent title="Solicitações" onPressBack={() => router.back()} />
      
      <View style={styles.summary}>
        <View style={styles.summaryTop}>
          <View style={styles.summaryTitleBox}>
            <Text style={styles.summaryTitle}>{solicitacao.titulo}</Text>
            <Text style={styles.summaryProtocol}>{solicitacao.protocolo}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: s.bg }]}>
            <View style={[styles.chipDot, { backgroundColor: s.dot }]} />
            <Text style={[styles.chipText, { color: s.text }]}>{s.label}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.originalButton} activeOpacity={0.8}>
          <ExternalLink size={18} color={theme.colors.primary} />
          <Text style={styles.originalButtonText}>Ver chamado original</Text>
        </TouchableOpacity>
        
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, aba === 'detalhes' && styles.tabActive]}
            onPress={() => setAba('detalhes')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, aba === 'detalhes' && styles.tabTextActive]}>Detalhes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, aba === 'comunicacao' && styles.tabActive]}
            onPress={() => setAba('comunicacao')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, aba === 'comunicacao' && styles.tabTextActive]}>
              Comunicação
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {aba === 'detalhes' ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.destinoRow}>
              <View style={styles.destinoIcon}>
                <Send size={22} color={theme.colors.primary} />
              </View>
              <View style={styles.destinoTextos}>
                <Text style={styles.sectionTitle}>Enviado para</Text>
                <Text style={styles.destinoNome}>{solicitacao.destino}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.descricao}>{solicitacao.descricao}</Text>
            
            <Text style={[styles.sectionTitle, styles.anexosTitle]}>Anexos</Text>
            <View style={styles.anexosRow}>
              {solicitacao.anexos.map((a: any) => (
                <View key={a.id} style={styles.thumb}>
                  <ImageIcon size={24} color="#FFFFFF" />
                </View>
              ))}
            </View>
            <Text style={styles.anexosCount}>{solicitacao.anexos.length} arquivo(s) anexados</Text>
            
            <View style={styles.dateRow}>
              <CalendarDays size={14} color={theme.colors.primary} />
              <Text style={styles.dateText}>Solicitado em {solicitacao.solicitadoEm}</Text>
            </View>
            
            <View style={styles.avatars}>
              {solicitacao.setores.map((setor: any, i: number) => (
                <View
                  key={setor.sigla}
                  style={[styles.avatar, { backgroundColor: setor.bg }, i > 0 && styles.avatarOverlap]}
                >
                  <Text style={[styles.avatarText, { color: setor.text }]}>{setor.sigla}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {!encerrada && tipoAtual === 'recebidas' && (
            <TouchableOpacity
              style={[styles.acaoButton, acao.preenchido ? styles.acaoPreenchido : styles.acaoContorno]}
              onPress={() => setEncerrarVisivel(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.acaoText, acao.preenchido && styles.acaoTextPreenchido]}>
                {acao.label}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      ) : (
        <ComunicacaoChat mensagens={mensagens} meuSetorId="meu_setor" onEnviar={enviarMensagem} />
      )}

      <EncerrarSolicitacaoModal
        visible={encerrarVisivel}
        titulo={solicitacao.titulo}
        protocolo={solicitacao.protocolo}
        onClose={() => setEncerrarVisivel(false)}
        onEncerrar={encerrarSolicitacao}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2' },
  summary: { backgroundColor: '#DFE7F0', paddingTop: 20, gap: 14 },
  summaryTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 16 },
  summaryTitleBox: { flex: 1 },
  summaryTitle: { fontFamily: theme.fonts.bold, fontSize: 20, color: theme.colors.primary },
  summaryProtocol: { fontFamily: theme.fonts.regular, fontSize: 16, color: '#000000' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  chipDot: { width: 12, height: 12, borderRadius: 6 },
  chipText: { fontFamily: theme.fonts.regular, fontSize: 13 },
  originalButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 40, marginHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: '#FFFFFF' },
  originalButtonText: { fontFamily: theme.fonts.regular, fontSize: 14, color: theme.colors.primary },
  tabs: { flexDirection: 'row', marginHorizontal: 16 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: theme.colors.primary },
  tabText: { fontFamily: theme.fonts.regular, fontSize: 16, color: '#000000' },
  tabTextActive: { color: theme.colors.primary },
  content: { padding: 24, paddingBottom: 40 },
  card: { padding: 24, borderRadius: 20, backgroundColor: '#FFFFFF', elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 3 } },
  destinoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  destinoIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#B9E6FE', alignItems: 'center', justifyContent: 'center' },
  destinoTextos: { flex: 1 },
  destinoNome: { fontFamily: theme.fonts.regular, fontSize: 16, color: '#000000' },
  divider: { height: 1, backgroundColor: '#D9D9D9', marginVertical: 16, marginHorizontal: 8 },
  sectionTitle: { fontFamily: theme.fonts.bold, fontSize: 16, color: theme.colors.primary },
  descricao: { fontFamily: theme.fonts.regular, fontSize: 15, lineHeight: 24, color: '#000000', textAlign: 'justify', marginTop: 8 },
  anexosTitle: { marginTop: 20 },
  anexosRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  thumb: { width: 106, height: 86, borderRadius: 6, backgroundColor: '#6B7F5E', alignItems: 'center', justifyContent: 'center' },
  anexosCount: { fontFamily: theme.fonts.regular, fontSize: 11, color: '#000000', marginTop: 10 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  dateText: { fontFamily: theme.fonts.regular, fontSize: 12, color: '#000000' },
  avatars: { flexDirection: 'row', marginTop: 14 },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarOverlap: { marginLeft: -6 },
  avatarText: { fontFamily: theme.fonts.bold, fontSize: 11 },
  acaoButton: { alignSelf: 'center', minWidth: 226, height: 40, marginTop: 20, paddingHorizontal: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  acaoPreenchido: { backgroundColor: theme.colors.primary },
  acaoContorno: { borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: 'transparent' },
  acaoText: { fontFamily: theme.fonts.regular, fontSize: 15, color: theme.colors.primary },
  acaoTextPreenchido: { color: '#FFFFFF' },
});