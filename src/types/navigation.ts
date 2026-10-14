import type { StatusChamado, TipoOcorrencia } from './chamado';

/**
 * Parâmetros da rota `/detalhes_chamado`. É o único lugar onde esse contrato
 * é descrito: as telas de origem (lista de chamados, card do mapa, toque em
 * notificação) só precisam importar este tipo e navegar.
 *
 * Só o `id` é obrigatório — a notificação, por exemplo, traz apenas o número
 * do chamado. Os demais são opcionais e servem para a tela já mostrar algo
 * enquanto o restante (data, descrição, anexos, coordenadas) carrega da API.
 *
 * Exemplo:
 *   router.push({
 *     pathname: '/detalhes_chamado',
 *     params: { id: chamado.id, tipo: chamado.tipo, status: chamado.status },
 *   });
 */
export type DetalhesChamadoParams = {
  /** Obrigatório. Identificador do chamado. */
  id: string;
  /** Ex.: "#2026-00001". */
  protocolo?: string;
  tipo?: TipoOcorrencia;
  status?: StatusChamado;
  /** Tempo/SLA já formatado, ex.: "SLA 8h". */
  sla?: string;
  endereco?: string;
};
