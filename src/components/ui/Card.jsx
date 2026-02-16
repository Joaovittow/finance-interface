import React from 'react'

const Card = ({ 
  children, 
  className = '',
  padding = 'medium',
  hover = false,
  ...props 
}) => {
  const paddingClasses = {
    none: 'p-0',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  }

  return (
    <div 
      className={`
        bg-white dark:bg-dark-card 
        rounded-2xl 
        shadow-soft 
        border border-gray-100 dark:border-dark-border
        ${paddingClasses[padding]}
        ${hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300' : ''}
        ${className}
      `.trim()} 
      {...props}
    >
      {children}
    </div>
  )
}

export default Card