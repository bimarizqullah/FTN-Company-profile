'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { SweetAlerts } from '@/lib/sweetAlert'
import { 
  XMarkIcon, 
  PhotoIcon, 
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'

interface ManagementModalProps {
  isOpen: boolean
  onClose: () => void
  management: {
    id: number
    name: string
    position: string
    imagePath: string
    status: 'active' | 'inactive'
  } | null
  onSuccess: () => void
}

export default function ManagementModal({
  isOpen,
  onClose,
  management,
  onSuccess
}: ManagementModalProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (management) {
      setStatus(management.status)
      setName(management.name || '')
      setPosition(management.position || '')
      setPreviewUrl(management.imagePath)
    } else {
      setStatus('active')
      setName('')
      setPosition('')
      setPreviewUrl('')
      setSelectedFile(null)
    }
  }, [management])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      SweetAlerts.warning.validation('File harus berupa gambar (PNG, JPG, WEBP)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      SweetAlerts.warning.validation('Ukuran file maksimal 5MB')
      return
    }
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = e => setPreviewUrl(e.target?.result as string)
    reader.readAsDataURL(file)
    
    // Show success toast for file selection
    SweetAlerts.toast.success('Foto berhasil dipilih')
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation with SweetAlert2
    if (!name.trim()) {
      SweetAlerts.warning.validation('Nama lengkap wajib diisi')
      return
    }
    
    if (name.trim().length < 2) {
      SweetAlerts.warning.validation('Nama harus minimal 2 karakter')
      return
    }
    
    if (!position.trim()) {
      SweetAlerts.warning.validation('Posisi/Jabatan wajib diisi')
      return
    }

    if (position.trim().length < 3) {
      SweetAlerts.warning.validation('Posisi/Jabatan harus minimal 3 karakter')
      return
    }

    if (!management && !selectedFile) {
      SweetAlerts.warning.validation('Silakan pilih foto profil untuk anggota baru')
      return
    }

    // Confirmation before submit
    const action = management ? 'memperbarui' : 'menambahkan'
    const actionTitle = management ? 'Perbarui Data Management?' : 'Tambah Anggota Management?'
    const confirmResult = await SweetAlerts.confirm.action(
      actionTitle,
      `Apakah Anda yakin ingin ${action} data ${name}?`,
      `Ya, ${management ? 'Perbarui' : 'Tambahkan'}!`
    )

    if (!confirmResult.isConfirmed) return

    setLoading(true)
    
    // Show loading with progress
    SweetAlerts.loading.show(
      management ? 'Memperbarui Data...' : 'Menambahkan Anggota...',
      `Sedang ${action} data management`
    )
    
    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('position', position.trim())
      formData.append('status', status)
      if (selectedFile) formData.append('file', selectedFile)

      const url = management ? `/api/management/${management.id}` : `/api/management/upload`
      const method = management ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: formData
      })

      let errorMessage = 'Gagal menyimpan data'
      if (!res.ok) {
        const contentType = res.headers.get('content-type')
        if (contentType?.includes('application/json')) {
          const data = await res.json()
          errorMessage = data.message || errorMessage
        } else {
          const text = await res.text()
          console.error('Respons server non-JSON:', text)
          errorMessage = text || errorMessage
        }
        throw new Error(`${errorMessage} (Status: ${res.status})`)
      }

      const data = await res.json()
      
      // Show success message
      if (management) {
        await SweetAlerts.custom.managementUpdated(name)
      } else {
        await SweetAlerts.custom.managementCreated(name)
      }
      
      onSuccess()
      onClose()
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      SweetAlerts.error.withDetails(
        management ? 'Gagal Memperbarui Data' : 'Gagal Menambahkan Anggota',
        `Terjadi kesalahan saat ${action} data management.`,
        errorMsg
      )
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {management ? 'Edit Data Management' : 'Tambah Data Management'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {management ? 'Perbarui informasi anggota management' : 'Tambahkan anggota management baru'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-xl hover:bg-white/80 transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Image Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Foto Profil <span className="text-red-500">*</span>
            </label>
            
            <div
              className={`
                relative rounded-2xl border-2 border-dashed transition-all duration-200
                ${dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                }
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <Image 
                    src={previewUrl} 
                    alt="Preview" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white rounded-xl text-gray-800 font-medium hover:bg-gray-100 transition-colors"
                    >
                      Ganti Foto
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="h-64 flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium mb-1">
                    Klik untuk upload atau drag & drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, WEBP (Maks. 5MB)
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Rekomendasi: 1080x1080px (1:1)
                  </p>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Form Fields */}
          <div className="grid gap-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full border border-gray-300 rounded-xl px-10 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                  required
                  maxLength={100}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{name.length}/100 karakter</p>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Posisi/Jabatan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <BriefcaseIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Contoh: Direktur Utama, Manajer Keuangan"
                  className="w-full border border-gray-300 rounded-xl px-10 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                  required
                  maxLength={100}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{position.length}/100 karakter</p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('active')}
                  className={`
                    px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2
                    ${status === 'active'
                      ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  Aktif
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('inactive')}
                  className={`
                    px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2
                    ${status === 'inactive'
                      ? 'bg-gray-700 text-white ring-2 ring-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  <ExclamationCircleIcon className="w-5 h-5" />
                  Nonaktif
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Hanya anggota dengan status aktif yang akan ditampilkan di website
              </p>
            </div>
          </div>

          {/* Preview Section */}
          {name && position && previewUrl && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Preview Management:</p>
              <div className="relative h-40 rounded-xl overflow-hidden flex items-center gap-4 p-4 bg-white">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover rounded-full" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 font-bold text-base line-clamp-1">{name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-1">{position}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !name || !position || (!management && !selectedFile)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>{management ? 'Perbarui Data' : 'Tambah Data'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}