export const API_BASE_URL = 'https://finance-api-i1ix.onrender.com/api';

export const ENDPOINTS = {
  MESES: {
    BASE: '/meses',
    BY_ID: (id) => `/meses/${id}`,
  },
  QUINZENAS: {
    BY_ID: (id) => `/quinzenas/${id}`,
    CALCULOS: (id) => `/quinzenas/${id}/calculos`,
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
    BY_QUINZENA: (quinzenaId) => `/parcelas/quinzena/${quinzenaId}`,
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
