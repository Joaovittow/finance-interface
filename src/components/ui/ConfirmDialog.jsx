import React from 'react'
import { AlertTriangle, X } from 'lucide-react'
import Button from './Button'

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar Exclusão",
  message = "Tem certeza que deseja excluir este item?",
  confirmText = "Excluir",
  cancelText = "Cancelar",
  type = "danger"
}) => {
  if (!isOpen) return null

  const typeConfig = {
    danger: {
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      buttonVariant: 'danger'
    },
    warning: {
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      buttonVariant: 'secondary' // Or specific warning variant if added
    },
    info: {
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      buttonVariant: 'primary'
    }
  }

  const config = typeConfig[type] || typeConfig.info

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-dark-card w-full max-w-md rounded-2xl shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-dark-border"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div className={`p-3 rounded-full ${config.iconBg} ${config.iconColor}`}>
              <AlertTriangle className="h-6 w-6" />
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="p-6 pt-0 flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={() => {
              onConfirm()
              onClose() // Ensure close after confirm usually
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog