import React, { useEffect, useState } from 'react'
import { PieChart, BarChart } from '../components/charts'
import Card from '../components/ui/Card'
import { useFinanceContext } from '../contexts/FinanceContext'
import { formatCurrency, formatMonthYear } from '../utils/formatters'

const RelatoriosPage = () => {
  const { meses } = useFinanceContext()
  const [dadosRelatorio, setDadosRelatorio] = useState(null)

  useEffect(() => {
    gerarRelatorio()
  }, [meses])

  const gerarRelatorio = () => {
    if (!meses.length) {
      setDadosRelatorio(null)
      return
    }

    const mesAtual = meses.find(mes => mes.ativo) || meses[0]
    
    // Dados para gráfico de pizza (categorias)
    const gastosPorCategoria = {}
    mesAtual.quinzenas.forEach(quinzena => {
      quinzena.parcelas.forEach(parcela => {
        const categoria = parcela.despesa.categoria
        if (!gastosPorCategoria[categoria]) {
          gastosPorCategoria[categoria] = 0
        }
        gastosPorCategoria[categoria] += parcela.valorParcela
      })
    })

    const dadosCategorias = Object.entries(gastosPorCategoria).map(([categoria, valor]) => ({
      label: categoria.charAt(0).toUpperCase() + categoria.slice(1),
      value: valor
    }))

    // Dados para gráfico de barras (quinzenas)
    const dadosQuinzenas = mesAtual.quinzenas.map(quinzena => {
      const totalReceitas = quinzena.receitas.reduce((sum, rec) => sum + rec.valor, 0)
      const totalDespesas = quinzena.parcelas
        .filter(p => p.pago)
        .reduce((sum, parc) => sum + (parc.valorPago || parc.valorParcela), 0)
      
      return {
        label: quinzena.tipo === 'primeira' ? 'Dia 15' : 'Dia 30',
        receitas: totalReceitas,
        despesas: totalDespesas
      }
    })

    setDadosRelatorio({
      mes: formatMonthYear(mesAtual.mes, mesAtual.ano),
      categorias: dadosCategorias,
      quinzenas: dadosQuinzenas,
      resumo: {
        totalReceitas: mesAtual.quinzenas.reduce((total, q) => 
          total + q.receitas.reduce((sum, r) => sum + r.valor, 0), 0
        ),
        totalDespesas: mesAtual.quinzenas.reduce((total, q) => 
          total + q.parcelas
            .filter(p => p.pago)
            .reduce((sum, p) => sum + (p.valorPago || p.valorParcela), 0), 0
        ),
        saldo: mesAtual.quinzenas.reduce((total, q) => 
          total + (q.saldoAnterior + q.receitas.reduce((sum, r) => sum + r.valor, 0) - 
          q.parcelas.filter(p => p.pago).reduce((sum, p) => sum + (p.valorPago || p.valorParcela), 0)), 0
        )
      }
    })
  }

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4']

  if (!dadosRelatorio) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-500">Carregando relatórios...</div>
      </div>
    )
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

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Receitas</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(dadosRelatorio.resumo.totalReceitas)}
          </p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Despesas</h3>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(dadosRelatorio.resumo.totalDespesas)}
          </p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Saldo Final</h3>
          <p className={`text-2xl font-bold ${
            dadosRelatorio.resumo.saldo >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(dadosRelatorio.resumo.saldo)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Categorias */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Gastos por Categoria - {dadosRelatorio.mes}
          </h2>
          {dadosRelatorio.categorias.length > 0 ? (
            <PieChart 
              data={dadosRelatorio.categorias}
              colors={colors}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma despesa cadastrada para análise</p>
            </div>
          )}
        </Card>

        {/* Gráfico de Barras - Quinzenas */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Comparativo entre Quinzenas
          </h2>
          {dadosRelatorio.quinzenas.length > 0 ? (
            <div className="space-y-6">
              <BarChart 
                data={dadosRelatorio.quinzenas.map(q => ({
                  label: q.label,
                  value: q.receitas
                }))}
                colors={['#10B981']}
                height={150}
              />
              <div className="text-sm text-gray-600 text-center">
                Receitas por Quinzena
              </div>
              
              <BarChart 
                data={dadosRelatorio.quinzenas.map(q => ({
                  label: q.label,
                  value: q.despesas
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
          Detalhamento por Categoria
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Categoria</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Valor Gasto</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Percentual</th>
              </tr>
            </thead>
            <tbody>
              {dadosRelatorio.categorias.map((categoria, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span>{categoria.label}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-800 font-medium">
                    {formatCurrency(categoria.value)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {dadosRelatorio.resumo.totalDespesas > 0 
                      ? ((categoria.value / dadosRelatorio.resumo.totalDespesas) * 100).toFixed(1)
                      : 0
                    }%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default RelatoriosPage