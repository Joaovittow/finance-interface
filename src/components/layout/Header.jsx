import React from 'react'
import { Bell, User, ChevronDown, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

const Header = ({ title }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = React.useState(false)

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border-b border-gray-100 dark:border-dark-border">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {title || 'Dashboard'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-brand-600 dark:text-gray-500 dark:hover:text-brand-400 transition-colors relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white dark:border-dark-card"></span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border/50 transition-all bg-white dark:bg-dark-card shadow-sm"
          >
            <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <User className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:block">
              {user?.name?.split(' ')[0] || 'Usuário'}
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border py-2 animate-in fade-in slide-in-from-top-2 origin-top-right">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-dark-border mb-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
