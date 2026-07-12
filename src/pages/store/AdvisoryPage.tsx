import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, BookOpen, Compass } from 'lucide-react'
import { FragranceGuide } from '../../components/advisory/FragranceGuide'
import { FragranceQuiz } from '../../components/advisory/FragranceQuiz'
import { FragranceResult } from '../../components/advisory/FragranceResult'
import { catalogApi } from '../../lib/api'
import {
  buildFragranceProfile,
  rankProductsForProfile,
  type AdvisorAnswers,
  type FragranceProfile,
} from '../../lib/fragranceAdvisor'
import { useCart } from '../../context/CartContext'
import type { Product } from '../../types'

type Tab = 'guide' | 'quiz'

export function AdvisoryPage() {
  const { addItem } = useCart()
  const [tab, setTab] = useState<Tab>('quiz')
  const [profile, setProfile] = useState<FragranceProfile | null>(null)
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loadingRecs, setLoadingRecs] = useState(false)

  useEffect(() => {
    if (!profile) return
    setLoadingRecs(true)
    catalogApi
      .products({ per_page: 50, sort: 'newest' })
      .then(({ data }) => {
        const ranked = rankProductsForProfile(data.data, profile).filter(
          (p) => p.stock > 0,
        )
        setRecommendations(ranked.length > 0 ? ranked : data.data.filter((p) => p.stock > 0))
      })
      .finally(() => setLoadingRecs(false))
  }, [profile])

  function handleQuizComplete(answers: AdvisorAnswers) {
    const result = buildFragranceProfile(answers)
    setProfile(result)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleRestart() {
    setProfile(null)
    setRecommendations([])
    setTab('quiz')
  }

  return (
    <div className="bg-carbon pt-24">
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 md:px-10 md:pb-14">
        <p className="font-body text-xs uppercase tracking-[0.35em] text-aged-gold">
          Scenxial Perfums
        </p>
        <h1 className="mt-3 font-display text-3xl text-bone sm:text-4xl md:text-5xl">
          Asesoría de fragancias
        </h1>
        <p className="mt-4 max-w-2xl font-body text-sm leading-relaxed text-bone/70 sm:text-base">
          Descubrí tu perfil olfativo, aprendé a elegir con criterio y encontrá las fragancias
          que mejor se alinean con tu estilo. Sin presión, con elegancia.
        </p>
        <div className="boutique-line mt-8 max-w-[100px]" />
      </section>

      {profile ? (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:px-10">
          {loadingRecs ? (
            <div className="flex flex-col items-center py-20">
              <div className="boutique-line max-w-[120px]" />
              <p className="mt-6 font-body text-sm text-bone/50">Buscando fragancias para vos...</p>
            </div>
          ) : (
            <FragranceResult
              profile={profile}
              recommendations={recommendations}
              onRestart={handleRestart}
              onAddToCart={addItem}
            />
          )}
        </section>
      ) : (
        <>
          <section className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
            <div className="flex gap-2 border-b border-white/[0.06]">
              <button
                type="button"
                onClick={() => setTab('quiz')}
                className={`flex items-center gap-2 border-b px-4 py-3 font-body text-xs uppercase tracking-[0.2em] transition-colors ${
                  tab === 'quiz'
                    ? 'border-aged-gold text-aged-gold'
                    : 'border-transparent text-bone/50 hover:text-bone'
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                Descubrí tu perfil
              </button>
              <button
                type="button"
                onClick={() => setTab('guide')}
                className={`flex items-center gap-2 border-b px-4 py-3 font-body text-xs uppercase tracking-[0.2em] transition-colors ${
                  tab === 'guide'
                    ? 'border-aged-gold text-aged-gold'
                    : 'border-transparent text-bone/50 hover:text-bone'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Guía olfativa
              </button>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-10 md:py-14">
            {tab === 'quiz' ? (
              <div className="mx-auto max-w-2xl">
                <div className="mb-8 flex items-start gap-3 border border-white/[0.06] bg-graphite/20 p-5">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-aged-gold" />
                  <p className="font-body text-sm leading-relaxed text-bone/65">
                    Respondé 5 preguntas sencillas. Te diremos qué familia olfativa te representa,
                    cómo elegir tu perfume y qué fragancias de nuestra colección podrían encajar
                    con vos.
                  </p>
                </div>
                <FragranceQuiz onComplete={handleQuizComplete} />
              </div>
            ) : (
              <FragranceGuide />
            )}
          </section>

          <section className="border-t border-white/[0.06] py-12">
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 md:px-10">
              <p className="font-body text-sm text-bone/60">
                ¿Preferís una asesoría humana? Nuestro equipo te guía paso a paso.
              </p>
              <Link to="/catalogo" className="boutique-cta-outline mt-6 inline-flex">
                Ver colección completa
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
