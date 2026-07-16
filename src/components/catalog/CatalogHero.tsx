import { useEffect, useState } from 'react'
import { catalogApi } from '../../lib/api'
import { assetUrl } from '../../lib/utils'
import { BRAND } from '../../lib/brand'
import { ScenxialLogo } from '../store/ScenxialLogo'

export function CatalogHero() {
  const [heroImage, setHeroImage] = useState<string | null>(null)

  useEffect(() => {
    async function loadHero() {
      try {
        const { data: bannerData } = await catalogApi.banners({ active_only: true })
        const banner = bannerData.data[0]
        if (banner?.image) {
          setHeroImage(assetUrl(banner.image))
          return
        }
      } catch {
        /* fallback to featured product */
      }

      try {
        const { data } = await catalogApi.products({ featured: true, per_page: 1 })
        const img = data.data[0]?.images?.[0]
        if (img) setHeroImage(assetUrl(img.url ?? img.path) ?? null)
      } catch {
        /* static gradient fallback */
      }
    }

    loadHero()
  }, [])

  return (
    <section className="relative flex min-h-[42vh] items-center overflow-hidden sm:min-h-[48vh] md:min-h-[52vh]">
      {heroImage ? (
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-50"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-graphite via-carbon to-carbon" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/60 to-carbon/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-carbon/70 via-carbon/30 to-carbon/70" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 md:px-10 md:pb-14 md:pt-32">
        <div className="mx-auto max-w-xl text-center md:mx-0 md:max-w-2xl md:text-left">
          {/* Logo grande solo en desktop — en móvil ya está en el navbar */}
          <div className="hidden md:block">
            <ScenxialLogo size="lg" asLink={false} align="left" />
            <div className="boutique-line mt-5 max-w-xs" />
          </div>

          <p className="font-display text-2xl font-normal italic leading-snug text-bone sm:text-3xl md:mt-6 md:text-4xl">
            {BRAND.heroTagline}
          </p>

          <p className="mx-auto mt-4 max-w-sm font-body text-sm font-normal leading-relaxed text-bone/75 sm:text-base md:mx-0 md:mt-5 md:max-w-md">
            Una selección curada de fragancias que hablan antes que tú.
            Silencio, presencia, memoria.
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-aged-gold/40 to-transparent" />
    </section>
  )
}
