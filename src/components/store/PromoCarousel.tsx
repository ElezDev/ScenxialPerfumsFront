import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { assetUrl, formatPrice } from '../../lib/utils'
import type { Promo } from '../../types'

const AUTO_INTERVAL = 4500

interface PromoCarouselProps {
  promos: Promo[]
}

function promoDiscount(promo: Promo) {
  if (promo.discount_type === 'percentage') return `${promo.discount_value}%`
  return formatPrice(promo.discount_value)
}

export function PromoCarousel({ promos }: PromoCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const pausedRef = useRef(false)
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current
    if (!el) return
    const cards = el.querySelectorAll<HTMLElement>('[data-promo-card]')
    const card = cards[index]
    if (!card) return
    const offset = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2
    el.scrollTo({ left: offset, behavior: 'smooth' })
  }, [])

  const pauseAutoPlay = useCallback(() => {
    pausedRef.current = true
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    pauseTimerRef.current = setTimeout(() => {
      pausedRef.current = false
    }, 8000)
  }, [])

  const goTo = useCallback(
    (next: number) => {
      const index = ((next % promos.length) + promos.length) % promos.length
      setActiveIndex(index)
      scrollToIndex(index)
    },
    [promos.length, scrollToIndex],
  )

  useEffect(() => {
    if (promos.length <= 1) return
    const timer = setInterval(() => {
      if (pausedRef.current) return
      setActiveIndex((i) => {
        const next = (i + 1) % promos.length
        scrollToIndex(next)
        return next
      })
    }, AUTO_INTERVAL)
    return () => clearInterval(timer)
  }, [promos.length, scrollToIndex])

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    }
  }, [])

  function scrollBy(direction: -1 | 1) {
    pauseAutoPlay()
    goTo(activeIndex + direction)
  }

  if (promos.length === 0) return null

  return (
    <section className="border-t border-white/[0.06] bg-carbon py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        <div className="mb-6 flex items-end justify-between sm:mb-8">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.35em] text-aged-gold">
              Exclusivo
            </p>
            <h2 className="mt-2 font-display text-2xl text-bone sm:text-3xl">
              Promociones
            </h2>
          </div>
          {promos.length > 1 && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-bone/70 transition-all duration-300 hover:border-aged-gold/40 hover:text-aged-gold"
                aria-label="Promo anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-bone/70 transition-all duration-300 hover:border-aged-gold/40 hover:text-aged-gold"
                aria-label="Promo siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div
          ref={scrollRef}
          className="boutique-carousel-track flex gap-4 overflow-x-auto pb-2 sm:gap-5"
          onTouchStart={pauseAutoPlay}
          onMouseDown={pauseAutoPlay}
        >
          {promos.map((promo, i) => {
            const image = assetUrl(promo.image)

            return (
              <article
                key={promo.id}
                data-promo-card
                className={`boutique-promo-card group min-w-[82vw] shrink-0 snap-center transition-all duration-500 sm:min-w-[340px] md:min-w-[380px] ${
                  i === activeIndex ? 'ring-1 ring-aged-gold/30' : ''
                }`}
              >
                {image && (
                  <img
                    src={image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-25 transition-transform duration-[600ms] ease-out group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/80 to-carbon/40" />

                <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
                  <div>
                    <span className="inline-block border border-aged-gold/40 px-3 py-1 font-body text-xs uppercase tracking-[0.25em] text-aged-gold">
                      {promoDiscount(promo)} off
                    </span>
                    <h3 className="mt-4 font-display text-xl text-bone sm:text-2xl">
                      {promo.title}
                    </h3>
                    {promo.description && (
                      <p className="mt-2 font-body text-sm leading-relaxed text-bone/65">
                        {promo.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex items-end justify-between gap-4">
                    {promo.code ? (
                      <div>
                        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-bone/40">
                          Código
                        </p>
                        <code className="mt-1 block font-body text-sm tracking-[0.2em] text-aged-gold">
                          {promo.code}
                        </code>
                      </div>
                    ) : (
                      <span />
                    )}
                    {promo.min_purchase != null && promo.min_purchase > 0 && (
                      <p className="text-right font-body text-[10px] uppercase tracking-[0.2em] text-bone/40">
                        Mín. {formatPrice(promo.min_purchase)}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {promos.length > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {promos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  pauseAutoPlay()
                  goTo(i)
                }}
                aria-label={`Promo ${i + 1}`}
                className={`h-px transition-all duration-500 ${
                  i === activeIndex ? 'w-8 bg-aged-gold' : 'w-3 bg-bone/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
