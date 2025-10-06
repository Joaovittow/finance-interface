import { useState, useCallback } from 'react'

export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'danger'
  })

  const showConfirm = useCallback(({ title, message, onConfirm, type = 'danger' }) => {
    setDialogState({
      isOpen: true,
      title,
      message,
      onConfirm,
      type
    })
  }, [])

  const hideConfirm = useCallback(() => {
    setDialogState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const handleConfirm = useCallback(() => {
    if (dialogState.onConfirm) {
      dialogState.onConfirm()
    }
    hideConfirm()
  }, [dialogState.onConfirm, hideConfirm])

  return {
    isOpen: dialogState.isOpen,
    title: dialogState.title,
    message: dialogState.message,
    type: dialogState.type,
    showConfirm,
    hideConfirm,
    handleConfirm
  }
}