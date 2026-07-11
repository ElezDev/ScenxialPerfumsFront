import { useMemo } from 'react'

interface UseClientPaginationOptions<T> {
  items: T[]
  page: number
  perPage?: number
  search?: string
  searchFields?: (item: T) => string[]
  filter?: (item: T) => boolean
}

export function useClientPagination<T>({
  items,
  page,
  perPage = 10,
  search = '',
  searchFields,
  filter,
}: UseClientPaginationOptions<T>) {
  const filtered = useMemo(() => {
    let result = items

    if (filter) {
      result = result.filter(filter)
    }

    if (search.trim() && searchFields) {
      const q = search.trim().toLowerCase()
      result = result.filter((item) =>
        searchFields(item).some((field) => field.toLowerCase().includes(q)),
      )
    }

    return result
  }, [items, search, searchFields, filter])

  const lastPage = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(page, lastPage)
  const offset = (safePage - 1) * perPage
  const paginated = filtered.slice(offset, offset + perPage)

  const meta = {
    from: filtered.length === 0 ? null : offset + 1,
    to: filtered.length === 0 ? null : Math.min(offset + perPage, filtered.length),
    total: filtered.length,
  }

  return { items: paginated, lastPage, safePage, meta }
}
