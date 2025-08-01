'use client'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  message?: string
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Konfirmasi</h2>
        <p className="text-gray-600">{message || 'Apakah Anda yakin ingin menghapus item ini?'}</p>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
          >
            Batal
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}