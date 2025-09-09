import Swal from 'sweetalert2'

// Custom SweetAlert2 configurations for different types of alerts
export const SweetAlerts = {
  // Loading/Progress alerts
  loading: {
    show: (title: string = 'Memproses...', text?: string) => {
      return Swal.fire({
        title,
        text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })
    },
    
    showWithProgress: (title: string = 'Memproses...') => {
      let timerInterval: NodeJS.Timeout
      return Swal.fire({
        title,
        html: 'Sedang memproses... <b></b> detik',
        timer: 10000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
          const timer = Swal.getPopup()?.querySelector('b')
          timerInterval = setInterval(() => {
            if (timer) {
              timer.textContent = `${Math.ceil((Swal.getTimerLeft() || 0) / 1000)}`
            }
          }, 100)
        },
        willClose: () => {
          clearInterval(timerInterval)
        }
      })
    }
  },

  // Success alerts
  success: {
    simple: (title: string, text?: string) => {
      return Swal.fire({
        icon: 'success',
        title,
        text,
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
        showConfirmButton: true,
        timer: 3000,
        timerProgressBar: true
      })
    },

    withCallback: (title: string, text?: string, callback?: () => void) => {
      return Swal.fire({
        icon: 'success',
        title,
        text,
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
        showConfirmButton: true
      }).then((result) => {
        if (result.isConfirmed && callback) {
          callback()
        }
      })
    },

    autoClose: (title: string, text?: string, timer: number = 2000) => {
      return Swal.fire({
        icon: 'success',
        title,
        text,
        showConfirmButton: false,
        timer,
        timerProgressBar: true,
        toast: true,
        position: 'top-end'
      })
    }
  },

  // Error alerts
  error: {
    simple: (title: string, text?: string) => {
      return Swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        showConfirmButton: true
      })
    },

    withDetails: (title: string, text: string, details?: string) => {
      return Swal.fire({
        icon: 'error',
        title,
        text,
        footer: details ? `<small>Detail: ${details}</small>` : undefined,
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        showConfirmButton: true
      })
    },

    network: () => {
      return Swal.fire({
        icon: 'error',
        title: 'Koneksi Bermasalah',
        text: 'Terjadi masalah koneksi. Silakan periksa internet Anda dan coba lagi.',
        confirmButtonText: 'Coba Lagi',
        confirmButtonColor: '#ef4444',
        showConfirmButton: true
      })
    }
  },

  // Warning alerts
  warning: {
    simple: (title: string, text?: string) => {
      return Swal.fire({
        icon: 'warning',
        title,
        text,
        confirmButtonText: 'OK',
        confirmButtonColor: '#f59e0b',
        showConfirmButton: true
      })
    },

    validation: (message: string) => {
      return Swal.fire({
        icon: 'warning',
        title: 'Data Tidak Valid',
        text: message,
        confirmButtonText: 'OK',
        confirmButtonColor: '#f59e0b',
        showConfirmButton: true
      })
    }
  },

  // Info alerts
  info: {
    simple: (title: string, text?: string) => {
      return Swal.fire({
        icon: 'info',
        title,
        text,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
        showConfirmButton: true
      })
    },

    withHTML: (title: string, html: string) => {
      return Swal.fire({
        icon: 'info',
        title,
        html,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
        showConfirmButton: true
      })
    }
  },

  // Confirmation alerts
  confirm: {
    delete: (itemName?: string) => {
      return Swal.fire({
        title: 'Hapus Data?',
        text: itemName 
          ? `Apakah Anda yakin ingin menghapus "${itemName}"?` 
          : 'Apakah Anda yakin ingin menghapus data ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal',
        reverseButtons: true
      })
    },

    action: (title: string, text: string, confirmText: string = 'Ya, Lanjutkan!') => {
      return Swal.fire({
        title,
        text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        confirmButtonText: confirmText,
        cancelButtonText: 'Batal',
        reverseButtons: true
      })
    },

    custom: (options: {
      title: string
      text?: string
      icon?: 'warning' | 'error' | 'success' | 'info' | 'question'
      confirmText?: string
      cancelText?: string
      confirmColor?: string
      cancelColor?: string
    }) => {
      return Swal.fire({
        title: options.title,
        text: options.text,
        icon: options.icon || 'question',
        showCancelButton: true,
        confirmButtonColor: options.confirmColor || '#3b82f6',
        cancelButtonColor: options.cancelColor || '#6b7280',
        confirmButtonText: options.confirmText || 'Ya',
        cancelButtonText: options.cancelText || 'Batal',
        reverseButtons: true
      })
    }
  },

  // Input alerts
  input: {
    text: (title: string, placeholder?: string, defaultValue?: string) => {
      return Swal.fire({
        title,
        input: 'text',
        inputPlaceholder: placeholder,
        inputValue: defaultValue,
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        inputValidator: (value) => {
          if (!value) {
            return 'Anda harus mengisi input ini!'
          }
        }
      })
    },

    textarea: (title: string, placeholder?: string, defaultValue?: string) => {
      return Swal.fire({
        title,
        input: 'textarea',
        inputPlaceholder: placeholder,
        inputValue: defaultValue,
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        inputValidator: (value) => {
          if (!value) {
            return 'Anda harus mengisi input ini!'
          }
        }
      })
    }
  },

  // Toast notifications
  toast: {
    success: (message: string, timer: number = 3000) => {
      return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer,
        timerProgressBar: true
      })
    },

    error: (message: string, timer: number = 4000) => {
      return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer,
        timerProgressBar: true
      })
    },

    warning: (message: string, timer: number = 3500) => {
      return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: message,
        showConfirmButton: false,
        timer,
        timerProgressBar: true
      })
    },

    info: (message: string, timer: number = 3000) => {
      return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: message,
        showConfirmButton: false,
        timer,
        timerProgressBar: true
      })
    }
  },

  // Custom styled alerts
  custom: {
    // Management specific alerts
    managementCreated: (name: string) => {
      return Swal.fire({
        icon: 'success',
        title: 'Anggota Management Berhasil Ditambahkan!',
        html: `
          <div class="text-center">
            <div class="mb-4">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                </svg>
              </div>
              <p class="text-gray-600">
                <strong>${name}</strong> telah berhasil ditambahkan ke tim management.
              </p>
            </div>
          </div>
        `,
        confirmButtonText: 'Lihat Daftar',
        confirmButtonColor: '#10b981',
        showConfirmButton: true,
        timer: 5000,
        timerProgressBar: true
      })
    },

    managementUpdated: (name: string) => {
      return Swal.fire({
        icon: 'success',
        title: 'Data Management Berhasil Diperbarui!',
        html: `
          <div class="text-center">
            <div class="mb-4">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <p class="text-gray-600">
                Data <strong>${name}</strong> telah berhasil diperbarui.
              </p>
            </div>
          </div>
        `,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
        showConfirmButton: true,
        timer: 4000,
        timerProgressBar: true
      })
    },

    managementDeleted: (name: string) => {
      return Swal.fire({
        icon: 'success',
        title: 'Data Management Berhasil Dihapus!',
        html: `
          <div class="text-center">
            <div class="mb-4">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </div>
              <p class="text-gray-600">
                Data <strong>${name}</strong> telah berhasil dihapus dari sistem.
              </p>
            </div>
          </div>
        `,
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        showConfirmButton: true,
        timer: 3000,
        timerProgressBar: true
      })
    }
  }
}

// Helper function to close any open SweetAlert
export const closeSweetAlert = () => {
  Swal.close()
}

// Helper function to check if SweetAlert is currently open
export const isSweetAlertOpen = () => {
  return Swal.isVisible()
}
