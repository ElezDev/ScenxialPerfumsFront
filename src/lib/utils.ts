export function formatPrice(amount: number): string {
  const currency = import.meta.env.VITE_CURRENCY || 'COP'
  const locale = currency === 'COP' ? 'es-CO' : 'es-AR'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'COP' ? 0 : 2,
  }).format(amount)
}

export function apiBaseUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  return apiUrl.replace(/\/api\/?$/, '')
}

export function assetUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${apiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`
}

export function imagePathToUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/storage/')) return assetUrl(path)
  const clean = path.replace(/^public\//, '')
  return assetUrl(`/storage/${clean}`)
}

export function getProductImage(product: { images?: { url: string; is_primary: boolean }[] }): string | null {
  if (!product.images?.length) return null
  const primary = product.images.find((img) => img.is_primary)
  const image = primary ?? product.images[0]
  return imagePathToUrl(image.url)
}

export function getProductImages(product: { images?: { url: string; is_primary: boolean; sort_order: number }[] }): string[] {
  if (!product.images?.length) return []
  return [...product.images]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => imagePathToUrl(img.url))
    .filter((url): url is string => Boolean(url))
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'En proceso',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
    paid: 'Pagado',
    failed: 'Fallido',
    refunded: 'Reembolsado',
  }
  return labels[status] ?? status
}
