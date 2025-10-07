// src/services/authService.js
import { ApiService } from './apiService';

export const authService = {
  login: (email, password) => ApiService.login(email, password),
  register: (email, name, password) =>
    ApiService.register(email, name, password),
  getProfile: () => ApiService.getProfile(),
  setupUser: () => ApiService.setupUser(),
  getConfiguracoes: () => ApiService.getConfiguracoes(),
  updateConfiguracao: (chave, valor) =>
    ApiService.updateConfiguracao(chave, valor),
};
