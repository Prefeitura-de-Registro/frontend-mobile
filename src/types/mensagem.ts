export type Mensagem = {
  id: string;
  setorId: string;
  setorNome: string;
  texto: string;
  qtdAnexos: number;
  /** ISO 8601, ex: 2026-09-10T11:30:00 */
  criadoEm: string;
};
