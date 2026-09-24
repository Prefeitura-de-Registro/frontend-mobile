import type { Chamado, PrioridadeChamado, StatusChamado, TipoOcorrencia } from '@/types/chamado';
import type { TicketDetalhe, TicketResumo } from '@/types/ticket';

/**
 * Ponte entre o formato que o backend devolve (Ticket) e o formato que as
 * telas/componentes deste app já esperam (Chamado). Alguns campos aqui são
 * "melhor esforço" porque o backend ainda não tem informação equivalente —
 * estão marcados com TODO. Ajuste aqui quando o backend evoluir, em vez de
 * espalhar essa lógica pelas telas.
 */

const STATUS_MAP: Record<TicketResumo['status'], StatusChamado> = {
  aberto: 'aberto',
  em_analise: 'aberto',
  em_andamento: 'em_atendimento',
  pendente: 'em_atendimento',
  resolvido: 'concluido',
  fechado: 'concluido',
};

const PRIORIDADE_MAP: Record<TicketResumo['prioridade'], PrioridadeChamado> = {
  normal: 'normal',
  urgente: 'urgente',
};

// TODO(backend): não existe uma "categoria -> tipo de ocorrência" estável no
// backend hoje (Categoria.nome é texto livre cadastrado no banco). Isso aqui
// é um heurístico por palavra-chave só pra não quebrar o ícone/filtro por
// tipo na tela. O ideal é o backend padronizar um slug em Categoria, ou o
// front trocar TipoOcorrencia por string livre e buscar categorias via API.
function inferirTipoOcorrencia(nomeCategoria: string): TipoOcorrencia {
  const nome = nomeCategoria.toLowerCase();

  if (nome.includes('buraco')) return 'buraco';
  if (nome.includes('ilumina')) return 'iluminacao_publica';
  if (nome.includes('poda') || nome.includes('árvore') || nome.includes('arvore')) return 'poda_arvore';
  if (nome.includes('vazamento') || nome.includes('água') || nome.includes('agua')) return 'vazamento';

  return 'buraco'; // fallback só pra não travar a UI quando não reconhecer o nome
}

function formatarData(iso: string): string {
  const data = new Date(iso);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// TODO(backend): SLA calculado só a partir do prazo de resolução em minutos,
// sem saber se o relógio já está correndo, pausado etc. Se o backend expuser
// um "tempo restante" pronto no futuro, troque por ele aqui.
function formatarSlaLabel(prazoResolucaoMinutos: number): string {
  if (prazoResolucaoMinutos < 60) {
    return `SLA ${prazoResolucaoMinutos}min`;
  }

  const horas = prazoResolucaoMinutos / 60;

  if (horas < 24) {
    return `SLA ${Math.round(horas)}h`;
  }

  const dias = Math.round(horas / 24);
  return `SLA ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
}

function temArquivos(ticket: TicketResumo | TicketDetalhe): ticket is TicketDetalhe {
  return 'arquivos' in ticket;
}

export function mapTicketToChamado(ticket: TicketResumo | TicketDetalhe): Chamado {
  const fotos = temArquivos(ticket) ? ticket.arquivos.map((arquivo) => arquivo.path) : undefined;

  return {
    id: String(ticket.id),
    titulo: ticket.categoria.nome,
    tipo: inferirTipoOcorrencia(ticket.categoria.nome),
    status: STATUS_MAP[ticket.status],
    prioridade: PRIORIDADE_MAP[ticket.prioridade],
    // TODO(backend): Ticket não tem um campo de endereço em texto hoje (só
    // `geom`, que nem o backend está lendo ainda). Ajustar quando existir.
    endereco: 'Endereço não disponível',
    slaLabel: formatarSlaLabel(ticket.prazoResolucaoMinutos),
    criadoEm: formatarData(ticket.createdAt),
    descricao: ticket.descricao ?? '',
    // TODO(backend): não existe rota servindo o arquivo estático ainda, só
    // o "path" cru salvo no banco — abrir a foto não vai funcionar até
    // existir uma URL pública/assinada pra cada arquivo.
    fotos: fotos && fotos.length > 0 ? fotos : undefined,
  };
}
