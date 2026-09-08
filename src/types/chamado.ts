export type StatusChamado = 'aberto' | 'em_atendimento' | 'concluido';
export type PrioridadeChamado = 'urgente' | 'medio' | 'normal';
export type TipoOcorrencia = 'buraco' | 'iluminacao_publica' | 'poda_arvore' | 'vazamento';

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
}
