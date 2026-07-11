import { type FormEvent, useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '../../components/admin/DataTable'
import { ImageUpload } from '../../components/ImageUpload'
import { adminApi } from '../../lib/api'
import { confirmDelete, toastDeleted, toastSaved } from '../../lib/alerts'
import { assetUrl } from '../../lib/utils'
import { useClientPagination } from '../../hooks/useClientPagination'
import type { Brand } from '../../types'

const emptyBrand = {
  name: '',
  logo: '',
  is_active: true,
}

export function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Brand | null>(null)
  const [form, setForm] = useState(emptyBrand)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { items: brandsPage, lastPage, safePage, meta } = useClientPagination({
    items: brands,
    page,
    search,
    searchFields: (b) => [b.name, b.slug],
  })

  function load() {
    setLoading(true)
    adminApi.brands().then(({ data }) => {
      setBrands(data.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate() {
    setEditing(null)
    setForm(emptyBrand)
    setShowForm(true)
  }

  function openEdit(brand: Brand) {
    setEditing(brand)
    setForm({
      name: brand.name,
      logo: brand.logo ?? '',
      is_active: brand.is_active,
    })
    setShowForm(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const payload = {
      name: form.name,
      logo: form.logo || null,
      is_active: form.is_active,
    }
    if (editing) {
      await adminApi.updateBrand(editing.id, payload)
    } else {
      await adminApi.createBrand(payload)
    }
    setShowForm(false)
    toastSaved('Marca')
    load()
  }

  async function handleDelete(id: number) {
    if (!(await confirmDelete('esta marca'))) return
    await adminApi.deleteBrand(id)
    toastDeleted('Marca')
    load()
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-stone-100">Marcas</h1>
          <p className="mt-1 text-sm text-stone-500">Gestioná las marcas de productos.</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          Nueva marca
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4 p-6">
          <h2 className="font-display text-xl text-stone-100">
            {editing ? 'Editar marca' : 'Nueva marca'}
          </h2>
          <input
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="input-field"
          />
          <ImageUpload
            value={form.logo}
            onChange={(logo) => setForm({ ...form, logo })}
            folder="brands"
            label="Logo"
          />
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
        searchPlaceholder="Buscar marca..."
        currentPage={safePage}
        lastPage={lastPage}
        onPageChange={setPage}
        meta={meta}
        isEmpty={brandsPage.length === 0}
        emptyMessage="No se encontraron marcas."
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-noir-700 text-left text-stone-500">
              <th className="px-6 py-3">Logo</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Slug</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {brandsPage.map((b) => (
              <tr key={b.id} className="border-b border-noir-800">
                <td className="px-6 py-3">
                  {assetUrl(b.logo) ? (
                    <img
                      src={assetUrl(b.logo)!}
                      alt={b.name}
                      className="h-8 w-8 rounded object-contain"
                    />
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </td>
                <td className="px-6 py-3">{b.name}</td>
                <td className="px-6 py-3 text-stone-500">{b.slug}</td>
                <td className="px-6 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      b.is_active
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {b.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(b)}
                      className="text-stone-400 hover:text-gold-400"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(b.id)}
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
