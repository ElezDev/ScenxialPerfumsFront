import { MessageCircle } from 'lucide-react'
import { formatPrice } from '../lib/utils'
import { whatsappProductQuoteUrl } from '../lib/whatsapp'
import type { Product } from '../types'

interface QuoteButtonProps {
  product: Product
  quantity?: number
  className?: string
  fullWidth?: boolean
}

export function QuoteButton({
  product,
  quantity = 1,
  className = '',
  fullWidth = false,
}: QuoteButtonProps) {
  return (
    <a
      href={whatsappProductQuoteUrl(product, quantity, formatPrice)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-whatsapp-gold ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
      Cotizar por WhatsApp
    </a>
  )
}
