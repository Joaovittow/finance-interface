import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart
} from 'lucide-react';
import { useFinanceContext } from '../contexts/FinanceContext';
import { formatCurrency, formatMonthYear } from '../utils/formatters';
import Card from '../components/ui/Card';
import CriarMesModal from '../components/mes/CriarMesModal';
import { PieChart as CustomPieChart } from '../components/charts';
import { calcularMesAtivo } from '../utils/dateUtils';

const Dashboard = () => {
  const { meses, loading, carregarMeses } = useFinanceContext();
  const [modalAberto, setModalAberto] = useState(false);
  const [saldoVisivel, setSaldoVisivel] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarMeses();
  }, [carregarMeses]);

  const mesAtivo = calcularMesAtivo();
  const mesAtual =
    meses?.find((m) => m.mes === mesAtivo.mes && m.ano === mesAtivo.ano) ||
    null;

  const totalReceitas =
    mesAtual?.quinzenas?.reduce(
      (total, q) => total + (q.receitas?.reduce((s, r) => s + r.valor, 0) || 0),
      0,
    ) || 0;

  const totalDespesas =
    mesAtual?.quinzenas?.reduce(
      (total, q) =>
        total +
        (q.parcelas
          ?.filter((p) => p.pago)
          .reduce((s, p) => s + (p.valorPago || p.valorParcela), 0) || 0),
      0,
    ) || 0;

  const saldoAtual = totalReceitas - totalDespesas;
  
  // Dados para o gráfico simplificado
  const gastosPorCategoria = {};
  mesAtual?.quinzenas?.forEach(q => {
     q.parcelas?.forEach(p => {
        if(p.despesa?.categoria) {
           gastosPorCategoria[p.despesa.categoria] = (gastosPorCategoria[p.despesa.categoria] || 0) + (p.valorPago || p.valorParcela);
        }
     });
  });
  
  const dadosGrafico = Object.entries(gastosPorCategoria)
     .map(([label, value]) => ({ label, value }))
     .sort((a,b) => b.value - a.value)
     .slice(0, 5); // Top 5
     
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  if (loading && meses?.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header com Saldo e Visibilidade */}
      <div className="flex flex-col gap-1">
         <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <span className="text-sm font-medium">Saldo em conta</span>
            <button onClick={() => setSaldoVisivel(!saldoVisivel)} className="hover:text-brand-600 transition-colors">
               {saldoVisivel ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
         </div>
         <div className="h-10 flex items-center">
            {saldoVisivel ? (
               <h1 className={`text-3xl font-bold tracking-tight ${saldoAtual >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-600'}`}>
                  {formatCurrency(saldoAtual)}
               </h1>
            ) : (
               <div className="h-8 w-40 bg-gray-200 dark:bg-dark-border/50 rounded animate-pulse" />
            )}
         </div>
      </div>

      {/* Cards de Resumo Rápido */}
      <div className="grid grid-cols-2 gap-4">
         <Card className="bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20 shadow-none">
            <div className="flex items-center gap-2 mb-1">
               <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
               </div>
               <span className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase">Receitas</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
               {formatCurrency(totalReceitas)}
            </p>
         </Card>
         
         <Card className="bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20 shadow-none">
            <div className="flex items-center gap-2 mb-1">
               <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
               </div>
               <span className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase">Despesas</span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
               {formatCurrency(totalDespesas)}
            </p>
         </Card>
      </div>

       {/* Ações e Atalhos */}
       <div className="flex flex-col gap-4">
         <button 
           onClick={() => setModalAberto(true)}
           className="flex items-center justify-center gap-2 w-full p-4 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white rounded-2xl shadow-lg transition-all transform active:scale-[0.98]"
         >
           <Plus className="h-5 w-5" />
           <span className="font-semibold">Iniciar Novo Mês</span>
         </button>
       </div>

      {/* Resumo de Gastos (Full Width) */}
      <Card className="flex flex-col shadow-sm border-none bg-white dark:bg-dark-card min-h-[300px]" hover>
         <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-gray-100">Despesas por Categoria</h3>
            <Link to="/relatorios" className="text-xs font-medium text-brand-600 hover:text-brand-700">Ver detalhes</Link>
         </div>
         
         {dadosGrafico.length > 0 ? (
            <div className="flex items-center justify-center py-4 flex-1">
               <CustomPieChart data={dadosGrafico} colors={colors} width={220} height={220} />
            </div>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-gray-400">
               <PieChart className="h-12 w-12 mb-3 opacity-20" />
               <span className="text-sm">Nenhuma despesa registrada neste mês.</span>
               <span className="text-xs text-gray-500 mt-1">Cadastre despesas nas quinzenas para visualizar.</span>
            </div>
         )}
      </Card>

      <CriarMesModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onMesCriado={carregarMeses}
      />
    </div>
  );
};

export default Dashboard;
