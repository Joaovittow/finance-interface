import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, ChevronRight, Trash2, CalendarDays } from 'lucide-react';
import { useFinanceContext } from '../contexts/FinanceContext';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { formatMonthYear } from '../utils/formatters';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import CriarMesModal from '../components/mes/CriarMesModal';

const MesesPage = () => {
  const { meses, loading, excluirMes, carregarMeses } = useFinanceContext();
  const [modalAberto, setModalAberto] = useState(false);
  const {
    isOpen,
    showConfirm,
    hideConfirm,
    handleConfirm,
    title,
    message,
    type,
  } = useConfirmDialog();

  useEffect(() => {
    carregarMeses();
  }, [carregarMeses]);

  const handleExcluirMes = (e, mes) => {
    e.preventDefault(); // Prevent navigation
    showConfirm({
      title: 'Excluir Mês',
      message: `Deseja realmente excluir ${formatMonthYear(mes.mes, mes.ano)}?`,
      type: 'danger',
      onConfirm: async () => await excluirMes(mes.id),
    });
  };

  const handleMesCriado = () => carregarMeses();

  const mesesAgrupados = meses.reduce((acc, mes) => {
    if (!acc[mes.ano]) {
      acc[mes.ano] = [];
    }
    acc[mes.ano].push(mes);
    return acc;
  }, {});

  if (loading && meses.length === 0) {
     return (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
     )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Meus Meses</h1>
           <p className="text-gray-500 dark:text-gray-400">Gerencie seus períodos financeiros</p>
        </div>
        <Button onClick={() => setModalAberto(true)} icon={Plus}>
           Novo Mês
        </Button>
      </div>

      {meses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-dark-card rounded-2xl border border-dashed border-gray-300 dark:border-dark-border text-center">
           <div className="h-16 w-16 bg-gray-100 dark:bg-dark-border rounded-full flex items-center justify-center mb-4">
              <CalendarDays className="h-8 w-8 text-gray-400" />
           </div>
           <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Nenhum mês encontrado</h3>
           <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
             Comece criando seu primeiro mês para organizar suas finanças quinzenais.
           </p>
           <Button onClick={() => setModalAberto(true)} variant="primary">
             Criar Primeiro Mês
           </Button>
        </div>
      ) : (
         <div className="space-y-6">
            {Object.entries(mesesAgrupados)
              .sort(([a], [b]) => b - a)
              .map(([ano, listaMeses]) => (
                 <div key={ano} className="space-y-3">
                    <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-1">{ano}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {listaMeses.sort((a,b) => b.mes - a.mes).map((mes) => (
                          <Link 
                             key={mes.id}
                             to={`/quinzena/${mes.quinzenas?.[0]?.id}`} // Link to first quinzena generally, or maybe a MesDetails page? Current system links to quinzena.
                             // Actually, original code had links to individual quinzenas.
                             // Maybe I should link to a month details? Or keep listing quinzenas?
                             // Let's create a Card that lists quinzenas inside.
                             className="group bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-dark-border shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block relative"
                          >
                             <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                   <div className="h-10 w-10 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
                                      <Calendar className="h-5 w-5" />
                                   </div>
                                   <div>
                                      <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 transition-colors">
                                         {formatMonthYear(mes.mes, mes.ano)}
                                      </h3>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                         {mes.quinzenas?.length || 0} quinzenas
                                      </span>
                                   </div>
                                </div>
                                <button 
                                   onClick={(e) => handleExcluirMes(e, mes)}
                                   className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors z-10"
                                >
                                   <Trash2 className="h-4 w-4" />
                                </button>
                             </div>

                             <div className="space-y-2">
                                {mes.quinzenas?.map((q) => (
                                   <div key={q.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-gray-50 dark:bg-dark-border/30 hover:bg-gray-100 dark:hover:bg-dark-border/50 transition-colors">
                                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                                         {q.tipo === 'primeira' ? '1ª Quinzena (Dia 15)' : '2ª Quinzena (Dia 30)'}
                                      </span>
                                      <ChevronRight className="h-4 w-4 text-gray-400" />
                                   </div>
                                ))}
                             </div>
                          </Link>
                       ))}
                    </div>
                 </div>
              ))}
         </div>
      )}

      <ConfirmDialog
        isOpen={isOpen}
        onClose={hideConfirm}
        onConfirm={handleConfirm}
        title={title}
        message={message}
        type={type}
      />

      <CriarMesModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onMesCriado={handleMesCriado}
      />
    </div>
  );
};

export default MesesPage;
