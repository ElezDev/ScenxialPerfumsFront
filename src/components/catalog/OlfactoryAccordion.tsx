import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface NoteSection {
  title: string
  notes: string
}

interface OlfactoryAccordionProps {
  sections: NoteSection[]
}

export function OlfactoryAccordion({ sections }: OlfactoryAccordionProps) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
      {sections.map((section, i) => (
        <div key={section.title}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between py-5 text-left transition-colors duration-300 hover:text-aged-gold"
          >
            <span className="font-body text-[10px] uppercase tracking-[0.35em] text-champagne/60">
              {section.title}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-aged-gold/50 transition-transform duration-300 ${
                open === i ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ease-out ${
              open === i ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="font-body text-sm font-light leading-relaxed text-champagne/60">
              {section.notes}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function parseOlfactoryNotes(attributes: Record<string, unknown> | null): NoteSection[] | null {
  if (!attributes) return null

  const sections: NoteSection[] = []
  const mapping = [
    { keys: ['top_notes', 'notas_salida', 'salida'], title: 'Notas de salida' },
    { keys: ['heart_notes', 'notas_corazon', 'corazon'], title: 'Notas de corazón' },
    { keys: ['base_notes', 'notas_fondo', 'fondo'], title: 'Notas de fondo' },
  ]

  for (const { keys, title } of mapping) {
    for (const key of keys) {
      const val = attributes[key]
      if (typeof val === 'string' && val.trim()) {
        sections.push({ title, notes: val })
        break
      }
    }
  }

  return sections.length > 0 ? sections : null
}

export { parseOlfactoryNotes }
