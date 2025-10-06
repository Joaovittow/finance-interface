import React, { useState, useEffect } from 'react'
import { validators } from '../../utils/validators'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { TIPOS_RECEITA } from '../../constants/apiEndpoints'

const ReceitaForm = ({ 
  onSubmit, 
  onCancel, 
  onDelete,
  initialData = null,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: TIPOS_RECEITA.VARIAVEL
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        descricao: initialData.descricao,
        valor: initialData.valor.toString(),
        tipo: initialData.tipo
      })
    }
  }, [initialData])

  const validateField = (field, value) => {
    const fieldValidators = {
      descricao: [validators.required, validators.minLength(2)],
      valor: [validators.required, validators.positiveNumber],
      tipo: [validators.required]
    }

    if (fieldValidators[field]) {
      for (const validator of fieldValidators[field]) {
        const error = validator(value)
        if (error) {
          setErrors(prev => ({ ...prev, [field]: error }))
          return
        }
      }
    }
    setErrors(prev => ({ ...prev, [field]: null }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newErrors = {}
    Object.keys(formData).forEach(field => {
      validateField(field, formData[field])
      if (errors[field]) newErrors[field] = errors[field]
    })

    if (Object.keys(newErrors).some(key => newErrors[key])) {
      return
    }

    onSubmit({
      ...formData,
      valor: parseFloat(formData.valor)
    })
  }

  const handleDelete = () => {
    if (onDelete && initialData) {
      onDelete(initialData)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field !== 'observacao') {
      validateField(field, value)
    }
  }

  const isFormValid = !Object.keys(errors).some(key => errors[key]) && 
                     formData.descricao && 
                     formData.valor

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Descrição"
        value={formData.descricao}
        onChange={(e) => handleChange('descricao', e.target.value)}
        onValidate={(error) => setErrors(prev => ({ ...prev, descricao: error }))}
        validation={validators.required}
        error={errors.descricao}
        required
      />
      
      <Input
        label="Valor"
        type="number"
        step="0.01"
        value={formData.valor}
        onChange={(e) => handleChange('valor', e.target.value)}
        onValidate={(error) => setErrors(prev => ({ ...prev, valor: error }))}
        validation={validators.required}
        error={errors.valor}
        required
      />
      
      <Select
        label="Tipo"
        value={formData.tipo}
        onChange={(e) => handleChange('tipo', e.target.value)}
        options={[
          { value: TIPOS_RECEITA.FIXA, label: 'Fixa' },
          { value: TIPOS_RECEITA.VARIAVEL, label: 'Variável' }
        ]}
      />
      
      <div className="flex space-x-3 pt-2">
        <Button 
          type="submit" 
          variant="primary"
          loading={loading}
          disabled={loading || !isFormValid}
        >
          {initialData ? 'Atualizar' : 'Adicionar'} Receita
        </Button>
        {initialData && (
          <Button 
            type="button" 
            variant="danger"
            onClick={handleDelete}
          >
            Excluir Receita
          </Button>
        )}
        <Button 
          type="button" 
          variant="secondary"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export default ReceitaForm