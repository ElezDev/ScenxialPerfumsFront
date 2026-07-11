import type { ReactNode } from 'react'

interface LuxurySectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: ReactNode
  align?: 'center' | 'left'
}

export function LuxurySectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: LuxurySectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left'

  return (
    <header className={`mb-10 ${alignClass}`}>
      {eyebrow && (
        <p className="luxury-eyebrow">{eyebrow}</p>
      )}
      <h2 className="luxury-heading mt-3 text-3xl md:text-4xl">{title}</h2>
      <div className={`gold-divider mt-5 ${align === 'center' ? 'mx-auto max-w-xs' : 'max-w-xs'}`} />
      {subtitle && (
        <div className={`luxury-body mt-5 max-w-xl text-sm leading-relaxed ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </div>
      )}
    </header>
  )
}
