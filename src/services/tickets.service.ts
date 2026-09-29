import { api } from './api';
import type { TicketDetalhe, TicketListParams, TicketListResponse } from '@/types/ticket';

export async function listarTickets(params: TicketListParams = {}): Promise<TicketListResponse> {
  const response = await api.get<TicketListResponse>('/api/tickets', { params });
  return response.data;
}

export async function buscarTicketPorId(id: number): Promise<TicketDetalhe> {
  const response = await api.get<TicketDetalhe>(`/api/tickets/${id}`);
  return response.data;
}

export async function assumirTicket(id: number): Promise<TicketDetalhe> {
  const response = await api.patch<TicketDetalhe>(`/api/tickets/${id}/assume`);
  return response.data;
}

export interface AtualizarTicketPayload {
  status?: TicketDetalhe['status'];
  prioridade?: TicketDetalhe['prioridade'];
  descricao?: string;
  prazoPrimeiraRespostaMinutos?: number;
  prazoResolucaoMinutos?: number;
  idFuncionarioResponsavel?: number | null;
}

export async function atualizarTicket(id: number, payload: AtualizarTicketPayload): Promise<TicketDetalhe> {
  const response = await api.patch<TicketDetalhe>(`/api/tickets/${id}`, payload);
  return response.data;
}

export interface CriarSolicitacaoPayload {
  idDepartamentoSolicitado: number;
  descricao: string;
}

export async function criarSolicitacao(id: number, payload: CriarSolicitacaoPayload) {
  const response = await api.post(`/api/tickets/${id}/solicitacoes`, payload);
  return response.data;
}

export async function listarSolicitacoes(id: number) {
  const response = await api.get(`/api/tickets/${id}/solicitacoes`);
  return response.data;
}
