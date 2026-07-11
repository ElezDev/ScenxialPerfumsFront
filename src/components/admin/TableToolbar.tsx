import { Search } from 'lucide-react'
import type { ReactNode } from 'react'

interface TableToolbarProps {
  search?: string
  onSearch?: (value: string) => void
  searchPlaceholder?: string
  children?: ReactNode
}

export function TableToolbar({
  search,
  onSearch,
  searchPlaceholder = 'Buscar...',
  children,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-noir-700 p-4 sm:flex-row sm:items-center">
      {onSearch && (
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch((e.target as HTMLInputElement).value)
            }}
            className="input-field pl-10"
          />
        </div>
      )}
      {children}
    </div>
  )
}
