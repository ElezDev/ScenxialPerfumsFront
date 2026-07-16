import { useEffect, useRef, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { BoutiqueCheckbox } from './BoutiqueCheckbox'
import type { Brand, Category } from '../../types'

interface CatalogFiltersProps {
  categories: Category[]
  brands: Brand[]
  category: string
  brand: string
  search: string
  sort: string
  onCategoryChange: (slug: string) => void
  onBrandChange: (slug: string) => void
  onSearch: (value: string) => void
  onSortChange: (value: string) => void
  mobileOpen: boolean
  onMobileClose: () => void
}

const sortOptions = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio ascendente' },
  { value: 'price_desc', label: 'Precio descendente' },
  { value: 'name', label: 'Nombre A–Z' },
]

export function CatalogFilters({
  categories,
  brands,
  category,
  brand,
  search,
  sort,
  onCategoryChange,
  onBrandChange,
  onSearch,
  onSortChange,
  mobileOpen,
  onMobileClose,
}: CatalogFiltersProps) {
  const [searchValue, setSearchValue] = useState(search)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setSearchValue(search)
  }, [search])

  function handleSearchChange(value: string) {
    setSearchValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onSearch(value), 400)
  }

  const panel = (
    <div className="space-y-10">
      <div>
        <p className="boutique-filter-label">Buscar</p>
        <div className="relative mt-4">
          <Search className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-aged-gold/40" />
          <input
            type="search"
            placeholder="Nombre, casa, nota..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (debounceRef.current) clearTimeout(debounceRef.current)
                onSearch((e.target as HTMLInputElement).value)
              }
            }}
            className="boutique-search-input pl-6"
          />
        </div>
      </div>

      {categories.length > 0 && (
        <div>
          <p className="boutique-filter-label">Categoría</p>
          <div className="mt-4 space-y-1">
            <BoutiqueCheckbox
              checked={!category}
              onChange={() => onCategoryChange('')}
              label="Todas"
            />
            {categories.map((cat) => (
              <BoutiqueCheckbox
                key={cat.id}
                checked={category === cat.slug}
                onChange={() => onCategoryChange(cat.slug)}
                label={cat.name}
                count={cat.products_count}
              />
            ))}
          </div>
        </div>
      )}

      {brands.length > 0 && (
        <div>
          <p className="boutique-filter-label">Casa / Marca</p>
          <div className="mt-4 space-y-1">
            <BoutiqueCheckbox
              checked={!brand}
              onChange={() => onBrandChange('')}
              label="Todas"
            />
            {brands.map((b) => (
              <BoutiqueCheckbox
                key={b.id}
                checked={brand === b.slug}
                onChange={() => onBrandChange(b.slug)}
                label={b.name}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="boutique-filter-label">Ordenar</p>
        <div className="mt-4 space-y-1">
          {sortOptions.map((opt) => (
            <BoutiqueCheckbox
              key={opt.value}
              checked={sort === opt.value}
              onChange={() => onSortChange(opt.value)}
              label={opt.label}
            />
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden w-56 shrink-0 lg:block xl:w-64">
        <div className="sticky top-32">{panel}</div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-carbon/80 backdrop-blur-sm"
            onClick={onMobileClose}
            aria-label="Cerrar filtros"
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-graphite p-8 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <span className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.3em] text-bone">
                <SlidersHorizontal className="h-3.5 w-3.5 text-aged-gold" />
                Filtros
              </span>
              <button type="button" onClick={onMobileClose} className="text-champagne/50 hover:text-bone">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{panel}</div>
          </div>
        </div>
      )}
    </>
  )
}
