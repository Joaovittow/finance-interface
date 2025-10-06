import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Calendar, TrendingUp, TrendingDown, DollarSign, Info } from 'lucide-react'
import { useFinanceContext } from '../contexts/FinanceContext'
import { formatCurrency, getCurrentMonthYear, formatMonthYear } from '../utils/formatters'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import CriarMesModal from '../components/mes/CriarMesModal'

const Dashboard = () => {
  const { 
    meses, 
    loading, 
    carregarMeses 
  } = useFinanceContext()

  const [modalAberto, setModalAberto] = useState(false)

  useEffect(() => {
    carregarMeses()
  }, [carregarMeses])

  const mesAtual = meses?.find(mes => mes.ativo) || null
  
  const totalReceitas = mesAtual?.quinzenas?.reduce((total, quinzena) => 
    total + (quinzena.receitas?.reduce((sum, rec) => sum + rec.valor, 0) || 0), 0
  ) || 0

  const totalDespesas = mesAtual?.quinzenas?.reduce((total, quinzena) => 
    total + (quinzena.parcelas?.filter(p => p.pago)
      .reduce((sum, parc) => sum + (parc.valorPago || parc.valorParcela), 0) || 0), 0
  ) || 0

  const saldoAtual = totalReceitas - totalDespesas

  // Verificar se já existe o mês atual
  const { mes: mesAtualNum, ano: anoAtual } = getCurrentMonthYear()
  const mesAtualJaExiste = meses?.some(m => m.mes === mesAtualNum && m.ano === anoAtual) || false

  const handleMesCriado = () => {
    // Recarregar dados após criar mês
    carregarMeses()
  }

  if (loading && meses?.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Financeiro</h1>
          <p className="text-gray-600 mt-2">
            Visão geral do seu controle financeiro quinzenal
          </p>
        </div>
        <Button
          onClick={() => setModalAberto(true)}
          icon={Plus}
          variant="primary"
        >
          Novo Mês
        </Button>
      </div>


      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Saldo Atual</h3>
            <DollarSign className={`h-5 w-5 ${saldoAtual >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
          <p className={`text-2xl font-bold mt-2 ${saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(saldoAtual)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {mesAtual ? formatMonthYear(mesAtual.mes, mesAtual.ano) : 'Nenhum mês ativo'}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Total Receitas</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {formatCurrency(totalReceitas)}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Despesas Pagas</h3>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {formatCurrency(totalDespesas)}
          </p>
        </Card>
      </div>

      {/* Meses Recentes */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Meses Recentes</h2>
          <Link 
            to="/meses"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todos
          </Link>
        </div>

        {!meses || meses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum mês cadastrado ainda.</p>
            <Button
              onClick={() => setModalAberto(true)}
              variant="primary"
              className="mt-4"
            >
              Criar primeiro mês
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {meses.slice(0, 5).map((mes) => {
              const isMesAtual = mes.mes === mesAtualNum && mes.ano === anoAtual
              return (
                <div key={mes.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-800">
                        {formatMonthYear(mes.mes, mes.ano)}
                      </h3>
                      {isMesAtual && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          Atual
                        </span>
                      )}
                      {mes.ativo && !isMesAtual && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                          Ativo
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {mes.quinzenas?.length || 0} quinzenas • 
                      {mes.quinzenas?.reduce((total, q) => total + (q.receitas?.length || 0), 0) || 0} receitas
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {mes.quinzenas?.map((quinzena) => (
                      <Link
                        key={quinzena.id}
                        to={`/quinzena/${quinzena.id}`}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        {quinzena.tipo === 'primeira' ? 'Dia 15' : 'Dia 30'}
                      </Link>
                    )) || []}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Modal de Criar Mês */}
      <CriarMesModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onMesCriado={handleMesCriado}
      />
    </div>
  )
}

export default Dashboard