# Release 01/10 - Squad Mobile (Operador)

Este documento contém as entregas da **Squad Mobile** referentes à release do dia **1 de outubro**, desenvolvidas para a disciplina de Laboratório de Práticas do curso de Desenvolvimento de Software Multiplataforma da FATEC Registro.

## Resumo da Entrega

Nesta release, concentrámo-nos no desenvolvimento avançado de novas telas operacionais e na **integração de ponta a ponta com o backend** (Node.js, Prisma e PostgreSQL), substituindo dados estáticos por requisições HTTP reais via Axios e estruturando o fluxo de autenticação e sessão com segurança.

As principais entregas foram divididas em três frentes:

### 1. Autenticação e Gestão de Sessão do Operador

* **Tela de Login do Operador (`/sign_in`):**
* Implementação dos campos de entrada de credenciais e botão de submissão integrados ao serviço de autenticação da API.


* **Controle de Sessão e AuthGate (`_layout.tsx`):**
* Configuração do `AuthContext` e do armazenamento seguro (`SecureStore`) para persistência do token JWT de funcionário.
* Implementação da guarda de rotas (`AuthGate`) para redirecionamento automático pós-login e desativação de sessão via botão de notificações.



### 2. Integração da Home e Dashboard Principal (`/`)

* **Listagem Dinâmica e Estatísticas:**
* Substituição dos mocks antigos por chamadas reais à API para carregar a listagem de chamados urgentes e calcular dinamicamente os contadores dos cartões de resumo estatístico.


* **Atalhos de Ação:**
* Configuração do fluxo de navegação para a tela de listagem geral e detalhes de ocorrências diretamente a partir do painel de início.



### 3. Aprimoramento da Tela de Listagem e Alinhamento Visual (`/chamados`)

* **Integração Completa com a API:**
* Conexão da listagem geral de tickets com os dados do servidor, utilizando o mapeador de dados (`ticket-mapper`) para adaptar o formato do backend aos componentes do app.


* **Refinamento de Layout:**
* Ajuste estrutural do cabeçalho azul estendido com a barra de pesquisa e botão de filtro incorporados, mantendo fidelidade absoluta ao design prototipado no Figma.
