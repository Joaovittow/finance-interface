import React, { useState } from 'react'
import { Calendar } from 'lucide-react'
import { useFinanceContext } from '../../contexts/FinanceContext'
import { getCurrentMonthYear } from '../../utils/formatters'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'

const CriarMesModal = ({ isOpen, onClose, onMesCriado }) => {
  const { criarMes, carregarMeses, loading } = useFinanceContext()
  const [novoMes, setNovoMes] = useState(getCurrentMonthYear())

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await criarMes(novoMes.ano, novoMes.mes)
      await carregarMeses()
      onMesCriado?.()
      onClose()
      // Reset form
      setNovoMes(getCurrentMonthYear())
    } catch (error) {
      console.error('Erro ao criar mês:', error)
    }
  }

  const handleClose = () => {
    setNovoMes(getCurrentMonthYear())
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Criar Novo Mês"
      size="sm"
    >
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
          <Calendar className="h-6 w-6 text-blue-600" />
        </div>
        <p className="text-gray-600">
          Selecione o mês e ano que deseja criar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Mês *"
            type="number"
            min="1"
            max="12"
            value={novoMes.mes}
            onChange={(e) => setNovoMes(prev => ({ 
              ...prev, 
              mes: parseInt(e.target.value) || 1
            }))}
            required
            disabled={loading}
          />
          <Input
            label="Ano *"
            type="number"
            min="2020"
            max="2030"
            value={novoMes.ano}
            onChange={(e) => setNovoMes(prev => ({ 
              ...prev, 
              ano: parseInt(e.target.value) || new Date().getFullYear()
            }))}
            required
            disabled={loading}
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button 
            type="submit" 
            variant="primary"
            className="flex-1"
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Mês'}
          </Button>
          <Button 
            type="button" 
            variant="secondary"
            className="flex-1"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CriarMesModal