export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const ENDPOINTS = {
  MESES: {
    BASE: '/meses',
    BY_ID: (id) => `/meses/${id}`,
  },
  RECEITAS: {
    BASE: '/receitas',
    BY_ID: (id) => `/receitas/${id}`,
  },
  DESPESAS: {
    BASE: '/despesas',
    BY_ID: (id) => `/despesas/${id}`,
  },
  PARCELAS: {
    PAGAR: (id) => `/parcelas/${id}/pagar`,
    BY_MES: (mesId) => `/parcelas/mes/${mesId}`,
    BY_ID: (id) => `/parcelas/${id}`,
  },
  USERS: {
    SETUP: '/users/setup',
    TEST: '/users/test',
    CONFIGURACOES: '/users/configuracoes',
    UPDATE_CONFIG: (chave) => `/users/configuracoes/${chave}`,
  },
};

export const CATEGORIAS = {
  CASA: 'casa',
  ALIMENTACAO: 'alimentacao',
  TRANSPORTE: 'transporte',
  SAUDE: 'saude',
  EDUCACAO: 'educacao',
  LAZER: 'lazer',
  OUTROS: 'outros',
};

export const TIPOS_RECEITA = {
  FIXA: 'fixa',
  VARIAVEL: 'variavel',
};
