import React, { createContext, useContext } from 'react'
import { useFinance } from '../hooks/useFinance'

const FinanceContext = createContext()

export const useFinanceContext = () => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinanceContext deve ser usado dentro de FinanceProvider')
  }
  return context
}

export const FinanceProvider = ({ children }) => {
  const finance = useFinance()

  return (
    <FinanceContext.Provider value={finance}>
      {children}
    </FinanceContext.Provider>
  )
}