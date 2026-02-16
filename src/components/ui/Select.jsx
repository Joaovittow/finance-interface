import React from 'react'

const Select = ({
  label,
  options = [],
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full px-4 py-3 
            bg-gray-50 dark:bg-dark-card
            border border-gray-200 dark:border-dark-border
            text-gray-900 dark:text-white
            rounded-xl 
            shadow-sm 
            appearance-none
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
            ${error ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50/50' : ''}
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}
          `.trim()}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {(error || helperText) && (
        <p className={`mt-1.5 ml-1 text-xs ${error ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}

export default Select