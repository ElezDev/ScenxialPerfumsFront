import { type FormEvent, useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '../../components/admin/DataTable'
import { adminApi } from '../../lib/api'
import { confirmDelete, toastDeleted, toastError, toastSaved } from '../../lib/alerts'
import type { User } from '../../types'

const PER_PAGE = 15

const emptyUser = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'customer' as 'admin' | 'customer',
  is_active: true,
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [form, setForm] = useState(emptyUser)

  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [meta, setMeta] = useState({ from: null as number | null, to: null as number | null, total: 0 })
  const [search, setSearch] = useState('')

  function load() {
    setLoading(true)
    adminApi
      .users({ page, per_page: PER_PAGE, search: search || undefined })
      .then(({ data }) => {
        setUsers(data.data)
        setLastPage(data.meta.last_page)
        setMeta({ from: data.meta.from, to: data.meta.to, total: data.meta.total })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [page, search])

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function openCreate() {
    setEditing(null)
    setForm(emptyUser)
    setShowForm(true)
  }

  function openEdit(user: User) {
    setEditing(user)
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone ?? '',
      password: '',
      role: user.roles.includes('admin') ? 'admin' : 'customer',
      is_active: user.is_active,
    })
    setShowForm(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const payload: Record<string, unknown> = {
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      role: form.role,
      is_active: form.is_active,
    }
    if (form.password) payload.password = form.password

    if (editing) {
      await adminApi.updateUser(editing.id, payload)
    } else {
      await adminApi.createUser({ ...payload, password: form.password })
    }
    setShowForm(false)
    toastSaved('Usuario')
    load()
  }

  async function handleDelete(id: number) {
    if (!(await confirmDelete('este usuario'))) return
    try {
      await adminApi.deleteUser(id)
      toastDeleted('Usuario')
      load()
    } catch {
      toastError('No se pudo eliminar', 'El usuario no pudo ser eliminado.')
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-stone-100">Usuarios</h1>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          Nuevo usuario
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4 p-6">
          <h2 className="font-display text-xl text-stone-100">
            {editing ? 'Editar usuario' : 'Nuevo usuario'}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="input-field"
            />
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="input-field"
            />
            <input
              placeholder="Teléfono"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-field"
            />
            <input
              placeholder={editing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={!editing}
              className="input-field"
            />
            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as 'admin' | 'customer' })
              }
              className="input-field"
            >
              <option value="customer">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
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
        onSearch={handleSearch}
        searchPlaceholder="Buscar por nombre o email..."
        currentPage={page}
        lastPage={lastPage}
        onPageChange={setPage}
        meta={meta}
        isEmpty={users.length === 0}
        emptyMessage="No se encontraron usuarios."
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-noir-700 text-left text-stone-500">
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Rol</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-noir-800">
                <td className="px-6 py-3">{u.name}</td>
                <td className="px-6 py-3">{u.email}</td>
                <td className="px-6 py-3">
                  <span className="rounded-full bg-gold-500/10 px-2 py-0.5 text-xs text-gold-400">
                    {u.roles[0] ?? '—'}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      u.is_active
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {u.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(u)}
                      className="text-stone-400 hover:text-gold-400"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(u.id)}
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
