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
  ExclamationCircleIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

interface GalleryImage {
  id: number
  imagePath: string
}

interface GalleryModalProps {
  isOpen: boolean
  onClose: () => void
  gallery: {
    id: number
    imagePath: string
    description: string
    status: 'active' | 'inactive'
    images?: GalleryImage[]
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [showNavigation, setShowNavigation] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (gallery) {
      setStatus(gallery.status)
      setDescription(gallery.description || '')
      // Handle both single image and multiple images
      const images = gallery.images || []
      const urls = images.length > 0 
        ? images.map((img: any) => img.imagePath)
        : [gallery.imagePath]
      setPreviewUrls(urls.filter(Boolean))
    } else {
      setStatus('active')
      setDescription('')
      setPreviewUrls([])
      setSelectedFiles([])
    }
    setCurrentPreviewIndex(0)
    setShowNavigation(false)
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
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFiles = async (files: File[]) => {
    if (files.length + selectedFiles.length > 20) {
      toast.error('Maksimal 20 foto dapat diunggah sekaligus')
      return
    }

    const validFiles: File[] = []
    const newPreviewUrls: string[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} harus berupa gambar`)
        continue
      }
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`File ${file.name} melebihi batas ukuran 20MB`)
        continue
      }

      validFiles.push(file)
      const url = await readFileAsDataURL(file)
      newPreviewUrls.push(url)
    }

    setSelectedFiles(prev => [...prev, ...validFiles])
    setPreviewUrls(prev => [...prev, ...newPreviewUrls])
  }

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = e => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length) handleFiles(files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!gallery && selectedFiles.length === 0) {
      toast.error('Silakan pilih minimal satu gambar untuk gallery')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('description', description)
      
      // Only append files if there are new files selected
      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
          formData.append('files', file)
        })
      }
      
      // For PUT requests, we need to send the current status
      if (gallery) {
        formData.append('status', status)
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
              {previewUrls.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden group">
                      <Image 
                        src={url} 
                        alt={`Preview ${index + 1}`}
                        fill 
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewUrls(prev => prev.filter((_, i) => i !== index))
                            setSelectedFiles(prev => prev.filter((_, i) => i !== index))
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                  {selectedFiles.length < 20 && (
                    <div 
                      className="aspect-video flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <PlusIcon className="w-8 h-8 text-gray-400" />
                      <p className="text-sm text-gray-600 mt-2">Tambah Foto</p>
                    </div>
                  )}
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
                    PNG, JPG, WEBP (Maks. 20MB per file)
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Maksimal 20 foto sekaligus
                  </p>
                  <p className="text-xs text-gray-400">
                    Rekomendasi: 1920x1080px (16:9)
                  </p>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
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
          {description && previewUrls.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Preview Gallery:
                {previewUrls.length > 1 && (
                  <span className="text-gray-500 ml-2">
                    {currentPreviewIndex + 1}/{previewUrls.length}
                  </span>
                )}
              </p>
              <div 
                className="relative h-48 rounded-xl overflow-hidden group"
                onMouseEnter={() => setShowNavigation(true)}
                onMouseLeave={() => setShowNavigation(false)}
              >
                <Image 
                  src={previewUrls[currentPreviewIndex]} 
                  alt={`Preview ${currentPreviewIndex + 1}`} 
                  fill 
                  className="object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                  <p className="text-white/90 text-sm line-clamp-1">{description}</p>
                </div>
                
                {/* Navigation Arrows */}
                {previewUrls.length > 1 && (
                  <>
                    {/* Left Arrow */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPreviewIndex(prev => 
                          prev === 0 ? previewUrls.length - 1 : prev - 1
                        )
                      }}
                      className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-300 ${
                        showNavigation ? 'opacity-100' : 'opacity-0'
                      } hover:bg-black/70`}
                    >
                      <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    
                    {/* Right Arrow */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPreviewIndex(prev => 
                          prev === previewUrls.length - 1 ? 0 : prev + 1
                        )
                      }}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-300 ${
                        showNavigation ? 'opacity-100' : 'opacity-0'
                      } hover:bg-black/70`}
                    >
                      <ChevronRightIcon className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Navigation */}
              {previewUrls.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  {previewUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPreviewIndex(index)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        currentPreviewIndex === index
                          ? 'border-blue-500 scale-105'
                          : 'border-transparent hover:border-blue-300'
                      }`}
                    >
                      <Image
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
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
            disabled={loading || !description || (!gallery && selectedFiles.length === 0)}
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