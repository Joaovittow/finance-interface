import React, { useEffect, useState } from 'react';
import { PieChart, BarChart } from '../components/charts';
import Card from '../components/ui/Card';
import { useFinanceContext } from '../contexts/FinanceContext';
import { formatCurrency, formatMonthYear } from '../utils/formatters';
import { calcularMesAtivo, mesEhAtivo } from '../utils/dateUtils';
import { ArrowUpRight, ArrowDownLeft, Calendar, Info, BarChart3 } from 'lucide-react';

const RelatoriosPage = () => {
  const { meses } = useFinanceContext();
  const [dadosRelatorio, setDadosRelatorio] = useState(null);
  const [mesSelecionado, setMesSelecionado] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (meses.length > 0) {
      const mesAtivoCalculado = calcularMesAtivo();
      const mesAtivo =
        meses.find(
          (mes) =>
            mes.mes === mesAtivoCalculado.mes &&
            mes.ano === mesAtivoCalculado.ano,
        ) || meses[0];
      if (mesAtivo) {
        setMesSelecionado(mesAtivo.id);
      }
    }
  }, [meses]);

  useEffect(() => {
    if (mesSelecionado) {
      gerarRelatorio(mesSelecionado);
    }
  }, [mesSelecionado, meses]);

  const gerarRelatorio = (mesId) => {
    setLoading(true);
    // Simulating calculation delay for smooth transition
    setTimeout(() => {
      if (!meses.length) {
        setDadosRelatorio(null);
        setLoading(false);
        return;
      }

      const mes = meses.find((m) => m.id === mesId);
      if (!mes) {
        setDadosRelatorio(null);
        setLoading(false);
        return;
      }

      const gastosPorCategoria = {};
      mes.quinzenas.forEach((quinzena) => {
        quinzena.parcelas.forEach((parcela) => {
          if (parcela.despesa && parcela.despesa.categoria) {
            const categoria = parcela.despesa.categoria;
            if (!gastosPorCategoria[categoria]) {
              gastosPorCategoria[categoria] = 0;
            }
            gastosPorCategoria[categoria] += parcela.valorParcela;
          }
        });
      });

      const dadosCategorias = Object.entries(gastosPorCategoria).map(
        ([categoria, valor]) => ({
          label: categoria.charAt(0).toUpperCase() + categoria.slice(1),
          value: valor,
        }),
      ).sort((a,b) => b.value - a.value);

      const dadosQuinzenas = mes.quinzenas.map((quinzena) => {
        const totalReceitas = quinzena.receitas.reduce(
          (sum, rec) => sum + rec.valor,
          0,
        );
        const totalDespesas = quinzena.parcelas
          .filter((p) => p.pago)
          .reduce(
            (sum, parc) => sum + (parc.valorPago || parc.valorParcela),
            0,
          );
        return {
          label: quinzena.tipo === 'primeira' ? '1ª Quiz.' : '2ª Quiz.',
          receitas: totalReceitas,
          despesas: totalDespesas,
        };
      });

      setDadosRelatorio({
        mes: formatMonthYear(mes.mes, mes.ano),
        mesObj: mes,
        categorias: dadosCategorias,
        quinzenas: dadosQuinzenas,
        resumo: {
          totalReceitas: mes.quinzenas.reduce(
            (total, q) =>
              total + q.receitas.reduce((sum, r) => sum + r.valor, 0),
            0,
          ),
          totalDespesas: mes.quinzenas.reduce(
            (total, q) =>
              total +
              q.parcelas
                .filter((p) => p.pago)
                .reduce((sum, p) => sum + (p.valorPago || p.valorParcela), 0),
            0,
          ),
          saldo: mes.quinzenas.reduce(
            (total, q) =>
              total +
              (q.saldoAnterior +
                q.receitas.reduce((sum, r) => sum + r.valor, 0) -
                q.parcelas
                  .filter((p) => p.pago)
                  .reduce(
                    (sum, p) => sum + (p.valorPago || p.valorParcela),
                    0,
                  )),
            0,
          ),
        },
      });
      setLoading(false);
    }, 300);
  };

  const colors = [
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#06B6D4', // Cyan
  ];

  if (!meses.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] text-center p-6">
        <div className="bg-gray-100 dark:bg-dark-card p-4 rounded-full mb-4">
           <BarChart3 className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Sem dados para relatórios</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
           Cadastre meses e transações para visualizar suas estatísticas financeiras.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Relatórios</h1>
           <p className="text-gray-500 dark:text-gray-400">Análise detalhada de gastos e receitas</p>
        </div>

        <div className="w-full md:w-64">
           <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <select
                 value={mesSelecionado}
                 onChange={(e) => setMesSelecionado(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
                 disabled={loading}
              >
                 {meses.map((mes) => (
                    <option key={mes.id} value={mes.id}>
                       {formatMonthYear(mes.mes, mes.ano)} {mesEhAtivo(mes.mes, mes.ano) ? '(Atual)' : ''}
                    </option>
                 ))}
              </select>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : dadosRelatorio && mesSelecionado ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-white dark:bg-dark-card border-none shadow-soft">
               <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                     <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Receitas</span>
               </div>
               <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(dadosRelatorio.resumo.totalReceitas)}</p>
            </Card>

            <Card className="bg-white dark:bg-dark-card border-none shadow-soft">
               <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg">
                     <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Despesas</span>
               </div>
               <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(dadosRelatorio.resumo.totalDespesas)}</p>
            </Card>

            <Card className={`border-none shadow-soft ${dadosRelatorio.resumo.saldo >= 0 ? 'bg-brand-600' : 'bg-red-600'}`}>
               <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-white/80 uppercase">Saldo Final</span>
               </div>
               <p className="text-2xl font-bold text-white">{formatCurrency(dadosRelatorio.resumo.saldo)}</p>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-dark-card border-none shadow-soft flex flex-col items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 self-start w-full border-b border-gray-100 dark:border-dark-border pb-2">Gastos por Categoria</h3>
              <div className="w-full flex-1 flex items-center justify-center">
                 <PieChart data={dadosRelatorio.categorias} colors={colors} />
              </div>
            </Card>

            <Card className="bg-white dark:bg-dark-card border-none shadow-soft flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 border-b border-gray-100 dark:border-dark-border pb-2">Balanço Quinzenal</h3>
              
              <div className="flex-1 flex flex-col justify-center space-y-8">
                 <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 pl-1">Receitas</h4>
                    <BarChart
                       data={dadosRelatorio.quinzenas.map((q) => ({ label: q.label, value: q.receitas }))}
                       colors={['#10B981', '#34D399']}
                       height={100}
                    />
                 </div>
                 
                 <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 pl-1">Despesas Pagas</h4>
                    <BarChart
                       data={dadosRelatorio.quinzenas.map((q) => ({ label: q.label, value: q.despesas }))}
                       colors={['#EF4444', '#F87171']}
                       height={100}
                    />
                 </div>
              </div>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-white dark:bg-dark-card border-none shadow-soft overflow-hidden">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 px-2">Detalhamento</h3>
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-dark-border/30 text-gray-500 dark:text-gray-400 font-medium">
                  <tr>
                    <th className="py-3 px-6">Categoria</th>
                    <th className="py-3 px-6 text-right">Valor</th>
                    <th className="py-3 px-6 text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                  {dadosRelatorio.categorias.map((cat, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-dark-border/10 transition-colors">
                      <td className="py-3 px-6 font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                         <div className="w-2 h-8 rounded-r" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                         {cat.label}
                      </td>
                      <td className="py-3 px-6 text-right text-gray-700 dark:text-gray-300">
                         {formatCurrency(cat.value)}
                      </td>
                      <td className="py-3 px-6 text-right text-gray-500 dark:text-gray-400">
                         {((cat.value / dadosRelatorio.resumo.totalDespesas) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  {dadosRelatorio.categorias.length === 0 && (
                     <tr>
                        <td colSpan={3} className="py-8 text-center text-gray-500">Nenhuma despesa no período</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-dark-card rounded-2xl border border-dashed border-gray-300 dark:border-dark-border">
          <Info className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Selecione um mês para visualizar o relatório</p>
        </div>
      )}
    </div>
  );
};

export default RelatoriosPage;
