import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Plus,
  Check,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
} from 'lucide-react';
import { useFinanceContext } from '../contexts/FinanceContext';
import {
  formatCurrency,
  formatDate,
  formatMonthYear,
} from '../utils/formatters';
import { CATEGORIAS, TIPOS_RECEITA } from '../constants/apiEndpoints';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import DespesaForm from '../components/forms/DespesaForm';
import ReceitaForm from '../components/forms/ReceitaForm';

const QuinzenaPage = () => {
  const { id } = useParams();
  const {
    quinzenaAtual,
    loading,
    carregarQuinzena,
    adicionarReceita,
    adicionarDespesa,
    marcarParcelaComoPaga,
    atualizarReceita,
    excluirReceita,
    atualizarDespesa,
    excluirDespesa,
  } = useFinanceContext();

  const [showReceitaForm, setShowReceitaForm] = useState(false);
  const [showDespesaForm, setShowDespesaForm] = useState(false);
  const [editandoReceita, setEditandoReceita] = useState(null);
  const [editandoDespesa, setEditandoDespesa] = useState(null);

  const [novaReceita, setNovaReceita] = useState({
    descricao: '',
    valor: '',
    tipo: TIPOS_RECEITA.VARIAVEL,
  });

  useEffect(() => {
    if (id) {
      carregarQuinzena(id);
    }
  }, [id, carregarQuinzena]);

  const handleAdicionarReceita = async (e) => {
    e.preventDefault();
    try {
      await adicionarReceita(id, novaReceita);
      setNovaReceita({
        descricao: '',
        valor: '',
        tipo: TIPOS_RECEITA.VARIAVEL,
      });
      setShowReceitaForm(false);
      // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    } catch (error) {
      // Error handled by context
    }
  };

const handleAdicionarDespesa = async (despesaData) => {
  try {    
    const converterParaUTC = (dataString) => {
      const data = new Date(dataString);
      return new Date(Date.UTC(
        data.getFullYear(),
        data.getMonth(),
        data.getDate()
      )).toISOString().split('T')[0];
    };

    const dadosCorrigidos = {
      ...despesaData,
      valorTotal: parseFloat(despesaData.valorTotal),
      parcelas: parseInt(despesaData.parcelas) || 1,
      data: converterParaUTC(despesaData.data),
      dataPrimeiraParcela: despesaData.dataPrimeiraParcela 
        ? converterParaUTC(despesaData.dataPrimeiraParcela)
        : converterParaUTC(despesaData.data),
    };
    
    await adicionarDespesa(id, dadosCorrigidos);
    setShowDespesaForm(false);
    await carregarQuinzena(id);
  } catch (error) {
    console.error('❌ Erro ao adicionar despesa:', error);
    alert('Erro ao adicionar despesa. Verifique os dados e tente novamente.');
  }
};

  const handleEditarReceita = async (receitaData) => {
    try {
      await atualizarReceita(editandoReceita.id, receitaData);
      setEditandoReceita(null);
    } catch (error) {
      console.error('Erro ao editar receita:', error);
    }
  };

  const handleExcluirReceita = async (receita) => {
    try {
      await excluirReceita(receita.id);
    } catch (error) {
      console.error('Erro ao excluir receita:', error);
    }
  };

  const handleEditarDespesa = async (despesaData) => {
    try {
      // biome-ignore lint/correctness/noUnusedVariables: <explanation>
      const resultado = await atualizarDespesa(editandoDespesa.id, despesaData);
      setEditandoDespesa(null);
      // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    } catch (error) {
      // Error handled by context
    }
  };

  const handleExcluirDespesa = async (despesa) => {
    try {
      await excluirDespesa(despesa.id);
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
    }
  };

  const handleMarcarParcelaComoPaga = async (parcelaId) => {
    try {
      await marcarParcelaComoPaga(parcelaId);
      // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    } catch (error) {
      // Error handled by context
    }
  };

  if (loading && !quinzenaAtual) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-500">Carregando quinzena...</div>
      </div>
    );
  }

  if (!quinzenaAtual) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Quinzena não encontrada</p>
      </div>
    );
  }

  const { calculos } = quinzenaAtual;

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {quinzenaAtual.tipo === 'primeira'
              ? 'Quinzena do Dia 15'
              : 'Quinzena do Dia 30'}
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            {quinzenaAtual.mes &&
              formatMonthYear(quinzenaAtual.mes.mes, quinzenaAtual.mes.ano)}
          </p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <Card padding="small">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">
              Saldo Anterior
            </h3>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          </div>
          <p
            className={`text-sm sm:text-xl font-bold mt-1 ${quinzenaAtual.saldoAnterior >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {formatCurrency(quinzenaAtual.saldoAnterior)}
          </p>
        </Card>

        <Card padding="small">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">
              Total Receitas
            </h3>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
          </div>
          <p className="text-sm sm:text-xl font-bold text-green-600 mt-1">
            {formatCurrency(calculos.totalReceitas)}
          </p>
        </Card>

        {/* Novo card para Total de Despesas */}
        <Card padding="small">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">
              Total Despesas
            </h3>
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
          </div>
          <p className="text-sm sm:text-xl font-bold text-red-600 mt-1">
            {formatCurrency(calculos.totalDespesas)}
          </p>
        </Card>

        <Card padding="small">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">
              Despesas Pagas
            </h3>
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
          </div>
          <p className="text-sm sm:text-xl font-bold text-red-600 mt-1">
            {formatCurrency(calculos.totalDespesasPagas)}
          </p>
        </Card>

        <Card padding="small">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600">
              Saldo Disponível
            </h3>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
          </div>
          <p
            className={`text-sm sm:text-xl font-bold mt-1 ${calculos.saldoDisponivel >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {formatCurrency(calculos.saldoDisponivel)}
          </p>
        </Card>
      </div>

      {/* Receitas e Despesas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receitas */}
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
                Receitas
              </h2>
              <Button
                onClick={() => setShowReceitaForm(!showReceitaForm)}
                icon={Plus}
                variant="success"
                size="small"
                className="w-full sm:w-auto"
              >
                <span className="sm:inline">Nova Receita</span>
              </Button>
            </div>

            {showReceitaForm && (
              <div className="mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">
                  Nova Receita
                </h3>
                <form onSubmit={handleAdicionarReceita} className="space-y-3">
                  <Input
                    label="Descrição"
                    value={novaReceita.descricao}
                    onChange={(e) =>
                      setNovaReceita((prev) => ({
                        ...prev,
                        descricao: e.target.value,
                      }))
                    }
                    required
                  />

                  <Input
                    label="Valor"
                    type="number"
                    step="0.01"
                    value={novaReceita.valor}
                    onChange={(e) =>
                      setNovaReceita((prev) => ({
                        ...prev,
                        valor: e.target.value,
                      }))
                    }
                    required
                  />

                  <Select
                    label="Tipo"
                    value={novaReceita.tipo}
                    onChange={(e) =>
                      setNovaReceita((prev) => ({
                        ...prev,
                        tipo: e.target.value,
                      }))
                    }
                    options={[
                      { value: TIPOS_RECEITA.FIXA, label: 'Fixa' },
                      { value: TIPOS_RECEITA.VARIAVEL, label: 'Variável' },
                    ]}
                  />

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                      type="submit"
                      variant="success"
                      size="small"
                      className="flex-1"
                    >
                      Adicionar
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={() => setShowReceitaForm(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {editandoReceita && (
              <div className="mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">
                  Editando Receita
                </h3>
                <ReceitaForm
                  onSubmit={handleEditarReceita}
                  onCancel={() => setEditandoReceita(null)}
                  onDelete={handleExcluirReceita}
                  initialData={editandoReceita}
                />
              </div>
            )}

            <div className="space-y-3">
              {quinzenaAtual.receitas?.map((receita) => (
                <div
                  key={receita.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-sm sm:text-base truncate">
                        {receita.descricao}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {receita.tipo === 'fixa' ? 'Fixa' : 'Variável'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 ml-2">
                    <p className="text-green-600 font-semibold text-sm sm:text-base whitespace-nowrap">
                      {formatCurrency(receita.valor)}
                    </p>
                    <div className="flex space-x-1">
                      <button
                        className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={() => setEditandoReceita(receita)}
                        title="Editar receita"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        className="p-1 sm:p-2 text-gray-400 hover:text-red-600 transition-colors"
                        onClick={() => handleExcluirReceita(receita)}
                        title="Excluir receita"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {(!quinzenaAtual.receitas ||
                quinzenaAtual.receitas.length === 0) && (
                <div className="text-center py-6 text-gray-500 text-sm sm:text-base">
                  <p>Nenhuma receita cadastrada</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Despesas */}
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
                Despesas
              </h2>
              <Button
                onClick={() => setShowDespesaForm(!showDespesaForm)}
                icon={Plus}
                variant="danger"
                size="small"
                className="w-full sm:w-auto"
              >
                <span className="sm:inline">Nova Despesa</span>
              </Button>
            </div>

            {showDespesaForm && (
              <div className="mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">
                  Nova Despesa
                </h3>
                <DespesaForm
                  onSubmit={handleAdicionarDespesa}
                  onCancel={() => setShowDespesaForm(false)}
                />
              </div>
            )}

            {editandoDespesa && (
              <div className="mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">
                  Editando Despesa
                </h3>
                <DespesaForm
                  onSubmit={handleEditarDespesa}
                  onCancel={() => setEditandoDespesa(null)}
                  onDelete={handleExcluirDespesa}
                  initialData={editandoDespesa}
                />
              </div>
            )}

            <div className="space-y-3">
              {quinzenaAtual.parcelas?.map((parcela) => (
                <div
                  key={parcela.id}
                  className={`p-3 sm:p-4 rounded-lg hover:bg-opacity-80 transition-colors ${
                    parcela.pago
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-800 text-sm sm:text-base truncate">
                            {parcela.despesa?.descricao || 'Despesa sem nome'}
                            {parcela.despesa?.parcelas > 1 && (
                              <span className="text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2 whitespace-nowrap">
                                ({parcela.numeroParcela}/
                                {parcela.despesa.parcelas})
                              </span>
                            )}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {parcela.despesa?.categoria || 'Sem categoria'} •
                            Vence: {formatDate(parcela.dataVencimento)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                          {parcela.despesa && !editandoDespesa && (
                            <>
                              <button
                                className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={() =>
                                  setEditandoDespesa(parcela.despesa)
                                }
                                title="Editar despesa"
                              >
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                              <button
                                className="p-1 sm:p-2 text-gray-400 hover:text-red-600 transition-colors"
                                onClick={() =>
                                  handleExcluirDespesa(parcela.despesa)
                                }
                                title="Excluir despesa"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-2 flex flex-col items-end flex-shrink-0">
                      <p
                        className={`font-semibold text-sm sm:text-base whitespace-nowrap ${
                          parcela.pago ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(parcela.valorParcela)}
                      </p>
                      {!parcela.pago && (
                        <Button
                          onClick={() =>
                            handleMarcarParcelaComoPaga(parcela.id)
                          }
                          icon={Check}
                          variant="success"
                          size="small"
                          className="mt-1 text-xs"
                        >
                          <span className="sm:inline">Pagar</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {parcela.pago && (
                    <div className="flex items-center space-x-1 text-green-600 text-xs sm:text-sm mt-2">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Pago em {formatDate(parcela.dataPagamento)}</span>
                    </div>
                  )}
                </div>
              ))}

              {(!quinzenaAtual.parcelas ||
                quinzenaAtual.parcelas.length === 0) && (
                <div className="text-center py-6 text-gray-500 text-sm sm:text-base">
                  <p>Nenhuma despesa cadastrada</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuinzenaPage;
