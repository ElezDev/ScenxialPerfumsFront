import type { Product } from '../types'

export type FragranceFamilyId =
  | 'citrico'
  | 'floral'
  | 'amaderado'
  | 'oriental'
  | 'fougere'
  | 'acuatico'
  | 'gourmand'
  | 'aromatico'

export interface FragranceFamily {
  id: FragranceFamilyId
  name: string
  tagline: string
  description: string
  notes: string[]
  occasions: string
  season: string
}

export interface QuizOption {
  id: string
  label: string
  description?: string
  scores: Partial<Record<FragranceFamilyId, number>>
  tags?: string[]
}

export interface QuizQuestion {
  id: string
  title: string
  subtitle: string
  options: QuizOption[]
}

export interface AdvisorAnswers {
  [questionId: string]: string
}

export interface FragranceProfile {
  primary: FragranceFamily
  secondary: FragranceFamily | null
  intensity: 'suave' | 'moderada' | 'intensa'
  audience: string
  tips: string[]
  keywords: string[]
}

export const FRAGRANCE_FAMILIES: Record<FragranceFamilyId, FragranceFamily> = {
  citrico: {
    id: 'citrico',
    name: 'Cítrico / Fresco',
    tagline: 'Luminoso y vital',
    description:
      'Fragancias vibrantes con bergamota, limón, naranja o pomelo. Ideales para quienes buscan frescura, energía y una presencia limpia sin pesar.',
    notes: ['Bergamota', 'Limón', 'Neroli', 'Pomelo', 'Mandarina'],
    occasions: 'Día, oficina, climas cálidos, uso diario.',
    season: 'Primavera y verano.',
  },
  floral: {
    id: 'floral',
    name: 'Floral',
    tagline: 'Elegante y expresivo',
    description:
      'El universo de las flores: rosa, jazmín, iris, peonía. Desde lo delicado y romántico hasta lo sofisticado y dramático.',
    notes: ['Rosa', 'Jazmín', 'Iris', 'Peonía', 'Azahar'],
    occasions: 'Versátiles: día, eventos, citas, uso cotidiano refinado.',
    season: 'Todo el año.',
  },
  amaderado: {
    id: 'amaderado',
    name: 'Amaderado',
    tagline: 'Profundo y sereno',
    description:
      'Cedro, sándalo, vetiver y pachulí aportan calidez, carácter y una sensación de lujo silencioso. Perfectos para personalidades seguras.',
    notes: ['Cedro', 'Sándalo', 'Vetiver', 'Pachulí', 'Oud'],
    occasions: 'Noche, reuniones, entorno profesional, ocasiones especiales.',
    season: 'Otoño e invierno.',
  },
  oriental: {
    id: 'oriental',
    name: 'Oriental / Ambarado',
    tagline: 'Sensual y envolvente',
    description:
      'Especias, ámbar, vainilla e incienso crean fragancias intensas, cálidas y memorables. Para quienes dejan huella.',
    notes: ['Ámbar', 'Vainilla', 'Especias', 'Incienso', 'Resinas'],
    occasions: 'Noche, eventos, invierno, momentos íntimos.',
    season: 'Otoño e invierno.',
  },
  fougere: {
    id: 'fougere',
    name: 'Fougère / Aromático',
    tagline: 'Clásico y equilibrado',
    description:
      'Combinación de lavanda, geranio y musgo. El perfil más equilibrado: fresco al inicio, elegante en el fondo.',
    notes: ['Lavanda', 'Geranio', 'Musgo', 'Coumarina', 'Hierbas'],
    occasions: 'Uso diario, trabajo, perfil masculino clásico o unisex.',
    season: 'Primavera y otoño.',
  },
  acuatico: {
    id: 'acuatico',
    name: 'Acuático / Marino',
    tagline: 'Limpio y etéreo',
    description:
      'Notas marinas, ozónicas y de brisa. Sensación de limpieza absoluta, como un paseo junto al mar.',
    notes: ['Notas marinas', 'Sal', 'Algas', 'Brisa', 'Ozónicas'],
    occasions: 'Día, deporte, verano, ambientes casuales.',
    season: 'Verano y climas cálidos.',
  },
  gourmand: {
    id: 'gourmand',
    name: 'Gourmand',
    tagline: 'Dulce y adictivo',
    description:
      'Vainilla, caramelo, chocolate y almendra. Fragancias cómodas y envolventes que evocan placer y calidez.',
    notes: ['Vainilla', 'Caramelo', 'Tonka', 'Almendra', 'Cacao'],
    occasions: 'Tarde, noche, citas, invierno.',
    season: 'Otoño e invierno.',
  },
  aromatico: {
    id: 'aromatico',
    name: 'Aromático / Herbal',
    tagline: 'Natural y distinguido',
    description:
      'Hierbas aromáticas, té, menta y especias suaves. Frescura con carácter, entre lo natural y lo sofisticado.',
    notes: ['Menta', 'Té', 'Romero', 'Artemisia', 'Cardamomo'],
    occasions: 'Día, oficina, perfil unisex contemporáneo.',
    season: 'Primavera y verano.',
  },
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'occasion',
    title: '¿Cuándo lo usarías más?',
    subtitle: 'Pensá en tu rutina habitual, no en una sola ocasión.',
    options: [
      {
        id: 'day',
        label: 'De día / trabajo',
        description: 'Algo discreto que te acompañe sin invadir.',
        scores: { citrico: 3, acuatico: 2, aromatico: 2, fougere: 1 },
      },
      {
        id: 'night',
        label: 'De noche / salidas',
        description: 'Presencia más marcada y memorable.',
        scores: { oriental: 3, amaderado: 2, gourmand: 2 },
      },
      {
        id: 'both',
        label: 'Ambos',
        description: 'Versátil para cualquier momento.',
        scores: { floral: 2, fougere: 2, amaderado: 1, citrico: 1 },
      },
      {
        id: 'special',
        label: 'Ocasiones especiales',
        description: 'Eventos, celebraciones, momentos únicos.',
        scores: { oriental: 2, floral: 2, amaderado: 2, gourmand: 1 },
      },
    ],
  },
  {
    id: 'feeling',
    title: '¿Qué sensación querés transmitir?',
    subtitle: 'Tu perfume habla antes que vos.',
    options: [
      {
        id: 'elegant',
        label: 'Elegancia silenciosa',
        scores: { floral: 3, amaderado: 2, fougere: 1 },
      },
      {
        id: 'fresh',
        label: 'Frescura y ligereza',
        scores: { citrico: 3, acuatico: 3, aromatico: 1 },
      },
      {
        id: 'sensual',
        label: 'Sensualidad y calidez',
        scores: { oriental: 3, gourmand: 2, amaderado: 1 },
      },
      {
        id: 'mysterious',
        label: 'Misterio y profundidad',
        scores: { amaderado: 3, oriental: 2, fougere: 1 },
      },
      {
        id: 'cozy',
        label: 'Calidez acogedora',
        scores: { gourmand: 3, oriental: 2, floral: 1 },
      },
    ],
  },
  {
    id: 'notes',
    title: '¿Qué aromas te atraen más?',
    subtitle: 'Elegí el que más resuene con vos.',
    options: [
      {
        id: 'citrus',
        label: 'Cítricos y frescos',
        description: 'Limón, bergamota, pomelo.',
        scores: { citrico: 4, acuatico: 1 },
      },
      {
        id: 'flowers',
        label: 'Flores',
        description: 'Rosa, jazmín, peonía.',
        scores: { floral: 4 },
      },
      {
        id: 'wood',
        label: 'Maderas y tierra',
        description: 'Cedro, vetiver, sándalo.',
        scores: { amaderado: 4, fougere: 1 },
      },
      {
        id: 'spice',
        label: 'Especias y dulzura',
        description: 'Vainilla, ámbar, caramelo.',
        scores: { oriental: 3, gourmand: 3 },
      },
      {
        id: 'herbs',
        label: 'Hierbas y té',
        description: 'Lavanda, menta, aromáticos.',
        scores: { aromatico: 3, fougere: 2, citrico: 1 },
      },
    ],
  },
  {
    id: 'intensity',
    title: '¿Qué intensidad preferís?',
    subtitle: 'Cuánto querés que se note tu fragancia.',
    options: [
      {
        id: 'soft',
        label: 'Suave y cercana',
        description: 'Solo quien está muy cerca lo percibe.',
        scores: { citrico: 1, acuatico: 1, floral: 1 },
        tags: ['suave'],
      },
      {
        id: 'moderate',
        label: 'Moderada',
        description: 'Presente sin dominar el espacio.',
        scores: { floral: 1, fougere: 1, aromatico: 1 },
        tags: ['moderada'],
      },
      {
        id: 'bold',
        label: 'Intensa y memorable',
        description: 'Dejás una estela que perdura.',
        scores: { oriental: 1, amaderado: 1, gourmand: 1 },
        tags: ['intensa'],
      },
    ],
  },
  {
    id: 'audience',
    title: '¿Para quién buscás la fragancia?',
    subtitle: 'Muchas fragancias actuales son unisex.',
    options: [
      {
        id: 'women',
        label: 'Mujer',
        scores: { floral: 1, gourmand: 1 },
        tags: ['mujer'],
      },
      {
        id: 'men',
        label: 'Hombre',
        scores: { fougere: 1, amaderado: 1, aromatico: 1 },
        tags: ['hombre'],
      },
      {
        id: 'unisex',
        label: 'Unisex',
        scores: { citrico: 1, acuatico: 1, amaderado: 1 },
        tags: ['unisex'],
      },
      {
        id: 'any',
        label: 'No importa',
        scores: {},
        tags: [],
      },
    ],
  },
]

export const GUIDE_SECTIONS = [
  {
    title: '¿Cómo elegir tu perfume?',
    content:
      'No existe un perfume "correcto": existe el que se alinea con tu piel, tu estilo y el momento. Empezá identificando qué sensación querés transmitir, en qué ocasión lo usarás y qué familias olfativas te resultan agradables. Probá siempre en la piel —en el muñón interno de la muñeca— y esperá al menos 20 minutos: el corazón y el fondo revelan la verdadera personalidad de la fragancia.',
  },
  {
    title: 'La pirámide olfativa',
    content:
      'Toda fragancia se despliega en tres actos. Las notas de salida son lo primero que percibís (cítricos, hierbas). Las notas de corazón definen el carácter (flores, especias). Las notas de fondo son la estela que permanece (maderas, ámbar, almizcle). Una buena elección es la que te gusta en las tres fases, no solo al primer spray.',
  },
  {
    title: 'Concentraciones',
    content:
      'Parfum / Extrait (20–40%): máxima duración e intensidad. Eau de Parfum — EDP (15–20%): el equilibrio más popular, 6–8 horas. Eau de Toilette — EDT (5–15%): más ligera, ideal para día y calor. Eau de Cologne — EDC (2–5%): frescura efímera. A mayor concentración, más duración y más inversión justificada.',
  },
  {
    title: 'Consejos de aplicación',
    content:
      'Aplicá en puntos de pulso: cuello, muñecas, detrás de las orejas. Dos o tres pulverizaciones bastan. No frotés las muñecas: eso altera las moléculas. En climas cálidos, preferí concentraciones más ligeras. Guardá tus perfumes alejados del calor y la luz directa.',
  },
]

function getTopFamilies(scores: Record<FragranceFamilyId, number>): FragranceFamilyId[] {
  return (Object.entries(scores) as [FragranceFamilyId, number][])
    .sort((a, b) => b[1] - a[1])
    .filter(([, s]) => s > 0)
    .map(([id]) => id)
}

export function buildFragranceProfile(answers: AdvisorAnswers): FragranceProfile {
  const scores = Object.fromEntries(
    Object.keys(FRAGRANCE_FAMILIES).map((k) => [k, 0]),
  ) as Record<FragranceFamilyId, number>

  let intensity: FragranceProfile['intensity'] = 'moderada'
  let audience = 'unisex'
  const keywords: string[] = []

  for (const question of QUIZ_QUESTIONS) {
    const optionId = answers[question.id]
    if (!optionId) continue
    const option = question.options.find((o) => o.id === optionId)
    if (!option) continue

    for (const [family, points] of Object.entries(option.scores)) {
      scores[family as FragranceFamilyId] += points ?? 0
    }

    if (option.tags?.includes('suave')) intensity = 'suave'
    if (option.tags?.includes('moderada')) intensity = 'moderada'
    if (option.tags?.includes('intensa')) intensity = 'intensa'
    if (option.tags?.includes('mujer')) audience = 'mujer'
    if (option.tags?.includes('hombre')) audience = 'hombre'
    if (option.tags?.includes('unisex')) audience = 'unisex'
  }

  const ranked = getTopFamilies(scores)
  const primaryId = ranked[0] ?? 'floral'
  const secondaryId = ranked[1]

  const primary = FRAGRANCE_FAMILIES[primaryId]
  const secondary = secondaryId ? FRAGRANCE_FAMILIES[secondaryId] : null

  keywords.push(primary.name, ...(secondary ? [secondary.name] : []), ...primary.notes.slice(0, 3))

  const tips = [
    `Tu perfil principal es ${primary.name.toLowerCase()}: ${primary.description.split('.')[0]}.`,
    `Ideal para ${primary.occasions.toLowerCase()}`,
    intensity === 'suave'
      ? 'Buscá Eau de Toilette o aplicaciones ligeras para mantener la discreción.'
      : intensity === 'intensa'
        ? 'Un Eau de Parfum o Extrait potenciará tu presencia y duración.'
        : 'Un Eau de Parfum ofrece el equilibrio perfecto entre presencia y elegancia.',
    secondary
      ? `También podrías explorar matices ${secondary.name.toLowerCase()} para variar según la ocasión.`
      : 'Explorá variaciones dentro de la misma familia para encontrar tu firma perfecta.',
  ]

  return { primary, secondary, intensity, audience, tips, keywords }
}

const FAMILY_KEYWORDS: Record<FragranceFamilyId, string[]> = {
  citrico: ['citric', 'cítric', 'bergamot', 'limon', 'limón', 'pomelo', 'neroli', 'mandarina', 'fresco'],
  floral: ['floral', 'rosa', 'jazmin', 'jazmín', 'peon', 'iris', 'azahar', 'flor'],
  amaderado: ['amader', 'cedro', 'sandalo', 'sándalo', 'vetiver', 'pachuli', 'pachulí', 'oud', 'madera'],
  oriental: ['oriental', 'ambar', 'ámbar', 'vainilla', 'especi', 'incienso', 'resina'],
  fougere: ['fougere', 'fougère', 'lavanda', 'geranio', 'musgo', 'aromatico'],
  acuatico: ['acuatic', 'acuátic', 'marino', 'mar', 'ozon', 'sal', 'agua'],
  gourmand: ['gourmand', 'caramelo', 'chocolate', 'tonka', 'almendra', 'dulce', 'vainilla'],
  aromatico: ['aromatic', 'aromátic', 'menta', 'te ', 'té ', 'romero', 'hierba', 'cardamomo'],
}

function productText(product: Product): string {
  const attrs = product.attributes ?? {}
  const parts = [
    product.name,
    product.description,
    product.short_description,
    product.category?.name,
    product.brand?.name,
    attrs.familia,
    attrs.fragrance_family,
    attrs.tipo,
    attrs.genero,
    attrs.gender,
    attrs.top_notes,
    attrs.notas_salida,
    attrs.heart_notes,
    attrs.notas_corazon,
    attrs.base_notes,
    attrs.notas_fondo,
  ]
  return parts.filter(Boolean).join(' ').toLowerCase()
}

export function scoreProductForProfile(product: Product, profile: FragranceProfile): number {
  const text = productText(product)
  let score = 0

  const families: FragranceFamilyId[] = [
    profile.primary.id,
    ...(profile.secondary ? [profile.secondary.id] : []),
  ]

  families.forEach((familyId, i) => {
    const weight = i === 0 ? 3 : 1
    for (const kw of FAMILY_KEYWORDS[familyId]) {
      if (text.includes(kw)) score += weight
    }
  })

  if (profile.audience === 'mujer' && (text.includes('mujer') || text.includes('femenin'))) score += 1
  if (profile.audience === 'hombre' && (text.includes('hombre') || text.includes('masculin'))) score += 1
  if (profile.audience === 'unisex' && text.includes('unisex')) score += 1

  if (product.is_featured) score += 0.5
  if (product.stock > 0) score += 0.5

  return score
}

export function rankProductsForProfile(products: Product[], profile: FragranceProfile): Product[] {
  return [...products]
    .map((p) => ({ product: p, score: scoreProductForProfile(p, profile) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.product)
}

export function advisoryWhatsAppMessage(profile: FragranceProfile): string {
  const lines = [
    'Hola! Hice la asesoría de fragancias en Scenxial Perfums y me gustaría recibir orientación personalizada.',
    '',
    `Perfil olfativo: ${profile.primary.name}`,
    profile.secondary ? `Secundario: ${profile.secondary.name}` : '',
    `Intensidad preferida: ${profile.intensity}`,
    `Para: ${profile.audience}`,
    '',
    '¿Podrían recomendarme fragancias de su colección?',
  ]
  return lines.filter(Boolean).join('\n')
}
