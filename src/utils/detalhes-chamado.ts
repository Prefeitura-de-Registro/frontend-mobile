import type { StatusChamado, TipoOcorrencia } from '@/types/chamado';

/**
 * Helpers da tela de Detalhes do Chamado: leitura segura dos parâmetros da
 * rota (tipados em `@/types/navigation`) e pequenos formatadores.
 */

export const TIPO_OCORRENCIA_LABEL: Record<TipoOcorrencia, string> = {
  buraco: 'Buraco',
  iluminacao_publica: 'Iluminação Pública',
  poda_arvore: 'Poda de Árvore',
  vazamento: 'Vazamento',
};

const TIPOS_VALIDOS: readonly string[] = Object.keys(TIPO_OCORRENCIA_LABEL);
const STATUS_VALIDOS: readonly string[] = ['aberto', 'em_atendimento', 'concluido'];

type ParametroBruto = string | string[] | undefined;

// Parâmetros de rota chegam como texto (URL / notificação) e podem vir
// repetidos; por isso nada é confiado antes de validar.
function primeiroValor(valor: ParametroBruto): string | undefined {
  const texto = (Array.isArray(valor) ? valor[0] : valor)?.trim();
  return texto ? texto : undefined;
}

export interface DetalhesChamadoPreview {
  id?: string;
  protocolo?: string;
  tipo?: TipoOcorrencia;
  status?: StatusChamado;
  sla?: string;
  endereco?: string;
}

export function lerParametrosDetalhes(
  params: Record<string, ParametroBruto>,
): DetalhesChamadoPreview {
  const tipo = primeiroValor(params.tipo);
  const status = primeiroValor(params.status);
  const protocolo = primeiroValor(params.protocolo);

  return {
    id: primeiroValor(params.id),
    protocolo: protocolo && !protocolo.startsWith('#') ? `#${protocolo}` : protocolo,
    tipo: tipo && TIPOS_VALIDOS.includes(tipo) ? (tipo as TipoOcorrencia) : undefined,
    status: status && STATUS_VALIDOS.includes(status) ? (status as StatusChamado) : undefined,
    sla: primeiroValor(params.sla),
    endereco: primeiroValor(params.endereco),
  };
}

/** A API só aceita ids numéricos; qualquer outra coisa é "não encontrado". */
export function idParaNumero(id?: string): number | null {
  if (!id || !/^\d+$/.test(id)) return null;
  const numero = Number(id);
  return numero > 0 ? numero : null;
}

/** "SLA 8h" -> "8h" (o design mostra só o tempo ao lado do relógio). */
export function extrairTempo(slaLabel?: string): string | undefined {
  return slaLabel?.replace(/^SLA\s+/i, '');
}
