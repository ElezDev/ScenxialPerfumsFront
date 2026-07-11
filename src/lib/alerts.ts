import Swal from 'sweetalert2'

const baseToast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3200,
  timerProgressBar: true,
  customClass: {
    popup: 'swal-luxury-toast',
    title: 'swal-luxury-toast-title',
    htmlContainer: 'swal-luxury-toast-text',
    timerProgressBar: 'swal-luxury-timer',
  },
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
})

const baseModal = Swal.mixin({
  background: 'transparent',
  color: '#F5F0E8',
  confirmButtonColor: '#D4AF37',
  cancelButtonColor: '#323238',
  customClass: {
    popup: 'swal-luxury-popup',
    title: 'swal-luxury-title',
    htmlContainer: 'swal-luxury-text',
    confirmButton: 'swal-luxury-confirm',
    cancelButton: 'swal-luxury-cancel',
    icon: 'swal-luxury-icon',
  },
})

export function toastSuccess(title: string, text?: string) {
  return baseToast.fire({
    icon: 'success',
    title,
    text,
  })
}

export function toastError(title: string, text?: string) {
  return baseToast.fire({
    icon: 'error',
    title,
    text,
  })
}

export function toastInfo(title: string, text?: string) {
  return baseToast.fire({
    icon: 'info',
    title,
    text,
  })
}

export function toastWarning(title: string, text?: string) {
  return baseToast.fire({
    icon: 'warning',
    title,
    text,
  })
}

export async function confirmAction(options: {
  title: string
  text?: string
  confirmText?: string
  cancelText?: string
  icon?: 'warning' | 'question' | 'info'
}): Promise<boolean> {
  const result = await baseModal.fire({
    icon: options.icon ?? 'question',
    title: options.title,
    text: options.text,
    showCancelButton: true,
    confirmButtonText: options.confirmText ?? 'Confirmar',
    cancelButtonText: options.cancelText ?? 'Cancelar',
    reverseButtons: true,
  })
  return result.isConfirmed
}

export async function confirmDelete(itemLabel: string): Promise<boolean> {
  return confirmAction({
    title: '¿Eliminar?',
    text: `¿Estás seguro de eliminar ${itemLabel}? Esta acción no se puede deshacer.`,
    confirmText: 'Sí, eliminar',
    cancelText: 'Cancelar',
    icon: 'warning',
  })
}

export function toastSaved(entity: string) {
  return toastSuccess(`${entity} guardado`, 'Los cambios se aplicaron correctamente.')
}

export function toastDeleted(entity: string) {
  return toastSuccess(`${entity} eliminado`)
}
