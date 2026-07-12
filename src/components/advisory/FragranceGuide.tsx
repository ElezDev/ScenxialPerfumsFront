import { GUIDE_SECTIONS, FRAGRANCE_FAMILIES } from '../../lib/fragranceAdvisor'

export function FragranceGuide() {
  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.values(FRAGRANCE_FAMILIES).map((family) => (
          <article
            key={family.id}
            className="border border-white/[0.06] bg-graphite/30 p-5 transition-colors duration-300 hover:border-aged-gold/20 sm:p-6"
          >
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-aged-gold">
              {family.tagline}
            </p>
            <h3 className="mt-2 font-display text-lg text-bone">{family.name}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-bone/60">
              {family.description}
            </p>
            <p className="mt-3 font-body text-[10px] uppercase tracking-[0.2em] text-bone/40">
              Notas: {family.notes.join(' · ')}
            </p>
          </article>
        ))}
      </div>

      <div className="border-t border-white/[0.06] pt-10">
        <p className="font-body text-xs uppercase tracking-[0.35em] text-aged-gold">
          Fundamentos
        </p>
        <h3 className="mt-2 font-display text-2xl text-bone">Cómo elegir bien</h3>

        <div className="mt-6 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {GUIDE_SECTIONS.map((section) => (
            <details key={section.title} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-body text-sm uppercase tracking-[0.15em] text-bone transition-colors hover:text-aged-gold">
                {section.title}
                <span className="text-aged-gold/50 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 font-body text-sm leading-relaxed text-bone/65">
                {section.content}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
