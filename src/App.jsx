import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FinanceProvider } from './contexts/FinanceContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import QuinzenaPage from './pages/QuinzenaPage'
import MesesPage from './pages/MesesPage'
import RelatoriosPage from './pages/RelatoriosPage'
import ConfiguracoesPage from './pages/ConfiguracoesPage'
import './index.css'

function App() {
  return (
    <FinanceProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/meses" element={<MesesPage />} />
            <Route path="/quinzena/:id" element={<QuinzenaPage />} />
            <Route path="/relatorios" element={<RelatoriosPage />} />
            <Route path="/configuracoes" element={<ConfiguracoesPage />} />
          </Routes>
        </Layout>
      </Router>
    </FinanceProvider>
  )
}

export default App