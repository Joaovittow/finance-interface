import React from 'react'

const Card = ({ 
  children, 
  className = '',
  padding = 'medium',
  hover = false,
  ...props 
}) => {
  const paddingClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  }

  const classes = `
    bg-white rounded-lg shadow-md border border-gray-200
    ${paddingClasses[padding]}
    ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''}
    ${className}
  `.trim()

  return (
    <div className={`
  bg-white rounded-lg shadow-md border border-gray-200
  ${paddingClasses[padding]}
  ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''}
  w-full // Garante que o card ocupe toda a largura disponível
  ${className}
`.trim()} {...props}>
      {children}
    </div>
  )
}

export default Card