import { type FormEvent, useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '../../components/admin/DataTable'
import { ProductImagesField, type ProductImageInput } from '../../components/ProductImagesField'
import { adminApi } from '../../lib/api'
import { confirmDelete, toastDeleted, toastError, toastSaved } from '../../lib/alerts'
import { formatPrice, getProductImage } from '../../lib/utils'
import type { Brand, Category, Product } from '../../types'

const PER_PAGE = 15

const emptyProduct = {
  category_id: 0,
  brand_id: '',
  name: '',
  sku: '',
  price: '',
  compare_price: '',
  stock: '',
  description: '',
  short_description: '',
  is_active: true,
  is_featured: false,
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyProduct)
  const [images, setImages] = useState<ProductImageInput[]>([])
  const [error, setError] = useState('')

  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [meta, setMeta] = useState({ from: null as number | null, to: null as number | null, total: 0 })
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [brandFilter, setBrandFilter] = useState('')

  function load() {
    setLoading(true)
    Promise.all([
      adminApi.products({
        page,
        per_page: PER_PAGE,
        search: search || undefined,
        category: categoryFilter || undefined,
        brand: brandFilter || undefined,
      }),
      adminApi.categories(),
      adminApi.brands(),
    ])
      .then(([productsRes, categoriesRes, brandsRes]) => {
        setProducts(productsRes.data.data)
        setLastPage(productsRes.data.meta.last_page)
        setMeta({
          from: productsRes.data.meta.from,
          to: productsRes.data.meta.to,
          total: productsRes.data.meta.total,
        })
        setCategories(categoriesRes.data.data)
        setBrands(brandsRes.data.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [page, search, categoryFilter, brandFilter])

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleCategoryFilter(value: string) {
    setCategoryFilter(value)
    setPage(1)
  }

  function handleBrandFilter(value: string) {
    setBrandFilter(value)
    setPage(1)
  }

  function openCreate() {
    setEditing(null)
    setForm({ ...emptyProduct, category_id: categories[0]?.id ?? 0 })
    setImages([])
    setShowForm(true)
    setError('')
  }

  function openEdit(product: Product) {
    setEditing(product)
    setForm({
      category_id: product.category?.id ?? 0,
      brand_id: product.brand?.id ? String(product.brand.id) : '',
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      compare_price: product.compare_price ? String(product.compare_price) : '',
      stock: String(product.stock),
      description: product.description ?? '',
      short_description: product.short_description ?? '',
      is_active: product.is_active,
      is_featured: product.is_featured,
    })
    setImages(
      (product.images ?? []).map((img) => ({
        path: img.path,
        is_primary: img.is_primary,
        sort_order: img.sort_order,
      })),
    )
    setShowForm(true)
    setError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    const payload: Record<string, unknown> = {
      category_id: form.category_id,
      brand_id: form.brand_id ? Number(form.brand_id) : null,
      name: form.name,
      sku: form.sku,
      price: Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      stock: Number(form.stock),
      description: form.description || null,
      short_description: form.short_description || null,
      is_active: form.is_active,
      is_featured: form.is_featured,
      images: images.length > 0 ? images : [],
    }

    try {
      if (editing) {
        await adminApi.updateProduct(editing.id, payload)
      } else {
        await adminApi.createProduct(payload)
      }
      setShowForm(false)
      toastSaved('Producto')
      load()
    } catch {
      toastError('Error al guardar', 'No se pudo guardar el producto.')
    }
  }

  async function handleDelete(id: number) {
    if (!(await confirmDelete('este producto'))) return
    await adminApi.deleteProduct(id)
    toastDeleted('Producto')
    load()
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl text-stone-100">Productos</h1>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          Nuevo producto
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4 p-6">
          <h2 className="font-display text-xl text-stone-100">
            {editing ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="input-field"
            />
            <input
              placeholder="SKU"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              required
              className="input-field"
            />
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
              required
              className="input-field"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={form.brand_id}
              onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
              className="input-field"
            >
              <option value="">Sin marca</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <input
              placeholder="Precio"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className="input-field"
            />
            <input
              placeholder="Precio comparación"
              type="number"
              step="0.01"
              value={form.compare_price}
              onChange={(e) => setForm({ ...form, compare_price: e.target.value })}
              className="input-field"
            />
            <input
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
              className="input-field"
            />
          </div>
          <textarea
            placeholder="Descripción corta"
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field"
            rows={3}
          />
          <ProductImagesField value={images} onChange={setImages} />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-stone-400">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              Activo
            </label>
            <label className="flex items-center gap-2 text-sm text-stone-400">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              />
              Destacado
            </label>
          </div>
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
        searchPlaceholder="Buscar por nombre o SKU..."
        currentPage={page}
        lastPage={lastPage}
        onPageChange={setPage}
        meta={meta}
        isEmpty={products.length === 0}
        emptyMessage="No se encontraron productos."
        toolbar={
          <>
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="input-field sm:w-48"
            >
              <option value="">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={brandFilter}
              onChange={(e) => handleBrandFilter(e.target.value)}
              className="input-field sm:w-48"
            >
              <option value="">Todas las marcas</option>
              {brands.map((b) => (
                <option key={b.id} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </>
        }
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-noir-700 text-left text-stone-500">
              <th className="px-6 py-3">Imagen</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">SKU</th>
              <th className="px-6 py-3">Precio</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-noir-800">
                <td className="px-6 py-3">
                  {getProductImage(p) ? (
                    <img
                      src={getProductImage(p)!}
                      alt={p.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <span className="text-stone-600">—</span>
                  )}
                </td>
                <td className="px-6 py-3">{p.name}</td>
                <td className="px-6 py-3 text-stone-500">{p.sku}</td>
                <td className="px-6 py-3">{formatPrice(p.price)}</td>
                <td className="px-6 py-3">{p.stock}</td>
                <td className="px-6 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      p.is_active
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {p.is_active ? 'Activo' : 'Inactivo'}
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
