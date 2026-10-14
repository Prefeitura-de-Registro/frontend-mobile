# 📱 Manual do Desenvolvedor: Frontend Mobile

Bem-vindo ao repositório do **aplicativo Mobile (React Native + Expo)**.

Este documento contém as regras de infraestrutura (**DevOps**), o guia de configuração do ambiente local, os procedimentos de qualidade e o fluxo de trabalho obrigatório para a equipe.

---

## 🛠️ 1. Pré-requisitos e Setup Local

Para executar o projeto na sua máquina, **não é necessário ter o Android Studio instalado**. Utilizamos o ecossistema do **Expo** para desenvolvimento e testes.

Antes de começar, certifique-se de possuir:

* [Node.js](https://nodejs.org/) — Versão 20 ou superior
* Git
* Um dispositivo Android ou iOS
* Aplicativo **Expo Go** instalado no dispositivo físico

### 1.1 Clone o repositório

Clone o repositório e instale as dependências:

```bash
git clone <url-do-repositorio>
cd frontend-mobile
npm install
```

> Ao executar `npm install`, os gatilhos de segurança locais do **Husky** serão configurados automaticamente.

---

## 🚀 2. Rodando o Aplicativo

Para iniciar o servidor de desenvolvimento do Expo, execute:

```bash
npx expo start
```

Após iniciar, o terminal exibirá um **QR Code**.

Abra o aplicativo **Expo Go** no seu celular e escaneie o QR Code para carregar a aplicação.

Durante o desenvolvimento, o **Fast Refresh** estará ativo, permitindo visualizar as alterações realizadas no código diretamente no dispositivo.

### 📱 Fluxo

```text
Código no computador
        ↓
     Expo CLI
        ↓
    QR Code
        ↓
     Expo Go
        ↓
Aplicativo no celular
        ↓
    Fast Refresh
```

---

# 🧪 3. Qualidade de Código e CI/CD

Nossa esteira de **Integração Contínua (CI)** utilizando **GitHub Actions** bloqueia Pull Requests que não atenderem às validações definidas no projeto.

Por isso, **sempre execute as validações localmente antes de realizar o push**.

---

## 🔷 3.1 Validação de Tipagem — TypeScript

Para verificar erros de tipagem sem gerar arquivos JavaScript, execute:

```bash
npx tsc --noEmit
```

O parâmetro `--noEmit` faz com que o TypeScript realize apenas a verificação do código, sem gerar arquivos de saída.

> Erros de TypeScript devem ser corrigidos antes do envio do Pull Request.

---

## 🧪 3.2 Testes Unitários — Jest

Para executar os testes unitários do projeto:

```bash
npm test
```

Os testes devem ser executados antes do envio das alterações para garantir que as funcionalidades existentes continuam funcionando.

---

## 🧹 3.3 Formatação e Linter

Para verificar problemas relacionados às regras de qualidade do código:

```bash
npm run lint
```

Para formatar o código:

```bash
npm run format
```

O **Husky** também executará as validações configuradas durante o processo de commit.

---

# 📦 4. Geração de APK e Deploy

Para evitar consumo desnecessário dos recursos da nuvem e atingir limites de utilização, **não geramos APKs em branches de feature ou Pull Requests**.

A compilação do arquivo instalável `.APK` é realizada utilizando o **Expo Application Services (EAS)**.

O processo de geração do APK ocorre exclusivamente através da esteira de **Continuous Deployment (CD)** quando uma Release é integrada na branch:

```text
main
```

### 🔄 Fluxo de Deploy

```text
Feature Branch
      ↓
Pull Request
      ↓
CI
      ↓
Code Review
      ↓
Merge
      ↓
Release
      ↓
main
      ↓
CD
      ↓
Expo EAS
      ↓
APK
```

A distribuição do aplicativo oficial da Sprint é realizada através do processo definido pela equipe.

---

# 🔄 5. Fluxo de Trabalho — GitFlow

O desenvolvimento deve seguir o fluxo de branches estabelecido pela equipe.

---

## 📥 5.1 Atualizar o repositório local

Antes de começar uma tarefa, atualize as referências do Git:

```bash
git fetch --all
```

Esse comando garante que o Git local conheça as branches e atualizações existentes no repositório remoto.

---

## 🌿 5.2 Entrar na branch da Issue

A branch da tarefa é criada previamente pelo **PO**.

Entre na branch correspondente à sua Issue:

```bash
git checkout feat/sua-tarefa
```

Exemplo:

```bash
git checkout feat/12-tela-login
```

> Como a branch já foi criada pelo PO, não é necessário utilizar `git checkout -b`.

---

## 🔄 5.3 Atualizar a branch com a base

Antes de começar o desenvolvimento, sincronize sua branch com a branch base definida para a tarefa.

Por exemplo:

```bash
git merge origin/develop
```

Caso o PO determine outra branch como base, utilize a branch indicada:

```bash
git merge origin/epic/nome-da-epic
```

Essa etapa reduz a possibilidade de conflitos durante o Pull Request.

---

## 💻 5.4 Desenvolver e realizar o commit

Após atualizar a branch, desenvolva normalmente a funcionalidade.

Antes do commit, execute as validações necessárias:

```bash
npx tsc --noEmit
npm test
npm run lint
npm run format
```

Depois, adicione os arquivos modificados:

```bash
git add .
```

Realize o commit seguindo o padrão definido pela equipe:

```bash
git commit -m "feat: adiciona tela de login"
```

O **Husky** executará automaticamente as validações configuradas durante o processo de commit.

---

## 📤 5.5 Enviar as alterações para o GitHub

Após finalizar a implementação:

```bash
git push origin feat/sua-tarefa
```

Exemplo:

```bash
git push origin feat/12-tela-login
```

---

## 🔀 5.6 Abrir o Pull Request

Após realizar o `push`, acesse o repositório no GitHub e abra o **Pull Request**.

Confirme:

* Branch de origem: sua `feat/`
* Branch de destino: definida pelo PO
* Issue correspondente vinculada ao PR

Exemplo:

```text
base: develop
compare: feat/12-tela-login
```

Após a abertura do Pull Request, a esteira de **CI/CD** executará automaticamente as validações configuradas.

O código seguirá para **Code Review** somente após as verificações necessárias serem concluídas conforme as regras do repositório.

---

# 🧹 6. Limpeza Pós-Merge

Após o Pull Request ser aprovado e realizado o merge, a branch de feature pode ser removida do GitHub.

Para manter o ambiente local organizado, remova também a referência local.

### 6.1 Voltar para a branch base

```bash
git checkout develop
```

---

### 6.2 Atualizar a branch base

```bash
git pull origin develop
```

---

### 6.3 Remover referências de branches excluídas

```bash
git fetch --prune
```

O `--prune` remove referências locais para branches remotas que já não existem no GitHub.

---

### 6.4 Excluir a branch local

```bash
git branch -D feat/12-tela-login
```

Substitua o nome pela branch correspondente à tarefa concluída.

---

# 📌 7. Resumo do Fluxo

O fluxo completo de desenvolvimento pode ser representado da seguinte forma:

```text
PO cria Issue
      ↓
PO cria branch feat/
      ↓
git fetch --all
      ↓
git checkout feat/...
      ↓
git merge origin/develop
      ↓
Desenvolvimento
      ↓
TypeScript
      ↓
Jest
      ↓
ESLint
      ↓
Prettier
      ↓
Husky
      ↓
git commit
      ↓
git push
      ↓
Pull Request
      ↓
GitHub Actions — CI
      ↓
Code Review
      ↓
Merge
      ↓
Branch feat/ é excluída
      ↓
git checkout develop
      ↓
git pull
      ↓
git fetch --prune
      ↓
git branch -D feat/...
```

---

# 📱 8. Checklist antes do Pull Request

Antes de abrir o Pull Request, confirme:

* [ ] Código implementado
* [ ] TypeScript validado
* [ ] Testes unitários executados
* [ ] Linter executado
* [ ] Código formatado
* [ ] Husky executado corretamente
* [ ] Commit seguindo o padrão da equipe
* [ ] Alterações enviadas para a branch correta
* [ ] Pull Request apontando para a branch correta
* [ ] Issue correspondente vinculada ao Pull Request
* [ ] CI executada com sucesso
* [ ] Código pronto para Code Review
