import React from 'react'
import { Home, Calendar, BarChart3, Settings } from 'lucide-react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import Header from './Header'
import { useLocation } from 'react-router-dom'

const AppShell = ({ children }) => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/meses', icon: Calendar, label: 'Extrato' },
    { path: '/relatorios', icon: BarChart3, label: 'Relatórios' },
    { path: '/configuracoes', icon: Settings, label: 'Ajustes' },
  ]

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/': return 'Visão Geral'
      case '/meses': return 'Extrato Mensal'
      case '/relatorios': return 'Relatórios'
      case '/configuracoes': return 'Configurações'
      default: return 'Organiza+'
    }
  }

  return (
    <div className="min-h-screen bg-gray-custom dark:bg-dark-bg transition-colors duration-300">
      {/* Desktop Sidebar */}
      <Sidebar navItems={navItems} />

      {/* Main Content Area */}
      <div className="md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">
        <Header title={getPageTitle(location.pathname)} />
        
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav navItems={navItems} />
    </div>
  )
}

export default AppShell
