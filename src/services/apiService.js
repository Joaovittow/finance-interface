// src/services/apiService.js
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../constants/apiEndpoints';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  },
);

export class ApiService {
  // Auth endpoints
  static async login(email, password) {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  }

  static async register(email, name, password) {
    const response = await api.post('/users/register', {
      email,
      name,
      password,
    });
    return response.data;
  }

  static async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  }

  static async setupUser() {
    const response = await api.post('/users/setup');
    return response.data;
  }

  static async getConfiguracoes() {
    const response = await api.get('/users/configuracoes');
    return response.data;
  }

  static async updateConfiguracao(chave, valor) {
    const chaveCodificada = encodeURIComponent(chave); // Codifica caracteres especiais
    const response = await api.put(`/users/configuracoes/${chaveCodificada}`, {
      valor,
    });
    return response.data;
  }
  // Existing endpoints
  static async getMeses() {
    const response = await api.get(ENDPOINTS.MESES.BASE);
    return response.data;
  }

  static async getMesById(id) {
    const response = await api.get(ENDPOINTS.MESES.BY_ID(id));
    return response.data;
  }

  static async createMes(ano, mes) {
    const response = await api.post(ENDPOINTS.MESES.BASE, { ano, mes });
    return response.data;
  }

  static async updateMes(id, data) {
    const response = await api.put(ENDPOINTS.MESES.BY_ID(id), data);
    return response.data;
  }

  static async deleteMes(id) {
    await api.delete(ENDPOINTS.MESES.BY_ID(id));
  }

  static async getQuinzenaById(id) {
    const response = await api.get(ENDPOINTS.QUINZENAS.BY_ID(id));
    return response.data;
  }

  static async getQuinzenaCalculos(id) {
    const response = await api.get(ENDPOINTS.QUINZENAS.CALCULOS(id));
    return response.data;
  }

  static async updateQuinzena(id, data) {
    const response = await api.put(ENDPOINTS.QUINZENAS.BY_ID(id), data);
    return response.data;
  }

  static async createReceita(data) {
    const response = await api.post(ENDPOINTS.RECEITAS.BASE, data);
    return response.data;
  }

  static async updateReceita(id, data) {
    const response = await api.put(ENDPOINTS.RECEITAS.BY_ID(id), data);
    return response.data;
  }

  static async deleteReceita(id) {
    await api.delete(ENDPOINTS.RECEITAS.BY_ID(id));
  }

  static async createDespesa(data) {
    const response = await api.post(ENDPOINTS.DESPESAS.BASE, data);
    return response.data;
  }

  static async updateDespesa(id, data) {
    const response = await api.put(ENDPOINTS.DESPESAS.BY_ID(id), data);
    return response.data;
  }

  static async deleteDespesa(id) {
    await api.delete(ENDPOINTS.DESPESAS.BY_ID(id));
  }

  static async marcarParcelaComoPaga(id, valorPago = null) {
    const response = await api.patch(ENDPOINTS.PARCELAS.PAGAR(id), {
      valorPago,
    });
    return response.data;
  }

  static async getParcelasPorQuinzena(quinzenaId) {
    const response = await api.get(ENDPOINTS.PARCELAS.BY_QUINZENA(quinzenaId));
    return response.data;
  }

  static async updateParcela(id, data) {
    const response = await api.put(ENDPOINTS.PARCELAS.BY_ID(id), data);
    return response.data;
  }

  static async createConfiguracao(data) {
    const response = await api.post('/users/configuracoes', data);
    return response.data;
  }

  static async deleteConfiguracao(chave) {
    const chaveCodificada = encodeURIComponent(chave);
    await api.delete(`/users/configuracoes/${chaveCodificada}`);
  }
}

export default api;
