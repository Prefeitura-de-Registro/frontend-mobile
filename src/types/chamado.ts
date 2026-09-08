export type StatusChamado = 'aberto' | 'em_atendimento' | 'concluido';
export type PrioridadeChamado = 'urgente' | 'medio' | 'normal';
export type TipoOcorrencia = 'buraco' | 'iluminacao_publica' | 'poda_arvore' | 'vazamento';

export interface Chamado {
  id: string;               // "2026-00001"
  titulo: string;           // "Buraco"
  tipo: TipoOcorrencia;
  status: StatusChamado;
  prioridade: PrioridadeChamado;
  endereco: string;
  slaLabel: string;         // "SLA 8h", "SLA 2 dias"
  criadoEm: string;
  descricao: string;
  fotos?: string[];
}
