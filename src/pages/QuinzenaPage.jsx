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
      await adicionarDespesa(id, despesaData);
      setShowDespesaForm(false);
      await carregarQuinzena(id);
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {quinzenaAtual.tipo === 'primeira'
              ? 'Quinzena do Dia 15'
              : 'Quinzena do Dia 30'}
          </h1>
          <p className="text-gray-600 mt-2">
            {quinzenaAtual.mes &&
              formatMonthYear(quinzenaAtual.mes.mes, quinzenaAtual.mes.ano)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="small">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600">
              Saldo Anterior
            </h3>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
          <p
            className={`text-xl font-bold mt-1 ${quinzenaAtual.saldoAnterior >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {formatCurrency(quinzenaAtual.saldoAnterior)}
          </p>
        </Card>

        <Card padding="small">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600">
              Total Receitas
            </h3>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-xl font-bold text-green-600 mt-1">
            {formatCurrency(calculos.totalReceitas)}
          </p>
        </Card>

        <Card padding="small">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600">
              Despesas Pagas
            </h3>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-xl font-bold text-red-600 mt-1">
            {formatCurrency(calculos.totalDespesasPagas)}
          </p>
        </Card>

        <Card padding="small">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600">
              Saldo Disponível
            </h3>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </div>
          <p
            className={`text-xl font-bold mt-1 ${calculos.saldoDisponivel >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {formatCurrency(calculos.saldoDisponivel)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Receitas</h2>
              <Button
                onClick={() => setShowReceitaForm(!showReceitaForm)}
                icon={Plus}
                variant="success"
                size="small"
              >
                Nova Receita
              </Button>
            </div>

            {showReceitaForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">Nova Receita</h3>
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

                  <div className="flex space-x-2">
                    <Button type="submit" variant="success" size="small">
                      Adicionar
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={() => setShowReceitaForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {editandoReceita && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-gray-800 mb-3">
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
                  className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-gray-800">
                        {receita.descricao}
                      </p>
                      <p className="text-sm text-gray-600">
                        {receita.tipo === 'fixa' ? 'Fixa' : 'Variável'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-green-600 font-semibold">
                      {formatCurrency(receita.valor)}
                    </p>
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setEditandoReceita(receita)}
                      title="Editar receita"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      onClick={() => handleExcluirReceita(receita)}
                      title="Excluir receita"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {(!quinzenaAtual.receitas ||
                quinzenaAtual.receitas.length === 0) && (
                <div className="text-center py-6 text-gray-500">
                  <p>Nenhuma receita cadastrada</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Despesas</h2>
              <Button
                onClick={() => setShowDespesaForm(!showDespesaForm)}
                icon={Plus}
                variant="danger"
                size="small"
              >
                Nova Despesa
              </Button>
            </div>

            {showDespesaForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-medium text-gray-800 mb-3">Nova Despesa</h3>
                <DespesaForm
                  onSubmit={handleAdicionarDespesa}
                  onCancel={() => setShowDespesaForm(false)}
                />
              </div>
            )}

            {editandoDespesa && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-gray-800 mb-3">
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
                  className={`p-4 rounded-lg hover:bg-opacity-80 transition-colors ${
                    parcela.pago
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">
                            {parcela.despesa?.descricao || 'Despesa sem nome'}
                            {parcela.despesa?.parcelas > 1 && (
                              <span className="text-sm text-gray-600 ml-2">
                                ({parcela.numeroParcela}/
                                {parcela.despesa.parcelas})
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            {parcela.despesa?.categoria || 'Sem categoria'} •
                            Vence: {formatDate(parcela.dataVencimento)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {parcela.despesa && !editandoDespesa && (
                            <>
                              <button
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={() =>
                                  setEditandoDespesa(parcela.despesa)
                                }
                                title="Editar despesa"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                onClick={() =>
                                  handleExcluirDespesa(parcela.despesa)
                                }
                                title="Excluir despesa"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4 flex flex-col items-end">
                      <p
                        className={`font-semibold ${
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
                          className="mt-1"
                        >
                          Pagar
                        </Button>
                      )}
                    </div>
                  </div>

                  {parcela.pago && (
                    <div className="flex items-center space-x-1 text-green-600 text-sm mt-2">
                      <Check className="h-4 w-4" />
                      <span>Pago em {formatDate(parcela.dataPagamento)}</span>
                    </div>
                  )}
                </div>
              ))}

              {(!quinzenaAtual.parcelas ||
                quinzenaAtual.parcelas.length === 0) && (
                <div className="text-center py-6 text-gray-500">
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
