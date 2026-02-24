import { useState, useCallback } from 'react';
import { ApiService } from '../services/apiService';
import { somarReceitasDisponiveis } from '../utils/dateUtils';

export const useFinance = () => {
  const [meses, setMeses] = useState([]);
  const [mesAtual, setMesAtual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calcula totais do mês (acesso direto, sem quinzenas)
  const calcularTotais = useCallback((mes) => {
    if (!mes) return {};

    const totalReceitas = somarReceitasDisponiveis(mes.receitas);
    const totalDespesas = (mes.parcelas || []).reduce(
      (total, parcela) => total + parcela.valorParcela,
      0,
    );
    const totalDespesasPagas = (mes.parcelas || [])
      .filter((parcela) => parcela.pago)
      .reduce((total, parcela) => total + (parcela.valorPago || parcela.valorParcela), 0);

    const saldo = totalReceitas - totalDespesasPagas;

    return {
      totalReceitas,
      totalDespesas,
      totalDespesasPagas,
      saldo,
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

  const carregarMes = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const mes = await ApiService.getMesById(id);
        const calculos = calcularTotais(mes);
        setMesAtual({
          ...mes,
          calculos,
        });
        return mes;
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao carregar mês');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [calcularTotais],
  );

  const adicionarReceita = useCallback(
    async (mesId, receitaData) => {
      setError(null);
      try {
        const receita = await ApiService.createReceita({
          mesId,
          ...receitaData,
        });

        if (mesAtual && mesAtual.id === mesId) {
          const mesAtualizado = {
            ...mesAtual,
            receitas: [...(mesAtual.receitas || []), receita],
          };
          const calculos = calcularTotais(mesAtualizado);
          setMesAtual({
            ...mesAtualizado,
            calculos,
          });
        }

        return receita;
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao adicionar receita');
        throw err;
      }
    },
    [mesAtual, calcularTotais],
  );

  const adicionarDespesa = useCallback(
    async (mesId, despesaData) => {
      setError(null);
      try {
        const despesa = await ApiService.createDespesa({
          mesId,
          ...despesaData,
        });

        if (mesAtual && mesAtual.id === mesId) {
          const mesAtualizado = {
            ...mesAtual,
            despesas: [...(mesAtual.despesas || []), despesa],
            parcelas: [
              ...(mesAtual.parcelas || []),
              ...(despesa.parcelasRelacao || []),
            ],
          };
          const calculos = calcularTotais(mesAtualizado);
          setMesAtual({
            ...mesAtualizado,
            calculos,
          });
        }

        return despesa;
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao adicionar despesa');
        throw err;
      }
    },
    [mesAtual, calcularTotais],
  );

  const marcarParcelaComoPaga = useCallback(
    async (parcelaId, valorPago = null) => {
      setError(null);
      try {
        const parcelaAtualizada = await ApiService.marcarParcelaComoPaga(
          parcelaId,
          valorPago,
        );

        if (mesAtual) {
          const mesAtualizado = {
            ...mesAtual,
            parcelas: (mesAtual.parcelas || []).map((p) =>
              p.id === parcelaId ? parcelaAtualizada : p,
            ),
          };
          const calculos = calcularTotais(mesAtualizado);
          setMesAtual({
            ...mesAtualizado,
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
    [mesAtual, calcularTotais],
  );

  const atualizarReceita = useCallback(
    async (id, data) => {
      setError(null);
      try {
        const receitaAtualizada = await ApiService.updateReceita(id, data);

        if (mesAtual) {
          const mesAtualizado = {
            ...mesAtual,
            receitas: (mesAtual.receitas || []).map((r) =>
              r.id === id ? { ...r, ...receitaAtualizada } : r,
            ),
          };
          const calculos = calcularTotais(mesAtualizado);
          setMesAtual({
            ...mesAtualizado,
            calculos,
          });
        }

        return receitaAtualizada;
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao atualizar receita');
        throw err;
      }
    },
    [mesAtual, calcularTotais],
  );

  const excluirReceita = useCallback(
    async (id) => {
      setError(null);
      try {
        await ApiService.deleteReceita(id);

        if (mesAtual) {
          const mesAtualizado = {
            ...mesAtual,
            receitas: (mesAtual.receitas || []).filter((r) => r.id !== id),
          };
          const calculos = calcularTotais(mesAtualizado);
          setMesAtual({
            ...mesAtualizado,
            calculos,
          });
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao excluir receita');
        throw err;
      }
    },
    [mesAtual, calcularTotais],
  );

  const atualizarDespesa = useCallback(
    async (id, data) => {
      setError(null);
      try {
        const despesaAtualizada = await ApiService.updateDespesa(id, data);

        if (mesAtual) {
          await carregarMes(mesAtual.id);
        }

        return despesaAtualizada;
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao atualizar despesa');
        throw err;
      }
    },
    [mesAtual, carregarMes],
  );

  const excluirDespesa = useCallback(
    async (id) => {
      setError(null);
      try {
        await ApiService.deleteDespesa(id);

        if (mesAtual) {
          await carregarMes(mesAtual.id);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Erro ao excluir despesa');
        throw err;
      }
    },
    [mesAtual, carregarMes],
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
    mesAtual,
    loading,
    error,
    carregarMeses,
    criarMes,
    carregarMes,
    adicionarReceita,
    adicionarDespesa,
    marcarParcelaComoPaga,
    limparError,
    atualizarReceita,
    excluirReceita,
    atualizarDespesa,
    excluirDespesa,
    excluirMes,
  };
};
