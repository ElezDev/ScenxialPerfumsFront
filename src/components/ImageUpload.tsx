import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { adminApi } from '../lib/api'
import { imagePathToUrl } from '../lib/utils'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  label?: string
}

export function ImageUpload({ value, onChange, folder = 'uploads', label = 'Imagen' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const { data } = await adminApi.upload(file, folder)
      onChange(data.path)
    } finally {
      setUploading(false)
    }
  }

  const preview = imagePathToUrl(value)

  return (
    <div>
      <label className="mb-2 block text-sm text-stone-400">{label}</label>
      <div className="flex flex-wrap items-start gap-4">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Vista previa"
              className="h-24 w-40 rounded-lg border border-noir-600 object-cover"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -right-2 -top-2 rounded-full bg-noir-800 p-1 text-stone-400 hover:text-red-400"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-24 w-40 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-noir-600 text-stone-500 transition hover:border-gold-500/50 hover:text-gold-400"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <ImagePlus className="h-5 w-5" />
                <span className="text-xs">Subir imagen</span>
              </>
            )}
          </button>
        )}
        <div className="flex-1 space-y-2">
          <input
            placeholder="O pegá una URL de imagen"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input-field"
          />
          {preview && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-xs text-gold-400 hover:underline"
            >
              Cambiar imagen
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
