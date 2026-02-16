import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const BottomNav = ({ navItems }) => {
  const location = useLocation()
  
  const isActivePath = (path) => location.pathname === path

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-gray-100 dark:border-dark-border p-2 z-40 pb-safe">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = isActivePath(item.path)
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 w-16
                ${isActive 
                  ? 'text-brand-600 dark:text-brand-400' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }
              `}
            >
              <div className={`
                p-1.5 rounded-full mb-1 transition-all duration-200
                ${isActive ? 'bg-brand-50 dark:bg-brand-900/30' : 'bg-transparent'}
              `}>
                <Icon className={`h-5 w-5 ${isActive ? 'fill-current' : 'stroke-current'}`} />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
