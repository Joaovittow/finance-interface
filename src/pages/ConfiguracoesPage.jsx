import React, { useEffect, useState } from 'react'
import { Save, Wallet, CreditCard, User } from 'lucide-react'
import { ApiService } from '../services/apiService'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const ConfiguracoesPage = () => {
  const [configuracoes, setConfiguracoes] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    carregarConfiguracoes()
  }, [])

  const carregarConfiguracoes = async () => {
    setLoading(true)
    try {
      const configs = await ApiService.getConfiguracoes()
      const configMap = configs.reduce((acc, config) => {
        acc[config.chave] = config.valor
        return acc
      }, {})
      setConfiguracoes(configMap)
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSalvarConfiguracoes = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      const updates = Object.entries(configuracoes).map(([chave, valor]) =>
        ApiService.updateConfiguracao(chave, valor)
      )
      
      await Promise.all(updates)
      setMessage('Configurações salvas com sucesso!')
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  const updateConfiguracao = (chave, valor) => {
    setConfiguracoes(prev => ({
      ...prev,
      [chave]: valor
    }))
  }

  // Categorias padrão iniciais
  const categoriasPadrao = configuracoes.categorias_padrao || 'Alimentação,Transporte,Moradia,Saúde,Educação,Lazer,Outros'

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-gray-500">Carregando configurações...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
          <p className="text-gray-600 mt-2">
            Gerencie as configurações do seu app financeiro
          </p>
        </div>
        
        {message && (
          <div className={`px-4 py-2 rounded-lg ${
            message.includes('Erro') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entradas Fixas */}
        <Card>
          <div className="flex items-center space-x-2 mb-4">
            <Wallet className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Entradas Fixas</h2>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Adiantamento João (Dia 15)"
              type="number"
              step="0.01"
              value={configuracoes.adiantamento_joao || ''}
              onChange={(e) => updateConfiguracao('adiantamento_joao', e.target.value)}
              helperText="Valor fixo do adiantamento no dia 15"
            />
            
            <Input
              label="Salário João (Dia 30)"
              type="number"
              step="0.01"
              value={configuracoes.salario_joao || ''}
              onChange={(e) => updateConfiguracao('salario_joao', e.target.value)}
              helperText="Valor fixo do salário no dia 30"
            />
            
            <Input
              label="Salário Raquel (Dia 30)"
              type="number"
              step="0.01"
              value={configuracoes.salario_raquel || ''}
              onChange={(e) => updateConfiguracao('salario_raquel', e.target.value)}
              helperText="Valor fixo do salário no quinto dia útil"
            />
          </div>
        </Card>

        {/* Configurações Gerais */}
        <Card>
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">Categorias</h2>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Categorias Padrão"
              value={categoriasPadrao}
              onChange={(e) => updateConfiguracao('categorias_padrao', e.target.value)}
              helperText="Separe as categorias por vírgula"
            />
            <div className="text-xs text-gray-500">
              <p>Categorias atuais:</p>
              <p className="mt-1">{categoriasPadrao}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Informações do Usuário */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <User className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-800">Informações do Sistema</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="font-medium text-gray-700">Usuário:</label>
            <p className="text-gray-600">teste@finance.com</p>
          </div>
          <div>
            <label className="font-medium text-gray-700">Tipo:</label>
            <p className="text-gray-600">Usuário de Demonstração</p>
          </div>
        </div>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button
          onClick={handleSalvarConfiguracoes}
          icon={Save}
          variant="primary"
          loading={saving}
          disabled={saving}
        >
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  )
}

export default ConfiguracoesPage