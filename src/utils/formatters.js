export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0)
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

export const formatMonthYear = (mes, ano) => {
  try {
    const date = new Date(ano, mes - 1)
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric'
    }).format(date)
  } catch (error) {
    console.error('Erro ao formatar mês/ano:', error)
    return `${mes}/${ano}`
  }
}

export const getCurrentMonthYear = () => {
  const now = new Date()
  return {
    mes: now.getMonth() + 1,
    ano: now.getFullYear()
  }
}

export const calcularSaldo = (saldoAnterior, receitas, despesasPagas) => {
  const totalReceitas = receitas.reduce((sum, rec) => sum + rec.valor, 0)
  const totalDespesasPagas = despesasPagas.reduce((sum, parc) => 
    sum + (parc.valorPago || parc.valorParcela), 0
  )
  
  return saldoAnterior + totalReceitas - totalDespesasPagas
}

// Função auxiliar para capitalizar a primeira letra
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}