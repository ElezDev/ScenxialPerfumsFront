import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { assetUrl } from '../../lib/utils'
import type { Banner } from '../../types'

const AUTO_INTERVAL = 5000

interface BannerCarouselProps {
  banners: Banner[]
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [index, setIndex] = useState(0)

  const goTo = useCallback(
    (next: number) => setIndex(((next % banners.length) + banners.length) % banners.length),
    [banners.length],
  )

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length)
    }, AUTO_INTERVAL)
    return () => clearInterval(timer)
  }, [banners.length])

  if (banners.length === 0) {
    return (
      <section className="relative flex min-h-[42vh] items-center overflow-hidden bg-graphite sm:min-h-[50vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-graphite via-carbon to-carbon" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 text-center sm:px-6 md:px-10">
          <p className="font-body text-xs uppercase tracking-[0.35em] text-aged-gold">Maison</p>
          <h1 className="mt-4 font-display text-3xl text-bone sm:text-4xl md:text-5xl">
            La fragancia que precede tu llegada
          </h1>
          <Link to="/catalogo" className="boutique-cta-solid mt-8 inline-flex items-center gap-2">
            Explorar colección
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-[42vh] overflow-hidden bg-carbon sm:min-h-[50vh] md:min-h-[58vh]">
      {banners.map((banner, i) => {
        const image = assetUrl(banner.image)
        const active = i === index

        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              active ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={!active}
          >
            {image ? (
              <img
                src={image}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[8000ms] ease-out ${
                  active ? 'scale-105' : 'scale-100'
                }`}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-graphite to-carbon" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/55 to-carbon/25" />
            <div className="absolute inset-0 bg-gradient-to-r from-carbon/80 via-carbon/20 to-carbon/70" />
          </div>
        )
      })}

      <div className="relative z-10 mx-auto flex h-full min-h-[inherit] max-w-7xl items-end px-4 pb-10 pt-28 sm:px-6 sm:pb-12 sm:pt-32 md:px-10 md:pb-14">
        <div className="w-full max-w-xl">
          {banners.map((banner, i) => (
            <div
              key={banner.id}
              className={`transition-all duration-700 ease-out ${
                i === index
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none absolute translate-y-4 opacity-0'
              }`}
            >
              {banner.subtitle && (
                <p className="font-body text-xs uppercase tracking-[0.35em] text-aged-gold">
                  {banner.subtitle}
                </p>
              )}
              <h1 className="mt-3 font-display text-3xl font-normal leading-tight text-bone sm:text-4xl md:text-5xl lg:text-6xl">
                {banner.title}
              </h1>
              {banner.link_url && (
                <Link
                  to={banner.link_url}
                  className="boutique-cta-solid mt-6 inline-flex items-center gap-2 sm:mt-8"
                >
                  {banner.link_text ?? 'Descubrir'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-4 pb-6 sm:px-6 md:px-10">
            <div className="flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Banner ${i + 1}`}
                  className={`h-px transition-all duration-500 ${
                    i === index ? 'w-10 bg-aged-gold' : 'w-4 bg-bone/20 hover:bg-bone/40'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-bone/70 transition-all duration-300 hover:border-aged-gold/40 hover:text-aged-gold"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                className="flex h-9 w-9 items-center justify-center border border-white/10 text-bone/70 transition-all duration-300 hover:border-aged-gold/40 hover:text-aged-gold"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 h-px bg-white/5">
            <div
              key={index}
              className="h-full animate-[carousel-progress_5s_linear_forwards] bg-aged-gold/60"
            />
          </div>
        </>
      )}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-aged-gold/30 to-transparent" />
    </section>
  )
}
