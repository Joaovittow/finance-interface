import { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const configs = await ApiService.getConfiguracoes();
      const categoriasConfig = configs.find(
        (config) => config.chave === 'categorias', // Agora busca por 'categorias' em vez de 'categorias_padrao'
      );

      if (categoriasConfig && categoriasConfig.valor) {
        const categoriasArray = categoriasConfig.valor
          .split(',')
          .map((cat) => cat.trim())
          .filter((cat) => cat.length > 0);
        setCategorias(categoriasArray);
      } else {
        // Se não tem categorias configuradas, retorna array VAZIO
        setCategorias([]);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      // Em caso de erro, também retorna array vazio
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  return { categorias, loading, refetch: carregarCategorias };
};
