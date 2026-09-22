# Mobile — Aplicativo do Operador e Munícipe (Fala Registro!)

Aplicativo mobile desenvolvido para a Prefeitura de Registro no âmbito da disciplina de Laboratório de Práticas do curso de Desenvolvimento de Software Multiplataforma da **FATEC Registro**. O sistema otimiza o fluxo de atendimento, comunicação e gerenciamento de ocorrências urbanas entre munícipes e secretarias municipais.

## Tecnologias

- React Native (Expo)
- Expo Router
- TypeScript
- Tailwind CSS / Estilização Nativa
- Lucide React Native (Ícones)

## Base

- Arquitetura móvel desenvolvida utilizando o conceito de **Atomic Design** (`src/components/` dividida em átomos, moléculas e organismos) e roteamento baseado em arquivos via **Expo Router** (`src/app/`).

---

## Descrição do Projeto

O **Fala Registro!** é uma solução multiplataforma voltada para a gestão pública municipal. O aplicativo mobile atende principalmente aos **Operadores e Secretarias**, permitindo o recebimento de chamados, filtragem avançada de ocorrências por prioridade e tipo, visualização de detalhes com geolocalização e fotos, fluxo completo de atendimento/finalização de serviços, além de um canal direto de solicitações e chat interno entre departamentos.

## Links

### Aplicação (Deploy / Builds)

| Branch  | URL / Status  |
| ------- | ------------- |
| main    | *[A definir]* |
| develop | *[A definir]* |

### API (Back-end)

| Ambiente | URL           |
| -------- | ------------- |
| main     | *[A definir]* |
| develop  | *[A definir]* |

## Guia de Contribuição

- **Fluxo de Branches:** Organizado por *Epics* e *sub-branches* focadas em tarefas granulares (ex: `epic/chamados-e-integracao` -> `feat/componentizacao-base`).
- **Padrão de Commits:** Utilizar o padrão de *Conventional Commits* (`feat:`, `fix:`, `chore:`, etc.).
- **Pull Request:** Todo código deve passar por validação de branch e testes locais antes de realizar o merge para as branches principais (`develop` / `main`).

## Setup Local

Siga os passos abaixo para rodar o projeto mobile em sua máquina:

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd <nome-da-pasta>

```

2. **Instale as dependências:**
```bash
npm install
# ou yarn install / bun install

```


3. **Configure as variáveis de ambiente:**
* Crie um arquivo `.env` na raiz do projeto baseado no `.env.example` (se aplicável), configurando a URL base da API.


4. **Execute o projeto:**
```bash
npx expo start

```


* Utilize o aplicativo **Expo Go** no seu smartphone escaneando o QR Code, ou pressione `a` para abrir no emulador Android (Pixel) / `i` para iOS.



## Scripts

Lista dos principais comandos disponíveis no `package.json`:

* `npx expo start`: Inicia o servidor de desenvolvimento do Metro Bundler.
* `npx expo start --android`: Inicia diretamente no emulador Android.
* `npx expo start --ios`: Inicia diretamente no simulador iOS.
* `npx expo start --clear`: Limpa o cache do bundler para solucionar falhas de inicialização.

## Estrutura de Pastas

```text
src/
├── app/                  # Telas e rotas baseadas em arquivos (Expo Router)
│   ├── chamados/         # Fluxo de listagem e detalhes de chamados
│   ├── detalhes_chamado/ # Tela detalhada do chamado do operador
│   ├── finalizar_atendimento/ # Fluxo de conclusão e comprovante
│   └── ...               # Demais telas (Splash, Login, Perfil, Notificações, Solicitações)
├── components/           # Componentes reutilizáveis (Atomic Design)
│   ├── atoms/            # Botões, inputs, chips, badges
│   ├── molecules/        # Cards, headers, caixas de upload
│   └── organisms/        # Modais de filtro, listas, rodapé institucional
├── constants/            # Cores, fontes e temas globais do app
├── data/                 # Mocks estáticos para desenvolvimento offline
└── types/                # Tipagens globais em TypeScript (Interfaces de Chamados, etc.)

```

## Rotas Principais

* `/`: Splash Screen institucional ("Fala Registro!").
* `/auth`: Tela de boas-vindas do munícipe / seleção de perfil.
* `/auth/login_operador`: Autenticação restrita do operador (Matrícula e Senha).
* `/chamados`: Dashboard principal de listagem e filtros de ocorrências.
* `/detalhes_chamado`: Visualização aprofundada de um chamado por ID.
* `/finalizar_atendimento`: Registro de resultado, fotos e encerramento de chamado.
* `/solicitacoes`: Painel de solicitações (Enviadas e Recebidas) com aba de chat/comunicação.
* `/perfil` & `/notificações`: Gestão de usuário, setor e central de avisos de SLA.

## Integração com Back-end

* Comunicação via API REST com a retaguarda do sistema.
* Consumo de endpoints para autenticação de operadores, listagem dinâmica de chamados com filtros e envio de formulários com anexos multipart/form-data.

## Observações Gerais

* **Emulador:** Caso o emulador Android feche sozinho ao iniciar (`The emulator process has terminated`), utilize a opção **Cold Boot Now** no Device Manager do Android Studio.
* **Design System:** Evite criar estilos isolados nas telas; utilize sempre as constantes globais de tema (`@/constants`) para manter a fidelidade com o Figma da Prefeitura.

```

---
Prontinho! Ficou redondo, documentando exatamente a nossa arquitetura atual, o fluxo por rotas e a organização do projeto.

```
