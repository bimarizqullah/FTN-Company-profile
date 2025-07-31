'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

interface SlidersModalProps {
  isOpen: boolean
  onClose: () => void
  slider: {
    id: number
    imagePath: string
    title: string
    subtitle: string
    tagline: string
    status: 'active' | 'inactive'
  } | null
  onSuccess: () => void
}

export default function SlidersModal({
  isOpen,
  onClose,
  slider,
  onSuccess
}: SlidersModalProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [tagline, setTagline] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (slider) {
      setStatus(slider.status)
      setTitle(slider.title || '')
      setSubtitle(slider.subtitle || '')
      setTagline(slider.tagline || '')
      setPreviewUrl(slider.imagePath)
    } else {
      setStatus('active')
      setTitle('')
      setSubtitle('')
      setTagline('')
      setPreviewUrl('')
      setSelectedFile(null)
    }
  }, [slider])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('subtitle', subtitle)
      formData.append('tagline', tagline)
      formData.append('status', status)
      if (selectedFile) formData.append('file', selectedFile)

      const url = slider ? `/api/sliders/${slider.id}` : `/api/sliders`
      const method = slider ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: formData
      })

      if (!res.ok) throw new Error()
      toast.success(slider ? 'Slider berhasil diperbarui' : 'Slider berhasil ditambahkan')
      onSuccess()
      onClose()
    } catch {
      toast.error('Gagal menyimpan slider')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg animate-fadeIn">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {slider ? 'Edit Slider' : 'Tambah Slider'}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Image Preview */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">Gambar Slider</label>
            <div className="relative w-full h-48 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              ) : (
                <span className="text-gray-400 text-sm">Belum ada gambar</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 w-full py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
            >
              Pilih Gambar
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-100 focus:border-blue-400 text-sm"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Subtitle</label>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-100 focus:border-blue-400 text-sm"
              required
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Tagline</label>
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-100 focus:border-blue-400 text-sm"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-100 focus:border-blue-400 text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 transition text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}