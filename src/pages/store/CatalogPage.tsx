import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { BoutiqueProductCard } from '../../components/catalog/BoutiqueProductCard'
import { CatalogFilters } from '../../components/catalog/CatalogFilters'
import { CatalogHero } from '../../components/catalog/CatalogHero'
import { LuxuryPagination } from '../../components/catalog/LuxuryPagination'
import { ScrollReveal } from '../../components/catalog/ScrollReveal'
import { useCart } from '../../context/CartContext'
import { catalogApi } from '../../lib/api'
import type { Brand, Category, Product } from '../../types'

export function CatalogPage() {
  const { addItem } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [meta, setMeta] = useState({ from: null as number | null, to: null as number | null, total: 0 })
  const [filtersOpen, setFiltersOpen] = useState(false)

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

  const activeFilters = [category, brand, search].filter(Boolean).length

  return (
    <div className="bg-carbon">
      <CatalogHero />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-10 md:py-16">
        <div className="mb-8 flex items-end justify-between border-b border-white/[0.06] pb-6 md:mb-10 md:pb-8">
          <div>
            <p className="font-body text-xs font-normal uppercase tracking-[0.35em] text-aged-gold">
              Colección
            </p>
            <h2 className="mt-2 font-display text-2xl font-normal tracking-wide text-bone sm:text-3xl md:text-4xl">
              Catálogo
            </h2>
            {!loading && meta.total > 0 && (
              <p className="mt-2 font-body text-sm text-bone/60">
                {meta.total} fragancia{meta.total !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="flex shrink-0 items-center gap-2 border border-white/10 px-3 py-2 font-body text-xs uppercase tracking-[0.2em] text-bone/80 transition-all duration-300 hover:border-aged-gold/30 hover:text-bone sm:px-4 sm:py-2.5 lg:hidden"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtros
            {activeFilters > 0 && (
              <span className="text-aged-gold">({activeFilters})</span>
            )}
          </button>
        </div>

        <div className="flex gap-8 lg:gap-16">
          <CatalogFilters
            categories={categories}
            brands={brands}
            category={category}
            brand={brand}
            search={search}
            sort={sort}
            onCategoryChange={(v) => updateParam('categoria', v)}
            onBrandChange={(v) => updateParam('marca', v)}
            onSearch={(v) => updateParam('q', v)}
            onSortChange={(v) => updateParam('orden', v)}
            mobileOpen={filtersOpen}
            onMobileClose={() => setFiltersOpen(false)}
          />

          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="flex flex-col items-center py-20">
                <div className="boutique-line max-w-[120px]" />
                <p className="mt-6 font-body text-sm uppercase tracking-[0.3em] text-bone/50">
                  Cargando colección...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center py-20">
                <div className="boutique-line max-w-[120px]" />
                <p className="mt-6 font-body text-sm text-bone/60">
                  No hay fragancias en esta selección.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 sm:gap-y-14 xl:grid-cols-3">
                  {products.map((product, i) => (
                    <ScrollReveal key={product.id} delay={i * 60}>
                      <BoutiqueProductCard product={product} onAddToCart={addItem} />
                    </ScrollReveal>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-24 border-t border-white/[0.06] pt-12">
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
          </div>
        </div>
      </section>
    </div>
  )
}
