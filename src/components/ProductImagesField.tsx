import { ImageUpload } from './ImageUpload'

export interface ProductImageInput {
  path: string
  is_primary: boolean
  sort_order: number
}

interface ProductImagesFieldProps {
  value: ProductImageInput[]
  onChange: (images: ProductImageInput[]) => void
  maxImages?: number
}

const emptySlot = (index: number): ProductImageInput => ({
  path: '',
  is_primary: index === 0,
  sort_order: index,
})

export function ProductImagesField({
  value,
  onChange,
  maxImages = 6,
}: ProductImagesFieldProps) {
  const slots = Array.from({ length: maxImages }, (_, index) => value[index] ?? emptySlot(index))

  function updateSlot(index: number, path: string) {
    const next = [...slots]
    next[index] = { ...next[index], path, sort_order: index }
    const filtered = next.filter((img) => img.path)
    if (filtered.length && !filtered.some((img) => img.is_primary)) {
      filtered[0].is_primary = true
    }
    onChange(filtered)
  }

  function setPrimary(index: number) {
    const next = slots.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }))
    onChange(next.filter((img) => img.path))
  }

  return (
    <div>
      <label className="mb-2 block text-sm text-stone-400">
        Imágenes del producto (máx. {maxImages})
      </label>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot, index) => (
          <div key={index} className="rounded-lg border border-noir-700 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-stone-300">Imagen {index + 1}</span>
              {slot.path && (
                <label className="flex items-center gap-2 text-xs text-stone-500">
                  <input
                    type="radio"
                    name="primary-image"
                    checked={slot.is_primary}
                    onChange={() => setPrimary(index)}
                  />
                  Principal
                </label>
              )}
            </div>
            <ImageUpload
              value={slot.path}
              onChange={(path) => updateSlot(index, path)}
              folder="products"
              label=""
            />
          </div>
        ))}
      </div>
    </div>
  )
}
