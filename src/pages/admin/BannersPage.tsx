import { type FormEvent, useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '../../components/admin/DataTable'
import { ImageUpload } from '../../components/ImageUpload'
import { adminApi } from '../../lib/api'
import { confirmDelete, toastDeleted, toastSaved } from '../../lib/alerts'
import { assetUrl } from '../../lib/utils'
import { useClientPagination } from '../../hooks/useClientPagination'
import type { Banner } from '../../types'

const emptyBanner = {
  title: '',
  subtitle: '',
  image: '',
  link_url: '',
  link_text: 'Ver más',
  is_active: true,
  sort_order: 0,
  starts_at: '',
  ends_at: '',
}

export function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Banner | null>(null)
  const [form, setForm] = useState(emptyBanner)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { items: bannersPage, lastPage, safePage, meta } = useClientPagination({
    items: banners,
    page,
    search,
    searchFields: (b) => [b.title, b.subtitle ?? '', b.link_url ?? ''],
  })

  function load() {
    setLoading(true)
    adminApi.banners().then(({ data }) => {
      setBanners(data.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate() {
    setEditing(null)
    setForm(emptyBanner)
    setShowForm(true)
  }

  function openEdit(banner: Banner) {
    setEditing(banner)
    setForm({
      title: banner.title,
      subtitle: banner.subtitle ?? '',
      image: banner.image ?? '',
      link_url: banner.link_url ?? '',
      link_text: banner.link_text ?? 'Ver más',
      is_active: banner.is_active,
      sort_order: banner.sort_order,
      starts_at: banner.starts_at ? banner.starts_at.slice(0, 16) : '',
      ends_at: banner.ends_at ? banner.ends_at.slice(0, 16) : '',
    })
    setShowForm(true)
  }

  function buildPayload() {
    return {
      title: form.title,
      subtitle: form.subtitle || null,
      image: form.image || null,
      link_url: form.link_url || null,
      link_text: form.link_text || null,
      is_active: form.is_active,
      sort_order: form.sort_order,
      starts_at: form.starts_at || null,
      ends_at: form.ends_at || null,
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const payload = buildPayload()
    if (editing) {
      await adminApi.updateBanner(editing.id, payload)
    } else {
      await adminApi.createBanner(payload)
    }
    setShowForm(false)
    toastSaved('Banner')
    load()
  }

  async function handleDelete(id: number) {
    if (!(await confirmDelete('este banner'))) return
    await adminApi.deleteBanner(id)
    toastDeleted('Banner')
    load()
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-stone-100">Banners</h1>
          <p className="mt-1 text-sm text-stone-500">
            Gestioná los banners del home y sliders promocionales.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          Nuevo banner
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4 p-6">
          <h2 className="font-display text-xl text-stone-100">
            {editing ? 'Editar banner' : 'Nuevo banner'}
          </h2>
          <input
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="input-field"
          />
          <textarea
            placeholder="Subtítulo"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="input-field"
          />
          <ImageUpload
            value={form.image}
            onChange={(image) => setForm({ ...form, image })}
            folder="banners"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="URL del enlace (ej: /catalogo)"
              value={form.link_url}
              onChange={(e) => setForm({ ...form, link_url: e.target.value })}
              className="input-field"
            />
            <input
              placeholder="Texto del botón"
              value={form.link_text}
              onChange={(e) => setForm({ ...form, link_text: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <input
              placeholder="Orden"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              className="input-field"
            />
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
            Activo
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
        searchPlaceholder="Buscar banner..."
        currentPage={safePage}
        lastPage={lastPage}
        onPageChange={setPage}
        meta={meta}
        isEmpty={bannersPage.length === 0}
        emptyMessage="No hay banners. Crea el primero para el home."
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-noir-700 text-left text-stone-500">
              <th className="px-6 py-3">Imagen</th>
              <th className="px-6 py-3">Título</th>
              <th className="px-6 py-3">Enlace</th>
              <th className="px-6 py-3">Orden</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bannersPage.map((b) => (
              <tr key={b.id} className="border-b border-noir-800">
                <td className="px-6 py-3">
                  {assetUrl(b.image) ? (
                    <img
                      src={assetUrl(b.image)!}
                      alt={b.title}
                      className="h-10 w-16 rounded object-cover"
                    />
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </td>
                <td className="px-6 py-3">
                  <p className="font-medium text-stone-200">{b.title}</p>
                  {b.subtitle && <p className="text-xs text-stone-500">{b.subtitle}</p>}
                </td>
                <td className="px-6 py-3 text-stone-500">{b.link_url ?? '—'}</td>
                <td className="px-6 py-3">{b.sort_order}</td>
                <td className="px-6 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      b.is_active
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {b.is_active ? 'Activo' : 'Inactivo'}
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
