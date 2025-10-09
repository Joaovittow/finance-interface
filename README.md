# Finance App

Aplicação web para controle financeiro pessoal, com foco em receitas, despesas, meses, quinzenas e categorias personalizadas.

## Visão Geral

- **Frontend:** React 18, React Router v6, Context API, hooks customizados, TailwindCSS.
- **Backend:** Consome API REST (Node.js) hospedada em [https://finance-api-i1ix.onrender.com/api](https://finance-api-i1ix.onrender.com/api).
- **Funcionalidades:** Autenticação, gestão de meses/quinzenas, receitas, despesas (parceladas ou não), categorias personalizadas, relatórios gráficos e detalhados.

---

## Instalação e Execução

```bash
# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

---

## Estrutura de Pastas

```
src/
  components/    # Componentes reutilizáveis (UI, formulários, layout)
  contexts/      # Contextos globais (Auth, Finance)
  hooks/         # Hooks customizados (useFinance, useCategorias, etc)
  pages/         # Páginas principais (Dashboard, Meses, Relatórios, etc)
  services/      # Serviços de API e autenticação
  utils/         # Funções utilitárias (formatadores, validações)
  constants/     # Constantes globais (endpoints, enums)
```

---

## Funcionalidades Principais

### 1. Autenticação

- Cadastro e login de usuários.
- Proteção de rotas via `ProtectedRoute`.
- Contexto global de autenticação (`AuthContext`).

**Exemplo de uso:**
```jsx
import { useAuth } from '../contexts/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

---

### 2. Gestão de Meses e Quinzenas

- Criação de novos meses.
- Visualização e exclusão de meses.
- Navegação entre quinzenas (Dia 15 e Dia 30).

**Exemplo de criação de mês:**
```jsx
const { criarMes } = useFinanceContext();
await criarMes(2024, 6); // Cria mês de Junho/2024
```

---

### 3. Receitas e Despesas

- Adição, edição e exclusão de receitas/despesas.
- Parcelamento de despesas.
- Marcação de parcelas como pagas.
- Categorização de despesas.

**Exemplo de adição de receita:**
```jsx
const { adicionarReceita } = useFinanceContext();
await adicionarReceita(quinzenaId, {
  descricao: 'Salário',
  valor: 3000,
  tipo: 'fixa'
});
```

---

### 4. Categorias Personalizadas

- Gerenciamento de categorias pelo usuário.
- Adição, remoção e persistência de categorias.

**Exemplo de uso do hook:**
```jsx
import { useCategorias } from '../hooks/useCategorias';

const { categorias, loading, refetch } = useCategorias();
```

---

### 5. Relatórios

- Relatórios mensais com gráficos de pizza e barras.
- Detalhamento por categoria e quinzena.
- Resumo de receitas, despesas e saldo.

---

## Exemplos de Componentes

### Adicionar Receita

```jsx
<ReceitaForm
  onSubmit={handleAdicionarReceita}
  onCancel={() => setShowReceitaForm(false)}
/>
```

### Adicionar Despesa

```jsx
<DespesaForm
  onSubmit={handleAdicionarDespesa}
  onCancel={() => setShowDespesaForm(false)}
/>
```

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

Este projeto é de uso pessoal/educacional. Para uso comercial, consulte o autor.

---

# React + Vite

Este template fornece uma configuração mínima para fazer o React funcionar no Vite com HMR e algumas regras do ESLint.

Atualmente, dois plugins oficiais estão disponíveis:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Babel](https://babeljs.io/) para Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/) para Fast Refresh

## Compilador React

O Compilador React não está habilitado neste template. Para adicioná-lo, consulte [esta documentação](https://react.dev/learn/react-compiler/installation).

## Expansão da configuração do ESLint

Se você estiver desenvolvendo uma aplicação para produção, recomendamos o uso do TypeScript com regras de linting baseadas em tipo habilitadas. Confira o [template TS](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) para informações sobre como integrar TypeScript e [`typescript-eslint`](https://typescript-eslint.io) em seu projeto.
