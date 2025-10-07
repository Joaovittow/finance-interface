import React, { useEffect, useState } from 'react';
import { PieChart, BarChart } from '../components/charts';
import Card from '../components/ui/Card';
import { useFinanceContext } from '../contexts/FinanceContext';
import { formatCurrency, formatMonthYear } from '../utils/formatters';
import { calcularMesAtivo, mesEhAtivo } from '../utils/dateUtils';

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (mesSelecionado) {
      gerarRelatorio(mesSelecionado);
    }
  }, [mesSelecionado, meses]);

  const gerarRelatorio = (mesId) => {
    setLoading(true);
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
      );

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
          label: quinzena.tipo === 'primeira' ? 'Dia 15' : 'Dia 30',
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
    }, 500);
  };

  const colors = [
    '#3B82F6',
    '#EF4444',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
  ];

  if (!meses.length) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-500 text-center px-3">
          Nenhum mês cadastrado para gerar relatórios.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-3 sm:px-6 lg:px-10 py-4">
      {/* Título */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Relatórios
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Análise detalhada das suas finanças
        </p>
      </div>

      {/* Card de informação */}
      <Card>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm sm:text-base">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Período Ativo</h3>
              <p className="text-blue-700 mt-1">
                O mês ativo é aquele entre <strong>dia 11</strong> e{' '}
                <strong>dia 10 do próximo mês</strong>.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Selecionar Mês */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Selecionar Mês
            </h2>
            <p className="text-sm text-gray-600">
              Escolha o período para visualizar os relatórios
            </p>
          </div>
          <div className="w-full sm:max-w-xs">
            <select
              value={mesSelecionado}
              onChange={(e) => setMesSelecionado(e.target.value)}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm sm:text-base"
              disabled={loading}
            >
              <option value="">Selecione um mês</option>
              {meses.map((mes) => {
                const ehAtivo = mesEhAtivo(mes.mes, mes.ano);
                return (
                  <option key={mes.id} value={mes.id}>
                    {formatMonthYear(mes.mes, mes.ano)} {ehAtivo && '(Ativo)'}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </Card>

      {loading && (
        <div className="flex justify-center items-center py-8 text-gray-500">
          Gerando relatório...
        </div>
      )}

      {!mesSelecionado && !loading && (
        <Card>
          <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
            Selecione um mês para visualizar os relatórios
          </div>
        </Card>
      )}

      {dadosRelatorio && mesSelecionado && !loading && (
        <>
          {/* Cabeçalho */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Relatório - {dadosRelatorio.mes}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Período completo do mês selecionado
                </p>
              </div>
              {mesEhAtivo(
                dadosRelatorio.mesObj.mes,
                dadosRelatorio.mesObj.ano,
              ) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800 self-start sm:self-auto">
                  Mês Ativo
                </span>
              )}
            </div>
          </Card>

          {/* Cards de resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-700 mb-1">
                Total Receitas
              </h3>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {formatCurrency(dadosRelatorio.resumo.totalReceitas)}
              </p>
            </Card>

            <Card>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-700 mb-1">
                Total Despesas
              </h3>
              <p className="text-xl sm:text-2xl font-bold text-red-600">
                {formatCurrency(dadosRelatorio.resumo.totalDespesas)}
              </p>
            </Card>

            <Card>
              <h3 className="text-sm sm:text-lg font-semibold text-gray-700 mb-1">
                Saldo Final
              </h3>
              <p
                className={`text-xl sm:text-2xl font-bold ${
                  dadosRelatorio.resumo.saldo >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {formatCurrency(dadosRelatorio.resumo.saldo)}
              </p>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                Gastos por Categoria
              </h2>
              {dadosRelatorio.categorias.length > 0 ? (
                <PieChart data={dadosRelatorio.categorias} colors={colors} />
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Nenhuma despesa cadastrada
                </div>
              )}
            </Card>

            <Card>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                Comparativo Quinzenas
              </h2>
              {dadosRelatorio.quinzenas.length > 0 ? (
                <div className="space-y-5">
                  <BarChart
                    data={dadosRelatorio.quinzenas.map((q) => ({
                      label: q.label,
                      value: q.receitas,
                    }))}
                    colors={['#10B981']}
                    height={160}
                  />
                  <p className="text-sm text-center text-gray-600">
                    Receitas por Quinzena
                  </p>
                  <BarChart
                    data={dadosRelatorio.quinzenas.map((q) => ({
                      label: q.label,
                      value: q.despesas,
                    }))}
                    colors={['#EF4444']}
                    height={160}
                  />
                  <p className="text-sm text-center text-gray-600">
                    Despesas por Quinzena
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Nenhum dado disponível
                </div>
              )}
            </Card>
          </div>

          {/* Tabela detalhada */}
          <Card>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              Detalhamento por Categoria
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 sm:py-3 sm:px-4 font-medium text-gray-700">
                      Categoria
                    </th>
                    <th className="text-right py-2 px-3 sm:py-3 sm:px-4 font-medium text-gray-700">
                      Valor
                    </th>
                    <th className="text-right py-2 px-3 sm:py-3 sm:px-4 font-medium text-gray-700">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dadosRelatorio.categorias.map((categoria, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-2 px-3 sm:py-3 sm:px-4 text-gray-800">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{
                              backgroundColor: colors[index % colors.length],
                            }}
                          />
                          <span>{categoria.label}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 text-right font-medium text-gray-800">
                        {formatCurrency(categoria.value)}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 text-right text-gray-600">
                        {dadosRelatorio.resumo.totalDespesas > 0
                          ? (
                              (categoria.value /
                                dadosRelatorio.resumo.totalDespesas) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </td>
                    </tr>
                  ))}
                  {dadosRelatorio.categorias.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-8 text-center text-gray-500"
                      >
                        Nenhuma despesa encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
                {dadosRelatorio.categorias.length > 0 && (
                  <tfoot>
                    <tr className="bg-gray-50 font-semibold">
                      <td className="py-2 px-3 sm:py-3 sm:px-4">Total</td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 text-right">
                        {formatCurrency(dadosRelatorio.resumo.totalDespesas)}
                      </td>
                      <td className="py-2 px-3 sm:py-3 sm:px-4 text-right">
                        100%
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default RelatoriosPage;
