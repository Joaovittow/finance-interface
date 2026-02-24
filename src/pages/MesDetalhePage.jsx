import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Plus,
  Check,
  DollarSign,
  Edit,
  Trash2,
  ChevronLeft,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { useFinanceContext } from '../contexts/FinanceContext';
import {
  formatCurrency,
  formatDate,
  formatMonthYear,
} from '../utils/formatters';
import { receitaContaNoMes } from '../utils/dateUtils';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import DespesaForm from '../components/forms/DespesaForm';
import ReceitaForm from '../components/forms/ReceitaForm';

const MesDetalhePage = () => {
  const { id } = useParams();
  const {
    mesAtual,
    loading,
    carregarMes,
    adicionarReceita,
    adicionarDespesa,
    marcarParcelaComoPaga,
    atualizarReceita,
    excluirReceita,
    atualizarDespesa,
    excluirDespesa,
  } = useFinanceContext();

  const [showReceitaModal, setShowReceitaModal] = useState(false);
  const [showDespesaModal, setShowDespesaModal] = useState(false);
  const [editandoReceita, setEditandoReceita] = useState(null);
  const [editandoDespesa, setEditandoDespesa] = useState(null);

  useEffect(() => {
    if (id) {
      carregarMes(id);
    }
  }, [id, carregarMes]);

  const handleAdicionarReceita = async (receitaData) => {
    try {
      await adicionarReceita(id, receitaData);
      setShowReceitaModal(false);
    } catch (error) {
      // Error handled by context
    }
  };

  const handleAdicionarDespesa = async (despesaData) => {
    try {
      await adicionarDespesa(id, despesaData);
      setShowDespesaModal(false);
      await carregarMes(id);
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
      setEditandoReceita(null);
    } catch (error) {
      console.error('Erro ao excluir receita:', error);
    }
  };

  const handleEditarDespesa = async (despesaData) => {
    try {
      await atualizarDespesa(editandoDespesa.id, despesaData);
      setEditandoDespesa(null);
    } catch (error) {
      // Error handled by context
    }
  };

  const handleExcluirDespesa = async (despesa) => {
    try {
      await excluirDespesa(despesa.id);
      setEditandoDespesa(null);
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

  if (loading && !mesAtual) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!mesAtual) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>Mês não encontrado</p>
        <Link to="/meses" className="text-brand-600 hover:underline mt-2 inline-block">Voltar para Meses</Link>
      </div>
    );
  }

  const { calculos } = mesAtual;

  const isReceitaFutura = (receita) =>
    !!receita.dataDeposito && !receitaContaNoMes(receita);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link to="/meses" className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors w-fit">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para Meses
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {formatMonthYear(mesAtual.mes, mesAtual.ano)}
             </h1>
             {mesAtual.saldoAnterior !== undefined && mesAtual.saldoAnterior !== 0 && (
               <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4" />
                  Saldo mês anterior: <span className={`font-semibold ${mesAtual.saldoAnterior >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(mesAtual.saldoAnterior)}</span>
               </p>
             )}
          </div>
          
          <div className="bg-brand-50 dark:bg-brand-900/20 px-4 py-2 rounded-xl border border-brand-100 dark:border-brand-900/30">
             <span className="text-xs text-brand-600 dark:text-brand-400 uppercase font-semibold tracking-wider">Saldo do Mês</span>
             <p className={`text-xl font-bold ${calculos.saldo >= 0 ? 'text-brand-700 dark:text-brand-300' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(calculos.saldo)}
             </p>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
               onClick={() => setShowReceitaModal(true)} 
               variant="secondary" 
               size="small" 
               icon={Plus}
               className="!bg-green-50 !text-green-700 hover:!bg-green-100 dark:!bg-green-900/20 dark:!text-green-300"
            >
               Adicionar
            </Button>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
             <div className="divide-y divide-gray-100 dark:divide-dark-border">
                {mesAtual.receitas?.length > 0 ? (
                   mesAtual.receitas.map((receita) => (
                      <div
                        key={receita.id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-dark-border/30 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {receita.descricao}
                          </p>
                          {isReceitaFutura(receita) && (
                            <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-900/30">
                              Agendada para {formatDate(receita.dataDeposito)}
                            </span>
                          )}
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(receita.valor)}
                          </span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                              onClick={() => setEditandoReceita(receita)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleExcluirReceita(receita)}
                              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
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
               onClick={() => setShowDespesaModal(true)} 
               variant="secondary" 
               size="small" 
               icon={Plus}
               className="!bg-red-50 !text-red-700 hover:!bg-red-100 dark:!bg-red-900/20 dark:!text-red-300"
            >
               Adicionar
            </Button>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
             <div className="divide-y divide-gray-100 dark:divide-dark-border">
                {mesAtual.parcelas?.length > 0 ? (
                   mesAtual.parcelas.map((parcela) => (
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
                                  {parcela.dataVencimento && (
                                    <span className={`text-xs ${new Date(parcela.dataVencimento) < new Date() && !parcela.pago ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                       Vence {formatDate(parcela.dataVencimento)}
                                    </span>
                                  )}
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

      {/* Modal: Nova Receita */}
      <Modal
        isOpen={showReceitaModal}
        onClose={() => setShowReceitaModal(false)}
        title="Nova Receita"
        size="sm"
      >
        <ReceitaForm
          onSubmit={handleAdicionarReceita}
          onCancel={() => setShowReceitaModal(false)}
        />
      </Modal>

      {/* Modal: Editar Receita */}
      <Modal
        isOpen={!!editandoReceita}
        onClose={() => setEditandoReceita(null)}
        title="Editar Receita"
        size="sm"
      >
        {editandoReceita && (
          <ReceitaForm
            onSubmit={handleEditarReceita}
            onCancel={() => setEditandoReceita(null)}
            onDelete={handleExcluirReceita}
            initialData={editandoReceita}
          />
        )}
      </Modal>

      {/* Modal: Nova Despesa */}
      <Modal
        isOpen={showDespesaModal}
        onClose={() => setShowDespesaModal(false)}
        title="Nova Despesa"
        size="md"
      >
        <DespesaForm
          onSubmit={handleAdicionarDespesa}
          onCancel={() => setShowDespesaModal(false)}
        />
      </Modal>

      {/* Modal: Editar Despesa */}
      <Modal
        isOpen={!!editandoDespesa}
        onClose={() => setEditandoDespesa(null)}
        title="Editar Despesa"
        size="md"
      >
        {editandoDespesa && (
          <DespesaForm
            onSubmit={handleEditarDespesa}
            onCancel={() => setEditandoDespesa(null)}
            onDelete={handleExcluirDespesa}
            initialData={editandoDespesa}
          />
        )}
      </Modal>
    </div>
  );
};

export default MesDetalhePage;
