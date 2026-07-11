const PARTICLES = [
  { top: '8%', left: '12%', size: 2, delay: 0 },
  { top: '15%', left: '78%', size: 1.5, delay: 1.2 },
  { top: '28%', left: '45%', size: 1, delay: 2.4 },
  { top: '42%', left: '88%', size: 2.5, delay: 0.8 },
  { top: '55%', left: '22%', size: 1.5, delay: 3.1 },
  { top: '63%', left: '65%', size: 1, delay: 1.8 },
  { top: '72%', left: '8%', size: 2, delay: 2.6 },
  { top: '80%', left: '52%', size: 1.5, delay: 0.4 },
  { top: '88%', left: '92%', size: 1, delay: 3.5 },
  { top: '35%', left: '5%', size: 1, delay: 1.5 },
  { top: '18%', left: '35%', size: 1.5, delay: 2.9 },
  { top: '48%', left: '72%', size: 2, delay: 0.6 },
]

export function MarbleBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="marble-texture absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="gold-particle absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
