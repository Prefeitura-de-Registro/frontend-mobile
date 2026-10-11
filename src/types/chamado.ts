export type StatusChamado = 'aberto' | 'em_atendimento' | 'concluido';
export type PrioridadeChamado = 'urgente' | 'medio' | 'normal';
export type TipoOcorrencia = 'buraco' | 'iluminacao_publica' | 'poda_arvore' | 'vazamento';

export interface Coordenadas {
  latitude: number;
  longitude: number;
}

export interface Chamado {
  id: string;
  titulo: string;
  tipo: TipoOcorrencia;
  status: StatusChamado;
  prioridade: PrioridadeChamado;
  endereco: string;
  slaLabel: string;
  criadoEm: string;
  descricao: string;
  fotos?: string[];
  // TODO(backend): o Ticket ainda não expõe a localização (só `geom`, que o
  // backend não lê). Quando existir, preencher em `ticket-mapper.ts`.
  coordenadas?: Coordenadas;
}
