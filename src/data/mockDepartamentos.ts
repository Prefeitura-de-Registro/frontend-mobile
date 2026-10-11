import type { TipoOcorrencia } from '@/types/chamado';
import type { TicketDepartamento } from '@/types/ticket';

// TODO(integração): dados provisórios. Os ids abaixo NÃO existem no backend;
// trocar pela listagem real de departamentos quando a rota estiver disponível.
export const mockDepartamentos: TicketDepartamento[] = [
  { id: 1, nome: 'Departamento de Obras' },
  { id: 2, nome: 'Departamento de Meio Ambiente' },
  { id: 3, nome: 'Departamento de Iluminação Pública' },
  { id: 4, nome: 'Departamento de Água e Esgoto' },
  { id: 5, nome: 'Departamento de Educação' },
];

// Departamento sugerido por tipo de ocorrência (mostrado com "(sugestão)").
export const departamentoSugeridoPorTipo: Record<TipoOcorrencia, number> = {
  buraco: 1,
  poda_arvore: 2,
  iluminacao_publica: 3,
  vazamento: 4,
};
