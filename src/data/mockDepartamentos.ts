
import type { TipoOcorrencia } from '@/types/chamado';
import type { TicketDepartamento } from '@/types/ticket';

// Mock local alinhado aos departamentos existentes no banco.
// Os IDs devem permanecer iguais aos registros reais do backend.
export const mockDepartamentos: TicketDepartamento[] = [
  {
    id: 1,
    nome: 'Vias e Pavimentação',
  },
  {
    id: 2,
    nome: 'Poda e Arborização Urbana',
  },
  {
    id: 3,
    nome: 'Bueiros e Drenagem',
  },
];

// Sugestão de departamento por tipo de ocorrência.
// A associação de iluminação é provisória, pois não há
// um departamento específico de iluminação no cadastro apresentado.
export const departamentoSugeridoPorTipo: Partial<
  Record<TipoOcorrencia, number>
> = {
  buraco: 1,
  poda_arvore: 2,
  iluminacao_publica: 1,
  vazamento: 3,
};