import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Plus,
  Check,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  ChevronLeft,
  ArrowUpRight,
  ArrowDownLeft,
  CalendarCheck,
  AlertCircle
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
    } catch (error) {
      // Error handled by context
    }
  };

  if (loading && !quinzenaAtual) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!quinzenaAtual) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>Quinzena não encontrada</p>
        <Link to="/meses" className="text-brand-600 hover:underline mt-2 inline-block">Voltar para Meses</Link>
      </div>
    );
  }

  const { calculos } = quinzenaAtual;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link to="/meses" className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors w-fit">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para Meses
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {quinzenaAtual.tipo === 'primeira' ? '1ª Quinzena' : '2ª Quinzena'}
             </h1>
             <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                <CalendarCheck className="h-4 w-4" />
                {quinzenaAtual.mes && formatMonthYear(quinzenaAtual.mes.mes, quinzenaAtual.mes.ano)}
             </p>
          </div>
          
          <div className="bg-brand-50 dark:bg-brand-900/20 px-4 py-2 rounded-xl border border-brand-100 dark:border-brand-900/30">
             <span className="text-xs text-brand-600 dark:text-brand-400 uppercase font-semibold tracking-wider">Saldo Disponível</span>
             <p className={`text-xl font-bold ${calculos.saldoDisponivel >= 0 ? 'text-brand-700 dark:text-brand-300' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(calculos.saldoDisponivel)}
             </p>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-card p-4 rounded-2xl shadow-soft border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
               <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Receitas</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(calculos.totalReceitas)}</p>
        </div>

        <div className="bg-white dark:bg-dark-card p-4 rounded-2xl shadow-soft border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg">
               <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Despesas</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(calculos.totalDespesas)}</p>
        </div>

        <div className="bg-white dark:bg-dark-card p-4 rounded-2xl shadow-soft border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
               <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Pagas</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCurrency(calculos.totalDespesasPagas)}</p>
        </div>
        
        <div className="bg-white dark:bg-dark-card p-4 rounded-2xl shadow-soft border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
               <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Anterior</span>
          </div>
          <p className={`text-lg font-bold ${quinzenaAtual.saldoAnterior >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-600'}`}>{formatCurrency(quinzenaAtual.saldoAnterior)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Receitas Column */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-green-500"></div>
               <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Receitas</h2>
            </div>
            <Button 
               onClick={() => setShowReceitaForm(!showReceitaForm)} 
               variant="secondary" 
               size="small" 
               icon={Plus}
               className="!bg-green-50 !text-green-700 hover:!bg-green-100 dark:!bg-green-900/20 dark:!text-green-300"
            >
               Adicionar
            </Button>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
             {showReceitaForm && (
                <div className="p-4 bg-gray-50 dark:bg-dark-border/30 border-b border-gray-100 dark:border-dark-border">
                   <h3 className="text-sm font-semibold mb-3">Nova Receita</h3>
                   <form onSubmit={handleAdicionarReceita} className="space-y-3">
                      <Input
                         label="Descrição"
                         value={novaReceita.descricao}
                         onChange={(e) => setNovaReceita(prev => ({ ...prev, descricao: e.target.value }))}
                         required
                         className="bg-white dark:bg-dark-card"
                      />
                      <div className="grid grid-cols-2 gap-3">
                         <Input
                            label="Valor"
                            type="number"
                            step="0.01"
                            value={novaReceita.valor}
                            onChange={(e) => setNovaReceita(prev => ({ ...prev, valor: e.target.value }))}
                            required
                            className="bg-white dark:bg-dark-card"
                         />
                         <Select
                            label="Tipo"
                            value={novaReceita.tipo}
                            onChange={(e) => setNovaReceita(prev => ({ ...prev, tipo: e.target.value }))}
                            options={[
                               { value: TIPOS_RECEITA.FIXA, label: 'Fixa' },
                               { value: TIPOS_RECEITA.VARIAVEL, label: 'Variável' },
                            ]}
                         />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                         <Button type="button" variant="ghost" size="small" onClick={() => setShowReceitaForm(false)}>Cancelar</Button>
                         <Button type="submit" variant="success" size="small">Salvar</Button>
                      </div>
                   </form>
                </div>
             )}

             {editandoReceita && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
                   <ReceitaForm
                      onSubmit={handleEditarReceita}
                      onCancel={() => setEditandoReceita(null)}
                      onDelete={handleExcluirReceita}
                      initialData={editandoReceita}
                   />
                </div>
             )}

             <div className="divide-y divide-gray-100 dark:divide-dark-border">
                {quinzenaAtual.receitas?.length > 0 ? (
                   quinzenaAtual.receitas.map((receita) => (
                      <div key={receita.id} className="p-4 hover:bg-gray-50 dark:hover:bg-dark-border/30 transition-colors flex items-center justify-between group">
                         <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{receita.descricao}</p>
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-border px-2 py-0.5 rounded-full inline-block mt-1">
                               {receita.tipo === 'fixa' ? 'Fixa' : 'Variável'}
                            </span>
                         </div>
                         <div className="text-right flex items-center gap-4">
                            <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(receita.valor)}</span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                               <button onClick={() => setEditandoReceita(receita)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                  <Edit className="h-4 w-4" />
                               </button>
                               <button onClick={() => handleExcluirReceita(receita)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                  <Trash2 className="h-4 w-4" />
                               </button>
                            </div>
                         </div>
                      </div>
                   ))
                ) : (
                   <div className="p-8 text-center text-gray-500 dark:text-gray-400">Nenhuma receita registrada</div>
                )}
             </div>
          </div>
        </section>

        {/* Despesas Column */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-red-500"></div>
               <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Despesas</h2>
            </div>
            <Button 
               onClick={() => setShowDespesaForm(!showDespesaForm)} 
               variant="secondary" 
               size="small" 
               icon={Plus}
               className="!bg-red-50 !text-red-700 hover:!bg-red-100 dark:!bg-red-900/20 dark:!text-red-300"
            >
               Adicionar
            </Button>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
             {showDespesaForm && (
                <div className="p-4 bg-gray-50 dark:bg-dark-border/30 border-b border-gray-100 dark:border-dark-border">
                   <h3 className="text-sm font-semibold mb-3">Nova Despesa</h3>
                   <DespesaForm
                      onSubmit={handleAdicionarDespesa}
                      onCancel={() => setShowDespesaForm(false)}
                   />
                </div>
             )}

             {editandoDespesa && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
                   <DespesaForm
                      onSubmit={handleEditarDespesa}
                      onCancel={() => setEditandoDespesa(null)}
                      onDelete={handleExcluirDespesa}
                      initialData={editandoDespesa}
                   />
                </div>
             )}

             <div className="divide-y divide-gray-100 dark:divide-dark-border">
                {quinzenaAtual.parcelas?.length > 0 ? (
                   quinzenaAtual.parcelas.map((parcela) => (
                      <div key={parcela.id} className="p-4 hover:bg-gray-50 dark:hover:bg-dark-border/30 transition-colors flex items-start justify-between group">
                         <div className="flex items-start gap-3">
                            <div className={`mt-1 h-2 w-2 rounded-full ${parcela.pago ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <div>
                               <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {parcela.despesa?.descricao || 'Despesa'}
                                  {parcela.despesa?.parcelas > 1 && (
                                     <span className="text-xs text-gray-500 ml-1">({parcela.numeroParcela}/{parcela.despesa.parcelas})</span>
                                  )}
                               </p>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-border px-2 py-0.5 rounded-full">
                                     {parcela.despesa?.categoria || 'Geral'}
                                  </span>
                                  <span className={`text-xs ${new Date(parcela.dataVencimento) < new Date() && !parcela.pago ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                     Vence {formatDate(parcela.dataVencimento)}
                                  </span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{formatCurrency(parcela.valorParcela)}</p>
                            
                            {!parcela.pago ? (
                               <div className="flex justify-end gap-2 items-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 mr-2">
                                     <button onClick={() => setEditandoDespesa(parcela.despesa)} className="p-1 text-gray-400 hover:text-blue-600">
                                        <Edit className="h-4 w-4" />
                                     </button>
                                     <button onClick={() => handleExcluirDespesa(parcela.despesa)} className="p-1 text-gray-400 hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                     </button>
                                  </div>
                                  <button 
                                     onClick={() => handleMarcarParcelaComoPaga(parcela.id)}
                                     className="text-xs bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-lg transition-colors font-medium"
                                  >
                                     Pagar
                                  </button>
                               </div>
                            ) : (
                               <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded-lg">
                                  <Check className="h-3 w-3" />
                                  Pago
                               </div>
                            )}
                         </div>
                      </div>
                   ))
                ) : (
                   <div className="p-8 text-center text-gray-500 dark:text-gray-400">Nenhuma despesa registrada</div>
                )}
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default QuinzenaPage;
