export const validators = {
  required: (value) => {
    if (!value || value.toString().trim() === '') {
      return 'Este campo é obrigatório'
    }
    return null
  },

  minValue: (min) => (value) => {
    if (value && parseFloat(value) < min) {
      return `O valor mínimo é ${min}`
    }
    return null
  },

  maxValue: (max) => (value) => {
    if (value && parseFloat(value) > max) {
      return `O valor máximo é ${max}`
    }
    return null
  },

  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Mínimo ${min} caracteres`
    }
    return null
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Máximo ${max} caracteres`
    }
    return null
  },

  email: (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Email inválido'
    }
    return null
  },

  positiveNumber: (value) => {
    if (value && parseFloat(value) <= 0) {
      return 'O valor deve ser maior que zero'
    }
    return null
  },

  integer: (value) => {
    if (value && !Number.isInteger(parseFloat(value))) {
      return 'O valor deve ser um número inteiro'
    }
    return null
  }
}

export const validateForm = (values, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field]
    const value = values[field]
    
    for (const rule of fieldRules) {
      const error = rule(value)
      if (error) {
        errors[field] = error
        break
      }
    }
  })
  
  return errors
}

// Regras de validação específicas
export const validationRules = {
  mes: [
    validators.required,
    validators.integer,
    validators.minValue(1),
    validators.maxValue(12)
  ],
  
  ano: [
    validators.required,
    validators.integer,
    validators.minValue(2020),
    validators.maxValue(2030)
  ],
  
  valor: [
    validators.required,
    validators.positiveNumber
  ],
  
  descricao: [
    validators.required,
    validators.minLength(2),
    validators.maxLength(100)
  ],
  
  parcelas: [
    validators.required,
    validators.integer,
    validators.minValue(1),
    validators.maxValue(24)
  ]
}