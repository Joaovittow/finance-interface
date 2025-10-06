import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Calendar, Edit, Trash2 } from 'lucide-react'
import { useFinanceContext } from '../contexts/FinanceContext'
import { useConfirmDialog } from '../hooks/useConfirmDialog'
import { formatMonthYear } from '../utils/formatters'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import CriarMesModal from '../components/mes/CriarMesModal'

const MesesPage = () => {
  const { meses, loading, excluirMes, carregarMeses } = useFinanceContext()
  const [modalAberto, setModalAberto] = useState(false)
  
  const {
    isOpen: isConfirmOpen,
    title: confirmTitle,
    message: confirmMessage,
    type: confirmType,
    showConfirm,
    hideConfirm,
    handleConfirm
  } = useConfirmDialog()

  useEffect(() => {
    carregarMeses()
  }, [carregarMeses])

  const handleExcluirMes = (mes) => {
    showConfirm({
      title: "Excluir Mês",
      message: `Tem certeza que deseja excluir o mês ${formatMonthYear(mes.mes, mes.ano)}? Esta ação não pode ser desfeita e excluirá todas as receitas e despesas associadas.`,
      type: "danger",
      onConfirm: () => excluirMesConfirmado(mes.id)
    })
  }

  const excluirMesConfirmado = async (mesId) => {
    try {
      await excluirMes(mesId)
      // O estado é atualizado automaticamente pelo hook
    } catch (error) {
      // Error handled by context
    }
  }

  const handleMesCriado = () => {
    carregarMeses()
  }

  const mesesAno = meses.reduce((acc, mes) => {
    const ano = mes.ano
    if (!acc[ano]) acc[ano] = []
    acc[ano].push(mes)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestão de Meses</h1>
          <p className="text-gray-600 mt-2">
            Controle seus períodos mensais e quinzenais
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

      {/* Lista de Meses por Ano */}
      {Object.entries(mesesAno)
        .sort(([anoA], [anoB]) => anoB - anoA)
        .map(([ano, mesesDoAno]) => (
          <Card key={ano}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
              {ano}
            </h2>
            <div className="space-y-3">
              {mesesDoAno
                .sort((a, b) => b.mes - a.mes)
                .map((mes) => (
                  <div 
                    key={mes.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {formatMonthYear(mes.mes, mes.ano)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {mes.quinzenas.length} quinzenas • 
                          {mes.ativo && <span className="text-green-600 ml-1">Ativo</span>}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {mes.quinzenas.map((quinzena) => (
                        <Link
                          key={quinzena.id}
                          to={`/quinzena/${quinzena.id}`}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          {quinzena.tipo === 'primeira' ? 'Dia 15' : 'Dia 30'}
                        </Link>
                      ))}
                      
                      <button 
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Editar mês"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        onClick={() => handleExcluirMes(mes)}
                        title="Excluir mês"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          </Card>
        ))
      }

      {/* Estado Vazio */}
      {!loading && meses.length === 0 && (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum mês cadastrado
            </h3>
            <p className="mb-4">
              Comece criando seu primeiro mês para organizar suas finanças.
            </p>
            <Button
              onClick={() => setModalAberto(true)}
              variant="primary"
              icon={Plus}
            >
              Criar Primeiro Mês
            </Button>
          </div>
        </Card>
      )}

      {/* Loading */}
      {loading && meses.length === 0 && (
        <Card>
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Carregando meses...</div>
          </div>
        </Card>
      )}

      {/* Dialog de Confirmação */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={hideConfirm}
        onConfirm={handleConfirm}
        title={confirmTitle}
        message={confirmMessage}
        type={confirmType}
      />

      {/* Modal de Criar Mês */}
      <CriarMesModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onMesCriado={handleMesCriado}
      />
    </div>
  )
}

export default MesesPage