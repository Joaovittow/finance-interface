import axios from 'axios'
import { API_BASE_URL, ENDPOINTS } from '../constants/apiEndpoints'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export class ApiService {
  static async getMeses() {
    const response = await api.get(ENDPOINTS.MESES.BASE)
    return response.data
  }

  static async getMesById(id) {
    const response = await api.get(ENDPOINTS.MESES.BY_ID(id))
    return response.data
  }

  static async createMes(ano, mes) {
    const response = await api.post(ENDPOINTS.MESES.BASE, { ano, mes })
    return response.data
  }

  static async updateMes(id, data) {
    const response = await api.put(ENDPOINTS.MESES.BY_ID(id), data)
    return response.data
  }

  static async deleteMes(id) {
    await api.delete(ENDPOINTS.MESES.BY_ID(id))
  }

  static async getQuinzenaById(id) {
    const response = await api.get(ENDPOINTS.QUINZENAS.BY_ID(id))
    return response.data
  }

  static async getQuinzenaCalculos(id) {
    const response = await api.get(ENDPOINTS.QUINZENAS.CALCULOS(id))
    return response.data
  }

  static async updateQuinzena(id, data) {
    const response = await api.put(ENDPOINTS.QUINZENAS.BY_ID(id), data)
    return response.data
  }

  static async createReceita(data) {
    const response = await api.post(ENDPOINTS.RECEITAS.BASE, data)
    return response.data
  }

  static async updateReceita(id, data) {
    const response = await api.put(ENDPOINTS.RECEITAS.BY_ID(id), data)
    return response.data
  }

  static async deleteReceita(id) {
    await api.delete(ENDPOINTS.RECEITAS.BY_ID(id))
  }

  static async createDespesa(data) {
    const response = await api.post(ENDPOINTS.DESPESAS.BASE, data)
    return response.data
  }

  static async updateDespesa(id, data) {
    const response = await api.put(ENDPOINTS.DESPESAS.BY_ID(id), data)
    return response.data
  }

  static async deleteDespesa(id) {
    await api.delete(ENDPOINTS.DESPESAS.BY_ID(id))
  }

  static async marcarParcelaComoPaga(id, valorPago = null) {
    const response = await api.patch(ENDPOINTS.PARCELAS.PAGAR(id), { valorPago })
    return response.data
  }

  static async getParcelasPorQuinzena(quinzenaId) {
    const response = await api.get(ENDPOINTS.PARCELAS.BY_QUINZENA(quinzenaId))
    return response.data
  }

  static async setupUser() {
    const response = await api.post(ENDPOINTS.USERS.SETUP)
    return response.data
  }

  static async getUserTest() {
    const response = await api.get(ENDPOINTS.USERS.TEST)
    return response.data
  }

  static async getConfiguracoes() {
    const response = await api.get(ENDPOINTS.USERS.CONFIGURACOES)
    return response.data
  }

  static async updateConfiguracao(chave, valor) {
    const response = await api.put(ENDPOINTS.USERS.UPDATE_CONFIG(chave), { valor })
    return response.data
  }

  static async updateParcela(id, data) {
    const response = await api.put(ENDPOINTS.PARCELAS.BY_ID(id), data)
    return response.data
  }
}

export default api