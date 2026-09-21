# Release 17/09 - Squad Mobile (Operador)

Este documento contém as entregas da **Squad Mobile** referentes à release do dia **17 de setembro**, desenvolvidas para a disciplina de Laboratório de Práticas do curso de Desenvolvimento de Software Multiplataforma da FATEC Registro.

## Resumo da Entrega

Nesta release, focamos na implementação prática e na integração de ponta a ponta do aplicativo mobile voltado para o **Operador**, transpondo o design do Figma para o código real utilizando Expo Router, React Native e TypeScript.

As principais entregas foram divididas em duas frentes:

### 1. Arquitetura de Componentes e Design System

* **Padronização Visual:** Implementação de componentes atômicos e moleculares (como botões, badges de status, chips de prioridade e caixas de busca) em perfeita conformidade com as diretrizes do Figma.
* **Cabeçalhos e Rodapés Reutilizáveis:** Estruturação do `HeaderBackground` e do `FooterLogo` (com os brasões da Prefeitura de Registro e da Fatec), garantindo alinhamento visual e posicionamento fixo correto em todas as telas.

### 2. Fluxo Completo de Chamados do Operador

* **Tela de Listagem (`/chamados`):**
* Listagem dinâmica de ocorrências com suporte a abas de filtro (*Todos*, *Abertos*, *Em andamento*, *Concluídos*) e barra de busca integrada.
* Inclusão de um modal de filtros avançados (`FiltroBottomSheet`) para filtragem por prioridade e tipo de ocorrência.


* **Tela de Detalhes (`/detalhes_chamado`):**
* Conexão via parâmetros de rota (`useLocalSearchParams`) para capturar o ID da ocorrência selecionada na lista.
* Visualização detalhada das informações do chamado (endereço, descrição, fotos e SLA) e botões de ação para atendimento.


* **Tela de Finalização (`/finalizar_atendimento`):**
* Recepção dos dados dinâmicos do chamado via rota, permitindo ao operador registrar o resultado do serviço, anexar comprovante fotográfico e preencher observações conclusivas.
