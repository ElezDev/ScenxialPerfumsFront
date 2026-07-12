const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5491100000001'
const WHATSAPP_MESSAGE =
  import.meta.env.VITE_WHATSAPP_MESSAGE ||
  'Hola! Quiero consultar por productos en Scenxial Perfums.'

export function whatsappUrl(message = WHATSAPP_MESSAGE): string {
  const params = new URLSearchParams({ text: message })
  return `https://wa.me/${WHATSAPP_NUMBER}?${params.toString()}`
}

interface ProductQuote {
  name: string
  sku: string
  price: number
  slug?: string
}

export function whatsappProductQuoteUrl(
  product: ProductQuote,
  quantity = 1,
  formatPrice: (n: number) => string,
): string {
  const lines = [
    'Hola! Quiero cotizar el siguiente producto:',
    '',
    `Producto: ${product.name}`,
    `SKU: ${product.sku}`,
    `Precio: ${formatPrice(product.price)}`,
    `Cantidad: ${quantity}`,
  ]

  if (product.slug) {
    const base = window.location.origin
    lines.push('', `Link: ${base}/producto/${product.slug}`)
  }

  return whatsappUrl(lines.join('\n'))
}
