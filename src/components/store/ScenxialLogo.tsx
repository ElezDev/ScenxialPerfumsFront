import { Link } from 'react-router-dom'

interface ScenxialLogoProps {
  size?: 'sm' | 'md' | 'lg'
  asLink?: boolean
  light?: boolean
  align?: 'center' | 'left'
}

const sizes = {
  sm: { main: 'text-sm sm:text-base tracking-[0.35em]', sub: 'text-[9px] sm:text-[10px] tracking-[0.45em]' },
  md: { main: 'text-lg sm:text-xl tracking-[0.4em]', sub: 'text-[10px] sm:text-[11px] tracking-[0.5em]' },
  lg: { main: 'text-3xl sm:text-4xl md:text-5xl tracking-[0.4em]', sub: 'text-[11px] sm:text-xs tracking-[0.55em]' },
}

export function ScenxialLogo({
  size = 'md',
  asLink = true,
  light = false,
  align = 'center',
}: ScenxialLogoProps) {
  const s = sizes[size]

  const content = (
    <span className={`flex flex-col leading-none ${align === 'left' ? 'items-start' : 'items-center'}`}>
      <span
        className={`font-display font-normal uppercase ${s.main} ${
          light ? 'text-bone' : 'scenxial-wordmark'
        }`}
      >
        Scenxial
      </span>
      <span
        className={`mt-1.5 font-body font-normal uppercase text-aged-gold/90 ${s.sub}`}
      >
        Perfums
      </span>
    </span>
  )

  if (!asLink) return content

  return (
    <Link to="/" className="transition-opacity duration-300 hover:opacity-80">
      {content}
    </Link>
  )
}
