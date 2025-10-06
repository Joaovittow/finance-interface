import React from 'react'
import Navbar from './Navbar'
import LoadingSpinner from '../ui/LoadingSpinner'
import ErrorAlert from '../ui/ErrorAlert'
import { useFinanceContext } from '../../contexts/FinanceContext'

const Layout = ({ children }) => {
  const { loading, error, limparError } = useFinanceContext()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Alertas Globais */}
      {error && (
        <ErrorAlert 
          message={error} 
          onClose={limparError}
        />
      )}
      
      {/* Loading Global */}
      {loading && <LoadingSpinner />}
      
      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout