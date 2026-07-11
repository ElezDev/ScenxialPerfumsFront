import { type FormEvent, useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '../../components/admin/DataTable'
import { adminApi } from '../../lib/api'
import { confirmDelete, toastDeleted, toastSaved } from '../../lib/alerts'
import { useClientPagination } from '../../hooks/useClientPagination'
import type { Category } from '../../types'

const emptyCategory = {
  name: '',
  description: '',
  is_active: true,
  sort_order: 0,
}

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState(emptyCategory)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { items: categoriesPage, lastPage, safePage, meta } = useClientPagination({
    items: categories,
    page,
    search,
    searchFields: (c) => [c.name, c.slug],
  })

  function load() {
    setLoading(true)
    adminApi.categories().then(({ data }) => {
      setCategories(data.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate() {
    setEditing(null)
    setForm(emptyCategory)
    setShowForm(true)
  }

  function openEdit(category: Category) {
    setEditing(category)
    setForm({
      name: category.name,
      description: category.description ?? '',
      is_active: category.is_active,
      sort_order: category.sort_order,
    })
    setShowForm(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (editing) {
      await adminApi.updateCategory(editing.id, form)
    } else {
      await adminApi.createCategory(form)
    }
    setShowForm(false)
    toastSaved('Categoría')
    load()
  }

  async function handleDelete(id: number) {
    if (!(await confirmDelete('esta categoría'))) return
    await adminApi.deleteCategory(id)
    toastDeleted('Categoría')
    load()
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-stone-100">Categorías</h1>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          Nueva categoría
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4 p-6">
          <h2 className="font-display text-xl text-stone-100">
            {editing ? 'Editar categoría' : 'Nueva categoría'}
          </h2>
          <input
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            placeholder="Orden"
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            className="input-field"
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
        searchPlaceholder="Buscar categoría..."
        currentPage={safePage}
        lastPage={lastPage}
        onPageChange={setPage}
        meta={meta}
        isEmpty={categoriesPage.length === 0}
        emptyMessage="No se encontraron categorías."
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-noir-700 text-left text-stone-500">
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Slug</th>
              <th className="px-6 py-3">Productos</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriesPage.map((c) => (
              <tr key={c.id} className="border-b border-noir-800">
                <td className="px-6 py-3">{c.name}</td>
                <td className="px-6 py-3 text-stone-500">{c.slug}</td>
                <td className="px-6 py-3">{c.products_count ?? '—'}</td>
                <td className="px-6 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      c.is_active
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {c.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="text-stone-400 hover:text-gold-400"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
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
