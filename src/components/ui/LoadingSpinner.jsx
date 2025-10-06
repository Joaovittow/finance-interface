import React from 'react'

const LoadingSpinner = ({ size = 'medium', text = 'Carregando...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
        <div 
          className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}
        />
        <span className="text-gray-700 font-medium">{text}</span>
      </div>
    </div>
  )
}

export default LoadingSpinner