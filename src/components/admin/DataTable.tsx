import type { ReactNode } from 'react'
import { Pagination } from './Pagination'
import { TableToolbar } from './TableToolbar'

interface DataTableMeta {
  from: number | null
  to: number | null
  total: number
}

interface DataTableProps {
  loading?: boolean
  emptyMessage?: string
  isEmpty?: boolean
  search?: string
  onSearch?: (value: string) => void
  searchPlaceholder?: string
  toolbar?: ReactNode
  currentPage?: number
  lastPage?: number
  onPageChange?: (page: number) => void
  meta?: DataTableMeta
  children: ReactNode
}

export function DataTable({
  loading,
  emptyMessage = 'No hay registros.',
  isEmpty,
  search,
  onSearch,
  searchPlaceholder,
  toolbar,
  currentPage = 1,
  lastPage = 1,
  onPageChange,
  meta,
  children,
}: DataTableProps) {
  const showToolbar = onSearch || toolbar

  if (loading) {
    return <p className="text-stone-500">Cargando...</p>
  }

  return (
    <div className="card overflow-hidden">
      {showToolbar && (
        <TableToolbar search={search} onSearch={onSearch} searchPlaceholder={searchPlaceholder}>
          {toolbar}
        </TableToolbar>
      )}

      <div className="overflow-x-auto">
        {isEmpty ? (
          <p className="px-6 py-12 text-center text-stone-500">{emptyMessage}</p>
        ) : (
          children
        )}
      </div>

      {onPageChange && (lastPage > 1 || meta) && (
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          onPageChange={onPageChange}
          meta={meta}
        />
      )}
    </div>
  )
}
