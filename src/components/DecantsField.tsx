import { Plus, Trash2 } from 'lucide-react'

export interface DecantInput {
  ml: number | ''
  price: number | ''
  stock: number | ''
  is_active: boolean
}

interface DecantsFieldProps {
  value: DecantInput[]
  onChange: (decants: DecantInput[]) => void
  maxDecants?: number
}

const emptyDecant = (): DecantInput => ({ ml: '', price: '', stock: '', is_active: true })

export function DecantsField({ value, onChange, maxDecants = 10 }: DecantsFieldProps) {
  function updateRow(index: number, patch: Partial<DecantInput>) {
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  function addRow() {
    if (value.length >= maxDecants) return
    onChange([...value, emptyDecant()])
  }

  function removeRow(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm text-stone-400">Decants (fracciones en ml) — opcional</label>
        {value.length < maxDecants && (
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar decant
          </button>
        )}
      </div>

      {value.length === 0 && (
        <p className="text-xs text-stone-500">
          Sin decants configurados. Agrega opciones como 3ml, 5ml o 10ml para vender fracciones de
          esta loción.
        </p>
      )}

      <div className="space-y-3">
        {value.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-3 rounded-lg border border-noir-700 p-3 sm:grid-cols-5 sm:items-center"
          >
            <input
              type="number"
              min={1}
              placeholder="Mililitros"
              value={row.ml}
              onChange={(e) =>
                updateRow(index, { ml: e.target.value ? Number(e.target.value) : '' })
              }
              className="input-field"
            />
            <input
              type="number"
              min={0}
              step="0.01"
              placeholder="Precio"
              value={row.price}
              onChange={(e) =>
                updateRow(index, { price: e.target.value ? Number(e.target.value) : '' })
              }
              className="input-field"
            />
            <input
              type="number"
              min={0}
              placeholder="Stock"
              value={row.stock}
              onChange={(e) =>
                updateRow(index, { stock: e.target.value ? Number(e.target.value) : '' })
              }
              className="input-field"
            />
            <label className="flex items-center gap-2 text-xs text-stone-400">
              <input
                type="checkbox"
                checked={row.is_active}
                onChange={(e) => updateRow(index, { is_active: e.target.checked })}
              />
              Activo
            </label>
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="flex items-center justify-center gap-1 text-xs text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Quitar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
