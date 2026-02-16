import React, { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  className = '',
  startIcon: StartIcon,
  endIcon: EndIcon,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {StartIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <StartIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full 
            ${StartIcon ? 'pl-10' : 'px-4'} 
            ${EndIcon ? 'pr-10' : 'px-4'}
            py-3 
            bg-gray-50 dark:bg-dark-card
            border border-gray-200 dark:border-dark-border
            text-gray-900 dark:text-white
            placeholder-gray-400
            rounded-xl 
            shadow-sm 
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
            ${error ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50/50' : ''}
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}
          `.trim()}
          {...props}
        />
        {EndIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <EndIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-1.5 ml-1 text-xs ${error ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input