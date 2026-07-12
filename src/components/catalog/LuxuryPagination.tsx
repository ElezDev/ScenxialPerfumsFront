import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationMeta {
  from: number | null
  to: number | null
  total: number
}

interface LuxuryPaginationProps {
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

export function LuxuryPagination({
  currentPage,
  lastPage,
  onPageChange,
  meta,
}: LuxuryPaginationProps) {
  if (lastPage <= 1 && !meta) return null

  const pages = getPageNumbers(currentPage, lastPage)

  return (
    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
      {meta && (
        <p className="font-body text-sm font-extralight text-mist">
          {meta.total === 0 ? (
            'Sin resultados'
          ) : (
            <>
              Mostrando{' '}
              <span className="text-gold-400/90">{meta.from ?? 0}</span>–
              <span className="text-gold-400/90">{meta.to ?? 0}</span> de{' '}
              <span className="text-gold-400/90">{meta.total}</span>
            </>
          )}
        </p>
      )}

      {lastPage > 1 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded-full border border-white/10 p-2.5 text-mist transition duration-300 hover:border-amber-500/30 hover:text-gold-300 disabled:opacity-30"
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {pages.map((p, i) =>
            p === 'ellipsis' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-mist/30">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`min-w-[2.5rem] rounded-full border px-3.5 py-2 font-body text-sm font-light transition duration-300 ${
                  p === currentPage
                    ? 'border-amber-500/30 bg-amber-500/10 text-gold-300 shadow-[0_0_24px_rgba(201,162,39,0.12)]'
                    : 'border-white/[0.06] text-mist hover:border-amber-500/20 hover:text-champagne'
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
            className="rounded-full border border-white/10 p-2.5 text-mist transition duration-300 hover:border-amber-500/30 hover:text-gold-300 disabled:opacity-30"
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
