import React from 'react'

const Input = ({
  label,
  type = 'text',
  error,
  helperText,
  className = '',
  validation,
  onValidate,
  ...props
}) => {
  const handleBlur = (e) => {
    if (validation && onValidate) {
      const error = validation(e.target.value)
      onValidate(error)
    }
    props.onBlur?.(e)
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${className}
        `.trim()}
        onBlur={handleBlur}
        {...props}
      />
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}

export default Input