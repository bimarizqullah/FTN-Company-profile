// Modal: components/SlidersModal.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { 
  XMarkIcon, 
  PhotoIcon, 
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

interface GalleryModalProps {
  isOpen: boolean
  onClose: () => void
  gallery: {
    id: number
    imagePath: string
    description: string
    status: 'active' | 'inactive'
  } | null
  onSuccess: () => void
}

export default function GalleryModal({
  isOpen,
  onClose,
  gallery,
  onSuccess
}: GalleryModalProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (gallery) {
      setStatus(gallery.status)
      setDescription(gallery.description || '')
      setPreviewUrl(gallery.imagePath)
    } else {
      setStatus('active')
      setDescription('')
      setPreviewUrl('')
      setSelectedFile(null)
    }
  }, [gallery])

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
      toast.error('File harus berupa gambar')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB')
      return
    }
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = e => setPreviewUrl(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!gallery && !selectedFile) {
      toast.error('Silakan pilih gambar untuk gallery')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('description', description)
      if (selectedFile) formData.append('file', selectedFile)

      // Log formData for debugging
      console.log('FormData contents:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const url = gallery ? `/api/gallery/${gallery.id}` : `/api/gallery`
      const method = gallery ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: formData
      })

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save gallery');
      }
      toast.success(gallery ? 'Gallery berhasil diperbarui' : 'Gallery berhasil ditambahkan')
      onSuccess()
      onClose()
    } catch (error) {
      toast.error('Gagal menyimpan Gallery')
      console.error(error);
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
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {gallery ? 'Edit Gallery' : 'Tambah gallery Baru'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {gallery ? 'Perbarui informasi Gallery' : 'Buat Gallery baru untuk halaman utama'}
            </p>
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
              Gambar Gallery <span className="text-red-500">*</span>
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
                      Ganti Gambar
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
                    Rekomendasi: 1920x1080px (16:9)
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
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Judul Utama <span className="text-red-500">*</span>
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Masukkan judul yang menarik"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                required
                maxLength={255}
              />
              <p className="text-xs text-gray-500 mt-1">{description.length}/255 karakter</p>
            </div>
          </div>

          {/* Preview Section */}
          {description && previewUrl && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Preview Gallery:</p>
              <div className="relative h-40 rounded-xl overflow-hidden">
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                  <p className="text-white/90 text-sm line-clamp-1">{description}</p>
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
            disabled={loading || !description || (!gallery && !selectedFile)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>{gallery ? 'Perbarui Gallery' : 'Tambah Gallery'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}