import React from 'react'

const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  fullWidth = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-glow focus:ring-brand-500 border border-transparent',
    secondary: 'bg-brand-100 text-brand-700 hover:bg-brand-200 focus:ring-brand-500 border border-transparent dark:bg-brand-900/30 dark:text-brand-300',
    outline: 'bg-transparent text-brand-600 border-2 border-brand-600 hover:bg-brand-50 focus:ring-brand-500 dark:text-brand-400 dark:border-brand-500 dark:hover:bg-brand-900/20',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-dark-border',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500 border border-transparent dark:bg-red-900/20 dark:text-red-400',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border border-transparent'
  }
  
  const sizes = {
    small: 'px-3 py-1.5 text-xs gap-1.5',
    medium: 'px-5 py-2.5 text-sm gap-2',
    large: 'px-6 py-3.5 text-base gap-2.5',
    icon: 'p-2.5'
  }

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim()

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={`${size === 'small' ? 'h-3.5 w-3.5' : 'h-5 w-5'} ${children ? '' : ''}`} />
      ) : null}
      {children}
    </button>
  )
}

export default Button