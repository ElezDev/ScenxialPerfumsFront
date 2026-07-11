import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { LuxuryPagination } from '../../components/catalog/LuxuryPagination'
import { LuxuryProductCard } from '../../components/catalog/LuxuryProductCard'
import { LuxurySectionHeader } from '../../components/store/LuxurySectionHeader'
import { StorePageShell } from '../../components/store/StorePageShell'
import { catalogApi } from '../../lib/api'
import { useCart } from '../../context/CartContext'
import type { Brand, Category, Product } from '../../types'

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { addItem } = useCart()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [meta, setMeta] = useState({ from: null as number | null, to: null as number | null, total: 0 })

  const category = searchParams.get('categoria') ?? ''
  const brand = searchParams.get('marca') ?? ''
  const search = searchParams.get('q') ?? ''
  const sort = searchParams.get('orden') ?? 'newest'
  const page = Number(searchParams.get('pagina') ?? '1')

  useEffect(() => {
    catalogApi.categories({ active_only: true }).then(({ data }) => setCategories(data.data))
    catalogApi.brands({ active_only: true }).then(({ data }) => setBrands(data.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    catalogApi
      .products({
        category: category || undefined,
        brand: brand || undefined,
        search: search || undefined,
        sort,
        page,
        per_page: 12,
      })
      .then(({ data }) => {
        setProducts(data.data)
        setTotalPages(data.meta.last_page)
        setMeta({ from: data.meta.from, to: data.meta.to, total: data.meta.total })
      })
      .finally(() => setLoading(false))
  }, [category, brand, search, sort, page])

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'pagina') next.delete('pagina')
    setSearchParams(next)
  }

  return (
    <StorePageShell>
      <LuxurySectionHeader
        eyebrow="Colección Exclusiva"
        title="Catálogo"
        subtitle="Descubrí fragancias, esencias y piezas seleccionadas con la elegancia de una boutique de alta perfumería."
      />

      <div className="luxury-filter-bar mb-10 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500/50" />
          <input
            type="search"
            placeholder="Buscar fragancias..."
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParam('q', (e.target as HTMLInputElement).value)
            }}
            className="luxury-input pl-11"
          />
        </div>
        <select
          value={category}
          onChange={(e) => updateParam('categoria', e.target.value)}
          className="luxury-input md:w-52"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={brand}
          onChange={(e) => updateParam('marca', e.target.value)}
          className="luxury-input md:w-52"
        >
          <option value="">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => updateParam('orden', e.target.value)}
          className="luxury-input md:w-52"
        >
          <option value="newest">Más recientes</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="name">Nombre A-Z</option>
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-24">
          <div className="gold-divider max-w-xs" />
          <p className="luxury-body mt-8 text-sm tracking-widest">Cargando colección...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center py-24">
          <div className="gold-divider max-w-xs" />
          <p className="luxury-body mt-8 text-sm">No se encontraron productos en esta selección.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <LuxuryProductCard key={product.id} product={product} onAddToCart={addItem} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-14">
              <div className="gold-divider mb-8" />
              <LuxuryPagination
                currentPage={page}
                lastPage={totalPages}
                onPageChange={(p) => updateParam('pagina', String(p))}
                meta={meta}
              />
            </div>
          )}
        </>
      )}
    </StorePageShell>
  )
}
