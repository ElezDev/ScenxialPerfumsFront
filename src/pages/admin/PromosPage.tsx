import { type FormEvent, useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '../../components/admin/DataTable'
import { ImageUpload } from '../../components/ImageUpload'
import { adminApi } from '../../lib/api'
import { confirmDelete, toastDeleted, toastSaved } from '../../lib/alerts'
import { formatPrice } from '../../lib/utils'
import { useClientPagination } from '../../hooks/useClientPagination'
import type { DiscountType, Promo } from '../../types'

const emptyPromo = {
  title: '',
  description: '',
  code: '',
  discount_type: 'percentage' as DiscountType,
  discount_value: 10,
  image: '',
  is_active: true,
  starts_at: '',
  ends_at: '',
  min_purchase: '',
  usage_limit: '',
}

export function PromosPage() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Promo | null>(null)
  const [form, setForm] = useState(emptyPromo)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { items: promosPage, lastPage, safePage, meta } = useClientPagination({
    items: promos,
    page,
    search,
    searchFields: (p) => [p.title, p.description ?? '', p.code ?? ''],
  })

  function load() {
    setLoading(true)
    adminApi.promos().then(({ data }) => {
      setPromos(data.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate() {
    setEditing(null)
    setForm(emptyPromo)
    setShowForm(true)
  }

  function openEdit(promo: Promo) {
    setEditing(promo)
    setForm({
      title: promo.title,
      description: promo.description ?? '',
      code: promo.code ?? '',
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      image: promo.image ?? '',
      is_active: promo.is_active,
      starts_at: promo.starts_at ? promo.starts_at.slice(0, 16) : '',
      ends_at: promo.ends_at ? promo.ends_at.slice(0, 16) : '',
      min_purchase: promo.min_purchase != null ? String(promo.min_purchase) : '',
      usage_limit: promo.usage_limit != null ? String(promo.usage_limit) : '',
    })
    setShowForm(true)
  }

  function buildPayload() {
    return {
      title: form.title,
      description: form.description || null,
      code: form.code || null,
      discount_type: form.discount_type,
      discount_value: form.discount_value,
      image: form.image || null,
      is_active: form.is_active,
      starts_at: form.starts_at || null,
      ends_at: form.ends_at || null,
      min_purchase: form.min_purchase ? Number(form.min_purchase) : null,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const payload = buildPayload()
    if (editing) {
      await adminApi.updatePromo(editing.id, payload)
    } else {
      await adminApi.createPromo(payload)
    }
    setShowForm(false)
    toastSaved('Promoción')
    load()
  }

  async function handleDelete(id: number) {
    if (!(await confirmDelete('esta promoción'))) return
    await adminApi.deletePromo(id)
    toastDeleted('Promoción')
    load()
  }

  function discountLabel(promo: Promo) {
    if (promo.discount_type === 'percentage') return `${promo.discount_value}%`
    return formatPrice(promo.discount_value)
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-stone-100">Promociones</h1>
          <p className="mt-1 text-sm text-stone-500">
            Cupones, descuentos y ofertas especiales para la tienda.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          Nueva promoción
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4 p-6">
          <h2 className="font-display text-xl text-stone-100">
            {editing ? 'Editar promoción' : 'Nueva promoción'}
          </h2>
          <input
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="input-field"
          />
          <textarea
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="Código de cupón (opcional)"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            className="input-field"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={form.discount_type}
              onChange={(e) =>
                setForm({ ...form, discount_type: e.target.value as DiscountType })
              }
              className="input-field"
            >
              <option value="percentage">Porcentaje (%)</option>
              <option value="fixed">Monto fijo ($)</option>
            </select>
            <input
              placeholder="Valor del descuento"
              type="number"
              min={0}
              max={form.discount_type === 'percentage' ? 100 : undefined}
              value={form.discount_value}
              onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
              required
              className="input-field"
            />
          </div>
          <ImageUpload
            value={form.image}
            onChange={(image) => setForm({ ...form, image })}
            folder="promos"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Compra mínima (opcional)"
              type="number"
              min={0}
              value={form.min_purchase}
              onChange={(e) => setForm({ ...form, min_purchase: e.target.value })}
              className="input-field"
            />
            <input
              placeholder="Límite de usos (opcional)"
              type="number"
              min={1}
              value={form.usage_limit}
              onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="datetime-local"
              value={form.starts_at}
              onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
              className="input-field"
              title="Inicio"
            />
            <input
              type="datetime-local"
              value={form.ends_at}
              onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
              className="input-field"
              title="Fin"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-400">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Activa
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">
              Guardar
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <DataTable
        loading={loading}
        search={search}
        onSearch={(value) => {
          setSearch(value)
          setPage(1)
        }}
        searchPlaceholder="Buscar promoción o código..."
        currentPage={safePage}
        lastPage={lastPage}
        onPageChange={setPage}
        meta={meta}
        isEmpty={promosPage.length === 0}
        emptyMessage="No hay promociones. Creá la primera oferta."
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-noir-700 text-left text-stone-500">
              <th className="px-6 py-3">Título</th>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Descuento</th>
              <th className="px-6 py-3">Usos</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {promosPage.map((p) => (
              <tr key={p.id} className="border-b border-noir-800">
                <td className="px-6 py-3">
                  <p className="font-medium text-stone-200">{p.title}</p>
                  {p.description && <p className="text-xs text-stone-500">{p.description}</p>}
                </td>
                <td className="px-6 py-3">
                  {p.code ? (
                    <code className="rounded bg-noir-800 px-2 py-0.5 text-gold-400">{p.code}</code>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-6 py-3">{discountLabel(p)}</td>
                <td className="px-6 py-3 text-stone-500">
                  {p.used_count}
                  {p.usage_limit != null ? ` / ${p.usage_limit}` : ''}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      p.is_active
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {p.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="text-stone-400 hover:text-gold-400"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="text-stone-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  )
}
