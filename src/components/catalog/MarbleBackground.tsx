const BLOBS = [
  { className: 'left-[-10%] top-[5%] h-[45vmax] w-[45vmax] bg-violet-950/20', delay: '0s' },
  { className: 'right-[-15%] top-[20%] h-[40vmax] w-[40vmax] bg-amber-900/10', delay: '2s' },
  { className: 'bottom-[-10%] left-[20%] h-[50vmax] w-[50vmax] bg-stone-900/30', delay: '4s' },
]

const PARTICLES = [
  { top: '10%', left: '15%', size: 2, delay: 0 },
  { top: '22%', left: '82%', size: 1.5, delay: 1.4 },
  { top: '45%', left: '8%', size: 1, delay: 2.8 },
  { top: '60%', left: '70%', size: 2, delay: 0.6 },
  { top: '78%', left: '40%', size: 1.5, delay: 3.2 },
  { top: '88%', left: '90%', size: 1, delay: 1.9 },
]

export function MarbleBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="obsidian-canvas absolute inset-0" />

      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className={`organic-blob absolute rounded-full blur-3xl ${blob.className}`}
          style={{ animationDelay: blob.delay }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/80 via-transparent to-obsidian" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,162,39,0.04),transparent_50%)]" />

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
