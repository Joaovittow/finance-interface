import { useState, useEffect, useCallback } from 'react';
import { ApiService } from '../services/apiService';

export const useFinance = () => {
  const [meses, setMeses] = useState([]);
  const [quinzenaAtual, setQuinzenaAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para calcular totais da quinzena
  const calcularTotais = useCallback((quinzena) => {
    if (!quinzena) {
      return {};
    }

    const totalReceitas = (quinzena.receitas || []).reduce(
      (total, receita) => total + receita.valor,
      0,
    );
    const totalDespesas = (quinzena.parcelas || []).reduce(
      (total, parcela) => total + parcela.valorParcela,
      0,
    );
    const totalDespesasPagas = (quinzena.parcelas || [])
      .filter((parcela) => parcela.pago)
      .reduce((total, parcela) => total + parcela.valorParcela, 0);

    const saldoDisponivel =
      quinzena.saldoAnterior + totalReceitas - totalDespesasPagas;

    return {
      totalReceitas,
      totalDespesas,
      totalDespesasPagas,
      saldoDisponivel,
    };
  }, []);

  const carregarMeses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ApiService.getMeses();
      setMeses(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar meses');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const criarMes = useCallback(async (ano, mes) => {
    setError(null);
    try {
      const novoMes = await ApiService.createMes(ano, mes);
      setMeses((prev) => [novoMes, ...prev]);
      return novoMes;
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar mês');
      throw err;
    }
  }, []);

  const carregarQuinzena = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const quinzena = await ApiService.getQuinzenaById(id);
        const calculos = calcularTotais(quinzena);
        setQuinzenaAtual({
          ...quinzena,
          calculos,
        });
        return quinzena;
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao carregar quinzena');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [calcularTotais],
  );

  const adicionarReceita = useCallback(
    async (quinzenaId, receitaData) => {
      setError(null);
      try {
        const receita = await ApiService.createReceita({
          quinzenaId,
          ...receitaData,
        });

        if (quinzenaAtual && quinzenaAtual.id === quinzenaId) {
          const quinzenaAtualizada = {
            ...quinzenaAtual,
            receitas: [...(quinzenaAtual.receitas || []), receita],
          };
          const calculos = calcularTotais(quinzenaAtualizada);
          setQuinzenaAtual({
            ...quinzenaAtualizada,
            calculos,
          });
        }

        return receita;
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao adicionar receita');
        throw err;
      }
    },
    [quinzenaAtual, calcularTotais],
  );

  const adicionarDespesa = useCallback(
    async (quinzenaId, despesaData) => {
      setError(null);
      try {
        const despesa = await ApiService.createDespesa({
          quinzenaId,
          ...despesaData,
        });

        if (quinzenaAtual && quinzenaAtual.id === quinzenaId) {
          const quinzenaAtualizada = {
            ...quinzenaAtual,
            despesas: [...(quinzenaAtual.despesas || []), despesa],
            parcelas: [
              ...(quinzenaAtual.parcelas || []),
              ...(despesa.parcelasRelacao || []),
            ],
          };
          const calculos = calcularTotais(quinzenaAtualizada);
          setQuinzenaAtual({
            ...quinzenaAtualizada,
            calculos,
          });
        }

        return despesa;
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao adicionar despesa');
        throw err;
      }
    },
    [quinzenaAtual, calcularTotais],
  );

  const marcarParcelaComoPaga = useCallback(
    async (parcelaId, valorPago = null) => {
      setError(null);
      try {
        const parcelaAtualizada = await ApiService.marcarParcelaComoPaga(
          parcelaId,
          valorPago,
        );

        if (quinzenaAtual) {
          const quinzenaAtualizada = {
            ...quinzenaAtual,
            parcelas: (quinzenaAtual.parcelas || []).map((p) =>
              p.id === parcelaId ? parcelaAtualizada : p,
            ),
          };
          const calculos = calcularTotais(quinzenaAtualizada);
          setQuinzenaAtual({
            ...quinzenaAtualizada,
            calculos,
          });
        }

        return parcelaAtualizada;
      } catch (err) {
        setError(
          err.response?.data?.error || 'Erro ao marcar parcela como paga',
        );
        throw err;
      }
    },
    [quinzenaAtual, calcularTotais],
  );

  const inicializarApp = useCallback(async () => {
    setLoading(true);
    try {
      await ApiService.getUserTest();
      await carregarMeses();
    } catch (err) {
      if (err.response?.status === 404) {
        await ApiService.setupUser();
        await carregarMeses();
      } else {
        setError('Erro ao inicializar aplicação');
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, [carregarMeses]);

  const atualizarReceita = useCallback(
    async (id, data) => {
      setError(null);
      try {
        const receitaAtualizada = await ApiService.updateReceita(id, data);

        if (quinzenaAtual) {
          const quinzenaAtualizada = {
            ...quinzenaAtual,
            receitas: (quinzenaAtual.receitas || []).map((r) =>
              r.id === id ? { ...r, ...receitaAtualizada } : r,
            ),
          };
          const calculos = calcularTotais(quinzenaAtualizada);
          setQuinzenaAtual({
            ...quinzenaAtualizada,
            calculos,
          });
        }

        return receitaAtualizada;
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao atualizar receita');
        throw err;
      }
    },
    [quinzenaAtual, calcularTotais],
  );

  const excluirReceita = useCallback(
    async (id) => {
      setError(null);
      try {
        await ApiService.deleteReceita(id);

        if (quinzenaAtual) {
          const quinzenaAtualizada = {
            ...quinzenaAtual,
            receitas: (quinzenaAtual.receitas || []).filter((r) => r.id !== id),
          };
          const calculos = calcularTotais(quinzenaAtualizada);
          setQuinzenaAtual({
            ...quinzenaAtualizada,
            calculos,
          });
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao excluir receita');
        throw err;
      }
    },
    [quinzenaAtual, calcularTotais],
  );

  const atualizarDespesa = useCallback(
    async (id, data) => {
      setError(null);
      try {
        const despesaAtualizada = await ApiService.updateDespesa(id, data);

        if (quinzenaAtual) {
          await carregarQuinzena(quinzenaAtual.id);
        }

        return despesaAtualizada;
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao atualizar despesa');
        throw err;
      }
    },
    [quinzenaAtual, carregarQuinzena],
  );

  const excluirDespesa = useCallback(
    async (id) => {
      setError(null);
      try {
        await ApiService.deleteDespesa(id);

        if (quinzenaAtual) {
          await carregarQuinzena(quinzenaAtual.id);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao excluir despesa');
        throw err;
      }
    },
    [quinzenaAtual, carregarQuinzena],
  );

  const excluirMes = useCallback(async (id) => {
    setError(null);
    try {
      await ApiService.deleteMes(id);
      setMeses((prev) => prev.filter((mes) => mes.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao excluir mês');
      throw err;
    }
  }, []);

  const limparError = useCallback(() => {
    setError(null);
  }, []);

  return {
    meses,
    quinzenaAtual,
    loading,
    error,
    carregarMeses,
    criarMes,
    carregarQuinzena,
    adicionarReceita,
    adicionarDespesa,
    marcarParcelaComoPaga,
    inicializarApp,
    limparError,
    atualizarReceita,
    excluirReceita,
    atualizarDespesa,
    excluirDespesa,
    excluirMes,
  };
};
