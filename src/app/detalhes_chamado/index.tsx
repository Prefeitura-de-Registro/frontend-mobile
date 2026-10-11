import { AnexosChip } from '@/components/atoms/AnexosChip';
import { SecondaryButton } from '@/components/atoms/SecondaryButton';
import { StatusPill } from '@/components/atoms/StatusPill';
import { TipoOcorrenciaIcon } from '@/components/atoms/TipoOcorrenciaIcon';
import { HeaderDetalhesChamado } from '@/components/molecules/HeaderDetalhesChamado';
import { MapaOcorrencia } from '@/components/molecules/MapaOcorrencia';
import { ProtocoloCopiavel } from '@/components/molecules/ProtocoloCopiavel';
import { ActionButtonGroup } from '@/components/organisms/ActionButtonGroup';
import { SolicitacaoSucessoModal } from '@/components/organisms/SolicitacaoSucessoModal';
import {
  SolicitarAtendimentoModal,
  type SolicitacaoAtendimento,
} from '@/components/organisms/SolicitarAtendimentoModal';
import { theme } from '@/constants';
import { departamentoSugeridoPorTipo } from '@/data/mockDepartamentos';
import { assumirTicket } from '@/services/tickets.service';
import type { Chamado, Coordenadas } from '@/types/chamado';
import type { DetalhesChamadoParams } from '@/types/navigation';
import {
  TIPO_OCORRENCIA_LABEL,
  extrairTempo,
  idParaNumero,
  lerParametrosDetalhes,
} from '@/utils/detalhes-chamado';
import { mapTicketToChamado } from '@/utils/ticket-mapper';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type EstadoCarga = 'carregando' | 'pronto' | 'erro' | 'nao_encontrado';

// TODO(integração): o backend ainda não devolve a localização do chamado.
// Enquanto isso o pin cai no centro de Registro-SP, só para a tela poder ser
// validada contra o Figma. Remover quando `chamado.coordenadas` vier da API.
const COORDENADAS_PLACEHOLDER: Coordenadas = { latitude: -24.4879, longitude: -47.8441 };

const ATRASO_MODAL_SUCESSO_MS = 350;

export default function DetalhesChamadoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<DetalhesChamadoParams>();

  // Dados que chegam pela navegação (só o id é garantido) e id numérico da API.
  const preview = lerParametrosDetalhes(params);
  const idNumerico = idParaNumero(preview.id);

  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [estado, setEstado] = useState<EstadoCarga>('carregando');
  const [tentativa, setTentativa] = useState(0);
  const [assumindo, setAssumindo] = useState(false);

  const [solicitarVisivel, setSolicitarVisivel] = useState(false);
  const [sucessoVisivel, setSucessoVisivel] = useState(false);
  const [departamentoSolicitado, setDepartamentoSolicitado] = useState<string>();
  const timerSucesso = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (idNumerico === null) return;

    // 🚨 MOCK TEMPORÁRIO PARA VER O DESIGN DA TELA 🚨
    // Como estamos a focar no UI, injetamos os dados idênticos ao Figma
    // para contornar o erro de "Chamado não encontrado" da API.
    setChamado({
      id: String(idNumerico),
      tipo: 'buraco',
      titulo: 'Buraco',
      descricao: 'Buraco grande, oferecendo riscos de quedas.',
      status: 'aberto',
      slaLabel: '8h',
      criadoEm: '28/08/2026',
      protocolo: '#2026-00001',
      coordenadas: COORDENADAS_PLACEHOLDER,
      fotos: ['anexo1.jpg', 'anexo2.jpg'] // Array com 2 itens para forçar o chip "2 anexo(s)"
    } as any);

    setEstado('pronto');
    return;

    /* 👇 CÓDIGO DA API ORIGINAL COMENTADO (Para ativar na sub-issue de integração)
    let cancelado = false;

    buscarTicketPorId(idNumerico)
      .then((ticket) => {
        if (cancelado) return;
        setChamado(mapTicketToChamado(ticket));
        setEstado('pronto');
      })
      .catch((error) => {
        if (cancelado) return;
        console.error('[detalhes_chamado] erro ao buscar ticket', error);
        const naoEncontrado = isAxiosError(error) && error.response?.status === 404;
        setEstado(naoEncontrado ? 'nao_encontrado' : 'erro');
      });

    return () => {
      cancelado = true;
    };
    */
  }, [idNumerico, tentativa]);

  useEffect(() => {
    return () => {
      if (timerSucesso.current) clearTimeout(timerSucesso.current);
    };
  }, []);

  // Só vale o chamado carregado se for o mesmo da rota (a tela pode ser
  // reaproveitada com outro id, ex.: toque em notificação).
  const chamadoAtual = chamado && chamado.id === String(idNumerico) ? chamado : null;
  const estadoAtual: EstadoCarga =
    idNumerico === null
      ? 'nao_encontrado'
      : estado === 'pronto' && !chamadoAtual
        ? 'carregando'
        : estado;

  const tipo = chamadoAtual?.tipo ?? preview.tipo;
  const titulo =
    chamadoAtual?.titulo ?? (preview.tipo ? TIPO_OCORRENCIA_LABEL[preview.tipo] : undefined);
  const status = chamadoAtual?.status ?? preview.status;
  const tempo = extrairTempo(chamadoAtual?.slaLabel ?? preview.sla);
  const protocolo = preview.protocolo ?? (chamadoAtual ? `#${chamadoAtual.id}` : undefined);
  const totalAnexos = chamadoAtual?.fotos?.length ?? 0;

  function tentarNovamente() {
    setEstado('carregando');
    setTentativa((t) => t + 1);
  }

  async function handleAtender() {
    if (idNumerico === null || assumindo) return;

    setAssumindo(true);

    try {
      const ticketAtualizado = await assumirTicket(idNumerico);
      setChamado(mapTicketToChamado(ticketAtualizado));
    } catch (error) {
      console.error('[detalhes_chamado] erro ao assumir ticket', error);
      Alert.alert('Não foi possível atender o chamado', 'Tente novamente em instantes.');
    } finally {
      setAssumindo(false);
    }
  }

  function handleFinalizar() {
    if (!chamadoAtual) return;

    router.push({
      pathname: '/finalizar_atendimento',
      params: {
        id: chamadoAtual.id,
        protocolo: protocolo ?? `#${chamadoAtual.id}`,
        tipoOcorrencia: chamadoAtual.tipo,
      },
    });
  }

  function handleSolicitar(solicitacao: SolicitacaoAtendimento) {
    // TODO(integração): chamar `criarSolicitacao(id, ...)` aqui e só mostrar o
    // sucesso quando a API responder. Por enquanto o envio é apenas visual.
    setSolicitarVisivel(false);
    setDepartamentoSolicitado(solicitacao.departamento.nome);

    // No iOS não dá para abrir um Modal enquanto o outro ainda está fechando.
    timerSucesso.current = setTimeout(() => setSucessoVisivel(true), ATRASO_MODAL_SUCESSO_MS);
  }

  const temDadosParciais = Boolean(titulo || protocolo);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topo}>
          <HeaderDetalhesChamado onPressBack={() => router.back()} />

          {estadoAtual === 'nao_encontrado' && (
            <Mensagem
              titulo="Chamado não encontrado"
              texto="Ele pode ter sido removido ou o número informado está incorreto."
              acao="Voltar"
              onAcao={() => router.back()}
            />
          )}

          {estadoAtual === 'erro' && (
            <Mensagem
              titulo="Não foi possível carregar esse chamado"
              texto="Verifique sua conexão e tente novamente."
              acao="Tentar novamente"
              onAcao={tentarNovamente}
            />
          )}

          {estadoAtual === 'carregando' && !temDadosParciais && (
            <View style={styles.carregandoTela}>
              <ActivityIndicator color={theme.colors.primary} size="large" />
            </View>
          )}

          {(estadoAtual === 'pronto' || (estadoAtual === 'carregando' && temDadosParciais)) && (
            <View style={styles.info}>
              <View style={styles.identificacao}>
                <View style={styles.identificacaoTexto}>
                  <Text style={styles.titulo} numberOfLines={2}>
                    {titulo ?? ''}
                  </Text>
                  {protocolo && (
                    <View style={styles.protocolo}>
                      <ProtocoloCopiavel protocolo={protocolo} />
                    </View>
                  )}
                </View>
                {tipo && <TipoOcorrenciaIcon tipo={tipo} />}
              </View>

              <View style={styles.linha}>
                <Text style={styles.rotulo}>Criado em:</Text>
                <Text style={styles.valor}>{chamadoAtual?.criadoEm ?? '—'}</Text>
              </View>

              <View style={[styles.linha, styles.linhaStatus]}>
                <Text style={styles.rotulo}>Status:</Text>
                {status && <StatusPill status={status} />}
                {tempo && (
                  <View style={styles.tempo}>
                    <Ionicons name="time" size={20} color="#FF8C00" />
                    <Text style={styles.tempoTexto}>{tempo}</Text>
                  </View>
                )}
              </View>

              <Text style={[styles.rotulo, styles.rotuloDetalhes]}>Detalhes:</Text>
              <View style={styles.caixaDetalhes}>
                {chamadoAtual ? (
                  <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
                    <Text
                      style={[styles.detalhesTexto, !chamadoAtual.descricao && styles.semDescricao]}
                    >
                      {chamadoAtual.descricao || 'Nenhuma descrição informada.'}
                    </Text>
                  </ScrollView>
                ) : (
                  <ActivityIndicator color={theme.colors.primary} />
                )}
              </View>

              {totalAnexos > 0 && (
                <View style={styles.anexos}>
                  <AnexosChip total={totalAnexos} />
                </View>
              )}
            </View>
          )}
        </View>

        {estadoAtual === 'pronto' && chamadoAtual && (
          <>
            <MapaOcorrencia coordenadas={chamadoAtual.coordenadas ?? COORDENADAS_PLACEHOLDER} />

            <View style={[styles.acoes, { paddingBottom: insets.bottom + 32 }]}>
              <View style={styles.acoesBotoes}>
                <ActionButtonGroup
                  status={chamadoAtual.status}
                  labelTransferir="Solicitar atendimento"
                  onTransferir={() => setSolicitarVisivel(true)}
                  onAtender={handleAtender}
                  atendendo={assumindo}
                  onFinalizar={handleFinalizar}
                />
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <SolicitarAtendimentoModal
        visible={solicitarVisivel}
        onClose={() => setSolicitarVisivel(false)}
        onSubmit={handleSolicitar}
        departamentoSugeridoId={tipo ? departamentoSugeridoPorTipo[tipo] : undefined}
      />

      <SolicitacaoSucessoModal
        visible={sucessoVisivel}
        onClose={() => setSucessoVisivel(false)}
        departamentoNome={departamentoSolicitado}
      />
    </View>
  );
}

interface MensagemProps {
  titulo: string;
  texto: string;
  acao: string;
  onAcao: () => void;
}

function Mensagem({ titulo, texto, acao, onAcao }: MensagemProps) {
  return (
    <View style={styles.mensagem}>
      <Text style={styles.mensagemTitulo}>{titulo}</Text>
      <Text style={styles.mensagemTexto}>{texto}</Text>
      <View style={styles.mensagemAcao}>
        <SecondaryButton label={acao} onPress={onAcao} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.tertiary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topo: {
    backgroundColor: theme.colors.background,
  },
  info: {
    paddingHorizontal: 26,
    paddingTop: 40,
    paddingBottom: 26,
  },
  identificacao: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  identificacaoTexto: {
    flex: 1,
  },
  titulo: {
    fontFamily: theme.fonts.bold,
    fontSize: 28,
    lineHeight: 34,
    color: theme.colors.primary,
  },
  protocolo: {
    marginTop: 6,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  linhaStatus: {
    marginTop: 16,
  },
  rotulo: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.primary,
  },
  rotuloDetalhes: {
    marginTop: 18,
    marginBottom: 8,
  },
  valor: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: '#111111',
  },
  tempo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 12,
  },
  tempoTexto: {
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: '#333333',
  },
  caixaDetalhes: {
    height: 121,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3E7EC',
    backgroundColor: '#F8FAFC',
  },
  detalhesTexto: {
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: '#666666',
  },
  semDescricao: {
    fontStyle: 'italic',
    color: '#999999',
  },
  anexos: {
    marginTop: 20,
    marginLeft: 10,
  },
  acoes: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 34,
    backgroundColor: theme.colors.tertiary,
  },
  acoesBotoes: {
    width: '100%',
    maxWidth: 210,
  },
  carregandoTela: {
    paddingVertical: 80,
  },
  mensagem: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 56,
  },
  mensagemTitulo: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  mensagemTexto: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  mensagemAcao: {
    width: '100%',
    maxWidth: 210,
    marginTop: 24,
  },
});