import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Wallet, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = ({ navItems }) => {
  const location = useLocation()
  const { logout } = useAuth()

  const isActivePath = (path) => location.pathname === path

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white dark:bg-dark-card border-r border-gray-100 dark:border-dark-border z-30">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-brand-100 dark:bg-brand-900/30 p-2 rounded-xl">
          <Wallet className="h-6 w-6 text-brand-600 dark:text-brand-400" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Organiza<span className="text-brand-600">+</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = isActivePath(item.path)
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-brand-600 text-white shadow-soft shadow-brand-500/30' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-border/50 hover:text-brand-600 dark:hover:text-brand-400'
                }
              `}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors'}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-dark-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
