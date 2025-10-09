# Finance App

Aplicação web para controle financeiro pessoal, com foco em receitas, despesas, meses, quinzenas e categorias personalizadas.

## Visão Geral

- **Frontend:** React 18, React Router v6, Context API, hooks customizados, TailwindCSS.
- **Backend:** Consome API REST (Node.js) repositório em [https://github.com/Joaovittow/finance-api].
- **Funcionalidades:** Autenticação, gestão de meses/quinzenas, receitas, despesas (parceladas ou não), categorias personalizadas, relatórios gráficos e detalhados.

---

## Instalação e Execução

```bash
# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

---

## Estrutura de Pastas

```
src/
  components/    # Componentes reutilizáveis
  constants/     # Constantes globais
  contexts/      # Contextos globais
  hooks/         # Hooks customizados
  pages/         # Páginas principais
  services/      # Serviços de API e autenticação
  utils/         # Funções utilitárias
```

---

## Funcionalidades Principais

### 1. Autenticação

- Cadastro e login de usuários.
- Proteção de rotas via `ProtectedRoute`.
- Contexto global de autenticação (`AuthContext`).

### 2. Gestão de Meses e Quinzenas

- Criação de novos meses.
- Visualização e exclusão de meses.
- Navegação entre quinzenas (Dia 15 e Dia 30).

### 3. Receitas e Despesas

- Adição, edição e exclusão de receitas/despesas.
- Parcelamento de despesas.
- Marcação de parcelas como pagas.
- Categorização de despesas.

### 4. Categorias Personalizadas

- Gerenciamento de categorias pelo usuário.
- Adição, remoção e persistência de categorias.

### 5. Relatórios

- Relatórios mensais com gráficos de pizza e barras.
- Detalhamento por categoria e quinzena.
- Resumo de receitas, despesas e saldo.

---

## Tecnologias Utilizadas

- **React 18**
- **React Router v6**
- **TailwindCSS**
- **Axios**
- **Lucide React Icons**

---

## Boas Práticas

- Separação de responsabilidades (componentes, hooks, contextos, serviços).
- Feedback visual para loading, erros e confirmações.
- Código limpo e organizado.
- Validação básica de formulários.

---

## Observações

- O token de autenticação é armazenado em `localStorage`.
- O projeto está em português.
- Para rodar localmente, é necessário que a API esteja disponível.

---

## Licença

Este projeto é de uso pessoal/educacional.
