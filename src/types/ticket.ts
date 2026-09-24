// Tipos que espelham o formato de resposta do backend (Ticket), diferente
// do tipo `Chamado` que as telas/componentes deste app já usam. A ponte
// entre os dois fica em `src/utils/ticket-mapper.ts`.

export type TicketStatus = 'aberto' | 'em_analise' | 'em_andamento' | 'pendente' | 'resolvido' | 'fechado';

export type TicketPrioridade = 'normal' | 'urgente';

export interface TicketCategoria {
  id: number;
  nome: string;
}

export interface TicketDepartamento {
  id: number;
  nome: string;
}

export interface TicketFuncionario {
  id: number;
  name: string | null;
  email: string | null;
}

export interface TicketArquivo {
  id: number;
  path: string;
  tipo: string | null;
}

export interface TicketHistoricoItem {
  id: number;
  tipoEvento: string;
  status: TicketStatus | null;
  prazoMinutos: number | null;
  texto: string | null;
  createdAt: string;
  usuario: { id: number; name: string | null } | null;
}

export interface TicketSolicitacao {
  id: number;
  status: string;
  descricao: string;
  resposta: string | null;
  createdAt: string;
  departamentoSolicitado: TicketDepartamento;
}

// Formato devolvido pelo GET /api/tickets (item da fila)
export interface TicketResumo {
  id: number;
  idUsuario: number;
  idCategoria: number;
  idDepartamento: number;
  idFuncionarioResponsavel: number | null;
  status: TicketStatus;
  prioridade: TicketPrioridade;
  descricao: string | null;
  prazoPrimeiraRespostaMinutos: number;
  prazoResolucaoMinutos: number;
  createdAt: string;
  categoria: TicketCategoria;
  departamento: TicketDepartamento;
  funcionarioResponsavel: TicketFuncionario | null;
}

// Formato devolvido pelo GET /api/tickets/:id (detalhe completo)
export interface TicketDetalhe extends TicketResumo {
  historicos: TicketHistoricoItem[];
  solicitacoes: TicketSolicitacao[];
  arquivos: TicketArquivo[];
}

export interface TicketListResponse {
  data: TicketResumo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TicketListParams {
  page?: number;
  limit?: number;
  status?: TicketStatus;
  prioridade?: TicketPrioridade;
  idDepartamento?: number;
  busca?: string;
}
