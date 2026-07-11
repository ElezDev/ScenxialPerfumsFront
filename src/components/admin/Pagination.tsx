import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationMeta {
  from: number | null
  to: number | null
  total: number
}

interface PaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
  meta?: PaginationMeta
}

function getPageNumbers(current: number, last: number): (number | 'ellipsis')[] {
  if (last <= 1) return [1]
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)

  const pages: (number | 'ellipsis')[] = [1]

  if (current > 3) pages.push('ellipsis')

  const start = Math.max(2, current - 1)
  const end = Math.min(last - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < last - 2) pages.push('ellipsis')

  pages.push(last)
  return pages
}

export function Pagination({ currentPage, lastPage, onPageChange, meta }: PaginationProps) {
  if (lastPage <= 1 && !meta) return null

  const pages = getPageNumbers(currentPage, lastPage)

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-noir-700 px-6 py-4 sm:flex-row">
      {meta && (
        <p className="text-sm text-stone-500">
          {meta.total === 0 ? (
            'Sin resultados'
          ) : (
            <>
              Mostrando <span className="text-stone-300">{meta.from ?? 0}</span>–
              <span className="text-stone-300">{meta.to ?? 0}</span> de{' '}
              <span className="text-stone-300">{meta.total}</span>
            </>
          )}
        </p>
      )}

      {lastPage > 1 && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded-lg p-1.5 text-stone-400 transition hover:text-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {pages.map((p, i) =>
            p === 'ellipsis' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-stone-600">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`min-w-[2rem] rounded-lg px-2.5 py-1.5 text-sm transition ${
                  p === currentPage
                    ? 'bg-gold-500 text-noir-950'
                    : 'bg-noir-800 text-stone-400 hover:text-gold-400'
                }`}
              >
                {p}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= lastPage}
            className="rounded-lg p-1.5 text-stone-400 transition hover:text-gold-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
