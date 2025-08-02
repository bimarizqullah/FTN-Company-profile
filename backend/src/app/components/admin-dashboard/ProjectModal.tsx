'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { 
  XMarkIcon, 
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: {
    id: number
    imagePath: string
    name: string
    description: string
    location: string
    status: string
  } | null
  onSuccess: () => void
}

export default function ProjectModal({
  isOpen,
  onClose,
  project,
  onSuccess
}: ProjectModalProps) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('ongoing')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (project) {
      setName(project.name || '')
      setDescription(project.description || '')
      setLocation(project.location || '')
      setStatus(project.status || 'ongoing')
      setPreviewUrl(project.imagePath)
    } else {
      setName('')
      setDescription('')
      setLocation('')
      setStatus('ongoing')
      setPreviewUrl('')
      setSelectedFile(null)
    }
  }, [project])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
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
    if (!file.type.startsWith('image/')) return toast.error('File harus berupa gambar')
    if (file.size > 5 * 1024 * 1024) return toast.error('Ukuran file maksimal 5MB')
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
    if (!project && !selectedFile) return toast.error('Silakan upload gambar proyek')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('location', location)
      formData.append('status', status)
      if (selectedFile) formData.append('file', selectedFile)

      const url = project ? `/api/project/${project.id}` : `/api/project`
      const method = project ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: formData
      })

      if (!res.ok) throw new Error()
      toast.success(project ? 'Proyek berhasil diperbarui' : 'Proyek berhasil ditambahkan')
      onSuccess()
      onClose()
    } catch {
      toast.error('Gagal menyimpan proyek')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{project ? 'Edit Project' : 'Tambah Project Baru'}</h2>
            <p className="text-sm text-gray-600 mt-1">{project ? 'Perbarui informasi proyek' : 'Buat proyek baru untuk halaman project'}</p>
          </div>
          <button onClick={onClose} disabled={loading} className="p-2 rounded-xl hover:bg-white/80 transition-colors disabled:opacity-50">
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Gambar Project <span className="text-red-500">*</span></label>
            <div
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white rounded-xl text-gray-800 font-medium hover:bg-gray-100 transition-colors"
                    >Ganti Gambar</button>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium mb-1">Klik untuk upload atau drag & drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, WEBP (Maks. 5MB)</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
          </div>

          <div className="grid gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Project <span className="text-red-500">*</span></label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama project"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                required
                maxLength={50}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasi <span className="text-red-500">*</span></label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Masukkan lokasi proyek"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                required
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi <span className="text-red-500">*</span></label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat proyek"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                required
                maxLength={80}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status <span className="text-red-500">*</span></label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="ongoing">Sedang Berlangsung</option>
                <option value="pending">Ditunda</option>
                <option value="terminated">Dihentikan</option>
              </select>
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 disabled:opacity-50"
          >Batal</button>
          <button
            onClick={handleSubmit}
            disabled={loading || !name || !description || !location || !status}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
          > 
            {loading ? 'Menyimpan...' : project ? 'Perbarui Project' : 'Tambah Project'}
          </button>
        </div>
      </div>
    </div>
  )
}
