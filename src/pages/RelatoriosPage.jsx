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

  // Encontrar o mês ativo baseado na regra personalizada
  useEffect(() => {
    if (meses.length > 0) {
      const mesAtivoCalculado = calcularMesAtivo();

      // Buscar o mês que corresponde ao período ativo
      const mesAtivo =
        meses.find(
          (mes) =>
            mes.mes === mesAtivoCalculado.mes &&
            mes.ano === mesAtivoCalculado.ano,
        ) || meses[0]; // Fallback para o primeiro mês se não encontrar

      if (mesAtivo) {
        setMesSelecionado(mesAtivo.id);
      }
    }
  }, [meses]);

  // Gerar relatório quando o mês selecionado mudar
  useEffect(() => {
    if (mesSelecionado) {
      gerarRelatorio(mesSelecionado);
    }
  }, [mesSelecionado, meses]);

  const gerarRelatorio = (mesId) => {
    setLoading(true);

    // Simular um pequeno delay para melhor UX
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

      // Dados para gráfico de pizza (categorias)
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

      // Dados para gráfico de barras (quinzenas)
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
        <div className="text-gray-500">
          Nenhum mês cadastrado para gerar relatórios.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Relatórios</h1>
          <p className="text-gray-600 mt-2">
            Análise detalhada das suas finanças
          </p>
        </div>
      </div>

      {/* Informação do Período Ativo */}
      <Card>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
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
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Período Ativo
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>
                  O mês considerado <strong>ativo</strong> é aquele entre{' '}
                  <strong>dia 11 do mês atual e dia 10 do próximo mês</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Seletor de Mês */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Selecionar Mês
            </h2>
            <p className="text-sm text-gray-600">
              Escolha o período para visualizar os relatórios
            </p>
          </div>
          <div className="flex-1 max-w-xs">
            <select
              value={mesSelecionado}
              onChange={(e) => setMesSelecionado(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Gerando relatório...</div>
        </div>
      )}

      {!mesSelecionado && !loading && (
        <Card>
          <div className="text-center py-8 text-gray-500">
            <p>Selecione um mês para visualizar os relatórios</p>
          </div>
        </Card>
      )}

      {dadosRelatorio && mesSelecionado && !loading && (
        <>
          {/* Header do Relatório com Indicador de Ativo */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Relatório - {dadosRelatorio.mes}
                </h2>
                <p className="text-gray-600 mt-1">
                  Período completo do mês selecionado
                </p>
              </div>
              {mesEhAtivo(
                dadosRelatorio.mesObj.mes,
                dadosRelatorio.mesObj.ano,
              ) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Mês Ativo
                </span>
              )}
            </div>
          </Card>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Receitas
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(dadosRelatorio.resumo.totalReceitas)}
              </p>
              <p className="text-sm text-gray-500 mt-1">{dadosRelatorio.mes}</p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Despesas
              </h3>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(dadosRelatorio.resumo.totalDespesas)}
              </p>
              <p className="text-sm text-gray-500 mt-1">{dadosRelatorio.mes}</p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Saldo Final
              </h3>
              <p
                className={`text-2xl font-bold ${
                  dadosRelatorio.resumo.saldo >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {formatCurrency(dadosRelatorio.resumo.saldo)}
              </p>
              <p className="text-sm text-gray-500 mt-1">{dadosRelatorio.mes}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Pizza - Categorias */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Gastos por Categoria - {dadosRelatorio.mes}
              </h2>
              {dadosRelatorio.categorias.length > 0 ? (
                <PieChart data={dadosRelatorio.categorias} colors={colors} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhuma despesa cadastrada para análise</p>
                </div>
              )}
            </Card>

            {/* Gráfico de Barras - Quinzenas */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Comparativo entre Quinzenas - {dadosRelatorio.mes}
              </h2>
              {dadosRelatorio.quinzenas.length > 0 ? (
                <div className="space-y-6">
                  <BarChart
                    data={dadosRelatorio.quinzenas.map((q) => ({
                      label: q.label,
                      value: q.receitas,
                    }))}
                    colors={['#10B981']}
                    height={150}
                  />
                  <div className="text-sm text-gray-600 text-center">
                    Receitas por Quinzena
                  </div>

                  <BarChart
                    data={dadosRelatorio.quinzenas.map((q) => ({
                      label: q.label,
                      value: q.despesas,
                    }))}
                    colors={['#EF4444']}
                    height={150}
                  />
                  <div className="text-sm text-gray-600 text-center">
                    Despesas por Quinzena
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum dado disponível para comparação</p>
                </div>
              )}
            </Card>
          </div>

          {/* Tabela Detalhada */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Detalhamento por Categoria - {dadosRelatorio.mes}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Categoria
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Valor Gasto
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                      Percentual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dadosRelatorio.categorias.map((categoria, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-800">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{
                              backgroundColor: colors[index % colors.length],
                            }}
                          />
                          <span>{categoria.label}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-800 font-medium">
                        {formatCurrency(categoria.value)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
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
                        Nenhuma despesa encontrada para este período
                      </td>
                    </tr>
                  )}
                </tbody>
                {dadosRelatorio.categorias.length > 0 && (
                  <tfoot>
                    <tr className="bg-gray-50 font-semibold">
                      <td className="py-3 px-4 text-gray-800">Total</td>
                      <td className="py-3 px-4 text-right text-gray-800">
                        {formatCurrency(dadosRelatorio.resumo.totalDespesas)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-800">
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
