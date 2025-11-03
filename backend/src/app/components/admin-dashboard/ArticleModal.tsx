'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { SweetAlerts, closeSweetAlert } from '@/lib/sweetAlert'
import { CheckCircleIcon, CloudArrowUpIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useEditor, type Editor } from '@tiptap/react'
import dynamic from 'next/dynamic'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'

const EditorContent = dynamic(
  () => import('@tiptap/react').then((mod) => mod.EditorContent),
  { 
    ssr: false,
    loading: () => <div className="border rounded-xl p-4 min-h-[200px]">Loading editor...</div>
  }
)


interface ArticleItem {
  id: number
  title: string
  slug: string
  content: string
  imagePath?: string
  videoPath?: string
  youtubeUrl?: string
  status: 'active' | 'inactive'
  publishedAt?: string
  sourceName?: string
  sourceLink?: string
}

interface ArticleModalProps {
  isOpen: boolean
  onClose: () => void
  article: ArticleItem | null
  onSuccess: () => void
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, callback: () => void) => {
    e.preventDefault()
    e.stopPropagation()
    callback()
  }

  return (
    <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1">
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleHeading({ level: 3 }).run())}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
      >
        H3
      </button>
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().setParagraph().run())}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('paragraph') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
      >
        P
      </button>
      <span className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBold().run())}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleItalic().run())}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleUnderline().run())}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('underline') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
      >
        <u>U</u>
      </button>
      <span className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().setTextAlign('left').run())}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
      >
        ←
      </button>
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().setTextAlign('center').run())}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
      >
        ↔
      </button>
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().setTextAlign('right').run())}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
      >
        →
      </button>
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().setTextAlign('justify').run())}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
      >
        ↔↔
      </button>
      <span className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBulletList().run())}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
      >
        • List
      </button>
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleOrderedList().run())}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${editor.isActive('orderedList') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
      >
        1. List
      </button>
    </div>
  )
}

export default function ArticleModal({ isOpen, onClose, article, onSuccess }: ArticleModalProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [publishedAt, setPublishedAt] = useState<string>('')
  const [sourceName, setSourceName] = useState<string>('')
  const [sourceLink, setSourceLink] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('')
  const [youtubeUrl, setYoutubeUrl] = useState<string>('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] p-4 bg-white text-gray-900',
      },
    },
    immediatelyRender: false // Mencegah hydration mismatch
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor]) // Tambahkan empty dependency array untuk mencegah re-render

  useEffect(() => {
    if (article) {
      setStatus(article.status)
      setTitle(article.title || '')
      setSlug(article.slug || '')
      setContent(article.content || '')
      setPublishedAt(article.publishedAt ? article.publishedAt.slice(0, 16) : '')
      setSourceName(article.sourceName || '')
      setSourceLink(article.sourceLink || '')
      setPreviewUrl(article.imagePath ? article.imagePath.replace('/uploads/', '/api/uploads/') : '')
      setVideoPreviewUrl(article.videoPath ? article.videoPath.replace('/uploads/', '/api/uploads/') : '')
      setYoutubeUrl(article.youtubeUrl || '')
      setSelectedFile(null)
      setSelectedVideo(null)
    } else {
      setStatus('active')
      setTitle('')
      setSlug('')
      setContent('')
      setPublishedAt('')
      setSourceName('')
      setSourceLink('')
      setPreviewUrl('')
      setVideoPreviewUrl('')
      setYoutubeUrl('')
      setSelectedFile(null)
      setSelectedVideo(null)
    }
  }, [article])

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      SweetAlerts.error.simple('File Tidak Valid', 'File harus berupa gambar')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      SweetAlerts.error.simple('File Terlalu Besar', 'Ukuran file maksimal 20MB')
      return
    }
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = e => setPreviewUrl(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleVideo = (file: File) => {
    if (!file.type.startsWith('video/')) {
      SweetAlerts.error.simple('File Tidak Valid', 'File harus berupa video')
      return
    }
    if (file.size > 200 * 1024 * 1024) {
      SweetAlerts.error.simple('File Terlalu Besar', 'Ukuran video maksimal 200MB')
      return
    }
    setSelectedVideo(file)
    setVideoPreviewUrl(URL.createObjectURL(file))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleVideo(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const autoSlug = (value: string) => value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      SweetAlerts.warning.validation('Judul dan konten wajib diisi')
      return
    }

    setLoading(true)
    SweetAlerts.loading.show('Menyimpan Artikel...', 'Sedang memproses data artikel')
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('slug', slug || autoSlug(title))
      formData.append('content', content)
      formData.append('status', status)
      if (sourceName) formData.append('sourceName', sourceName)
      if (sourceLink) formData.append('sourceLink', sourceLink)
      if (publishedAt) formData.append('publishedAt', new Date(publishedAt).toISOString())
      if (selectedFile) formData.append('image', selectedFile)
      if (selectedVideo) formData.append('video', selectedVideo)
      if (youtubeUrl) formData.append('youtubeUrl', youtubeUrl)

      const url = article ? `/api/article/${article.id}` : `/api/article`
      const method = article ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        body: formData
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const message = errorData?.message || 'Gagal menyimpan artikel'
        closeSweetAlert()
        await SweetAlerts.error.simple('Gagal Menyimpan', message)
        return
      }

      closeSweetAlert()
      SweetAlerts.toast.success(article ? 'Artikel berhasil diperbarui' : 'Artikel berhasil ditambahkan')
      onSuccess()
      onClose()
    } catch (error) {
      closeSweetAlert()
      SweetAlerts.error.simple('Gagal Menyimpan', 'Terjadi kesalahan tak terduga')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{article ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h2>
            <p className="text-sm text-gray-600 mt-1">{article ? 'Perbarui informasi artikel' : 'Buat artikel baru untuk website'}</p>
          </div>
          <button onClick={onClose} disabled={loading} className="p-2 rounded-xl hover:bg-white/80 transition-colors disabled:opacity-50">
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Image Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Gambar Thumbnail <span className="text-red-500">*</span></label>
            <div
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="relative h-56 rounded-xl overflow-hidden">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white rounded-xl text-gray-800 font-medium hover:bg-gray-100 transition-colors">Ganti Gambar</button>
                  </div>
                </div>
              ) : (
                <div className="h-56 flex flex-col items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium mb-1">Klik untuk upload atau drag & drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, WEBP (Maks. 20MB)</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
          </div>

          {/* Fields */}
          <div className="grid gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Judul <span className="text-red-500">*</span></label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masukkan judul artikel" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black" required maxLength={180} />
              <p className="text-xs text-gray-500 mt-1">{title.length}/180 karakter</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="otomatis dari judul jika dikosongi" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black" maxLength={180} />
              <p className="text-xs text-gray-500 mt-1">{slug.length}/180 karakter</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Konten <span className="text-red-500">*</span></label>
              <div className="border-2 border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                {typeof window !== 'undefined' && (
                <>
                  {editor && <MenuBar editor={editor} />}
                    {/* BENAR: Hanya gunakan style manual Anda */ }
                    <div className="max-w-none"> {/* Hapus 'prose' dan 'prose-sm' */}
                      <EditorContent editor={editor} />
                      <style jsx global>{`
                        .ProseMirror {
                          min-height: 300px;
                          padding: 1rem;
                          color: #111827;
                          background: white;
                        }
                        .ProseMirror:focus {
                          outline: none;
                        }
                        .ProseMirror p {
                          color: #111827;
                          margin-top: 0;
                          margin-bottom: 0.75rem;
                        }
                        .ProseMirror h2 {
                          color: #1f2937;
                          font-weight: 700;
                          margin-top: 1.5rem;
                          margin-bottom: 0.75rem;
                        }
                        .ProseMirror h3 {
                          color: #374151;
                          font-weight: 600;
                          margin-top: 1.25rem;
                          margin-bottom: 0.75rem;
                        }
                        /* === PERBAIKAN LIST === */
                        .ProseMirror ul, .ProseMirror ol {
                          color: #111827;
                          padding-left: 1.5rem; /* Tambah padding untuk ruang bullet */
                          margin: 0.5rem 0;
                          list-style-position: outside; /* UBAH KE OUTSIDE */
                        }
                        .ProseMirror ul { list-style-type: disc; }
                        .ProseMirror ol { list-style-type: decimal; }
                                            
                        .ProseMirror li {
                          color: #111827;
                          margin: 0 0 0.25rem 0;
                          padding-left: 0.25rem; /* Tambah sedikit padding untuk jarak */
                        }
                        .ProseMirror li::marker { 
                          color: #374151; 
                        }
                        /* Paksa paragraf DI DALAM list untuk tidak punya margin */
                        .ProseMirror li p { 
                          margin-top: 0; 
                          margin-bottom: 0;
                          display: inline; /* TAMBAHKAN INI agar p tetap sebaris */
                        }
                        /* === SELESAI PERBAIKAN === */
                      
                        .ProseMirror strong {
                          color: #111827;
                          font-weight: 700;
                        }
                        .ProseMirror em {
                          color: #111827;
                        }
                        .ProseMirror u {
                          color: #111827;
                        }
                        .ProseMirror a {
                          color: #2563eb;
                          text-decoration: underline;
                        }
                        .ProseMirror::placeholder {
                          color: #9ca3af;
                        }
                      `}</style>
                    </div>
                </>
              )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Gunakan tombol format di atas untuk mengatur tampilan teks</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setStatus('active')} className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${status === 'active' ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  <CheckCircleIcon className="w-5 h-5" /> Aktif
                </button>
                <button type="button" onClick={() => setStatus('inactive')} className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${status === 'inactive' ? 'bg-gray-700 text-white ring-2 ring-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  <ExclamationCircleIcon className="w-5 h-5" /> Nonaktif
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Terbit</label>
              <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black" />
            </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sumber Artikel</label>
            <input
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="Contoh: Detikcom"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
              maxLength={255}
            />
            <p className="text-xs text-gray-500 mt-1">{sourceName.length}/255 karakter</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Link Sumber</label>
            <input
              value={sourceLink}
              onChange={(e) => setSourceLink(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
              maxLength={512}
            />
            <p className="text-xs text-gray-500 mt-1">{sourceLink.length}/512 karakter</p>
          </div>
          </div>
          {/* Video Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Video (opsional)</label>
            <div className="rounded-2xl border border-gray-300 bg-gray-50 p-4">
              <div className="flex items-center gap-4">
                <input type="file" accept="video/*" onChange={handleVideoSelect} className="block w-full text-sm text-gray-700" />
              </div>
              <div className="mt-3">
                {videoPreviewUrl ? (
                  <video src={videoPreviewUrl} className="w-full rounded-lg" controls />
                ) : article?.videoPath ? (
                  <video src={article.videoPath} className="w-full rounded-lg" controls />
                ) : (
                  <p className="text-sm text-gray-500">Belum ada video</p>
                )}
              </div>
            </div>
          </div>

          {/* YouTube URL */}
          <div className="grid gap-2">
            <label className="block text-sm font-semibold text-gray-700">Link YouTube (opsional)</label>
            <input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
              maxLength={255}
            />
            {youtubeUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
                {(() => {
                  const m = youtubeUrl.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,})/)
                  const id = m?.[1]
                  if (!id) return null
                  const embed = `https://www.youtube.com/embed/${id}`
                  return (
                    <iframe
                      className="w-full h-full"
                      src={embed}
                      frameBorder={0}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )
                })()}
              </div>
            )}
          </div>

        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
          <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all disabled:opacity-50">Batal</button>
          <button onClick={handleSubmit} disabled={loading || !title || !content} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {loading ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Menyimpan...</span></>) : (<span>{article ? 'Perbarui Artikel' : 'Tambah Artikel'}</span>)}
          </button>
        </div>

      </div>
    </div>
  )
}
