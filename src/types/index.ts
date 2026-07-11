export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  is_active: boolean
  roles: string[]
  permissions: string[]
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  image: string | null
  is_active: boolean
  sort_order: number
  products_count?: number
}

export interface Brand {
  id: number
  name: string
  slug: string
  logo: string | null
  is_active: boolean
}

export interface Banner {
  id: number
  title: string
  subtitle: string | null
  image: string | null
  link_url: string | null
  link_text: string | null
  is_active: boolean
  sort_order: number
  starts_at: string | null
  ends_at: string | null
  created_at?: string
}

export type DiscountType = 'percentage' | 'fixed'

export interface Promo {
  id: number
  title: string
  description: string | null
  code: string | null
  discount_type: DiscountType
  discount_value: number
  image: string | null
  is_active: boolean
  starts_at: string | null
  ends_at: string | null
  min_purchase: number | null
  usage_limit: number | null
  used_count: number
  created_at?: string
}

export interface ProductImage {
  id: number
  path: string
  url: string
  is_primary: boolean
  sort_order: number
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  short_description: string | null
  sku: string
  price: number
  compare_price: number | null
  stock: number
  is_active: boolean
  is_featured: boolean
  attributes: Record<string, unknown> | null
  category?: Category
  brand?: Brand | null
  images?: ProductImage[]
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderItem {
  id: number
  product_id: number
  product_name: string
  product_sku: string
  quantity: number
  unit_price: number
  total_price: number
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Order {
  id: number
  order_number: string
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method: string
  subtotal: number
  shipping_cost: number
  total: number
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address: string
  shipping_city: string | null
  shipping_state: string | null
  shipping_postal_code: string | null
  notes: string | null
  items?: OrderItem[]
  user?: User
  created_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    from: number | null
    last_page: number
    per_page: number
    to: number | null
    total: number
  }
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}

export interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface DashboardStats {
  stats: {
    total_sales: number
    total_orders: number
    pending_orders: number
    total_products: number
    total_customers: number
  }
  recent_orders: Order[]
}

export interface CreateOrderPayload {
  items: { product_id: number; quantity: number }[]
  customer_name: string
  customer_email: string
  customer_phone?: string
  shipping_address: string
  shipping_city?: string
  shipping_state?: string
  shipping_postal_code?: string
  shipping_cost?: number
  notes?: string
}

export interface CreateOrderResponse {
  message: string
  data: Order
  payment: {
    preference_id: string
    init_point: string
    sandbox_init_point?: string
  }
}
