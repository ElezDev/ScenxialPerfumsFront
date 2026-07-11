import axios from 'axios'
import type {
  AuthResponse,
  Banner,
  Brand,
  Category,
  CreateOrderPayload,
  CreateOrderResponse,
  DashboardStats,
  Order,
  PaginatedResponse,
  Product,
  Promo,
  User,
} from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  },
)

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  register: (data: {
    name: string
    email: string
    password: string
    password_confirmation: string
    phone?: string
  }) => api.post<AuthResponse>('/auth/register', data),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<{ user: User }>('/auth/me'),
}

export const catalogApi = {
  categories: (params?: { active_only?: boolean }) =>
    api.get<{ data: Category[] }>('/categories', { params }),

  category: (id: number) => api.get<{ data: Category }>(`/categories/${id}`),

  brands: (params?: { active_only?: boolean }) =>
    api.get<{ data: Brand[] }>('/brands', { params }),

  products: (params?: {
    category?: string
    brand?: string
    search?: string
    featured?: boolean
    sort?: string
    page?: number
    per_page?: number
    active_only?: boolean
  }) => api.get<PaginatedResponse<Product>>('/products', { params }),

  product: (id: number) => api.get<{ data: Product }>(`/products/${id}`),

  productBySlug: (slug: string) => api.get<{ data: Product }>(`/products/slug/${slug}`),

  banners: (params?: { active_only?: boolean }) =>
    api.get<{ data: Banner[] }>('/banners', { params }),

  promos: (params?: { active_only?: boolean }) =>
    api.get<{ data: Promo[] }>('/promos', { params }),
}

export const orderApi = {
  create: (data: CreateOrderPayload) => api.post<CreateOrderResponse>('/orders', data),

  list: (params?: { status?: string; page?: number }) =>
    api.get<PaginatedResponse<Order>>('/orders', { params }),

  get: (id: number) => api.get<{ data: Order }>(`/orders/${id}`),

  paymentStatus: (orderId: number) =>
    api.get<{
      order_number: string
      payment_status: string
      status: string
      mercadopago_payment_id: string | null
    }>(`/payments/status/${orderId}`),
}

export const adminApi = {
  dashboard: () => api.get<DashboardStats>('/admin/dashboard'),

  categories: () => api.get<{ data: Category[] }>('/categories'),

  createCategory: (data: Partial<Category>) =>
    api.post<{ message: string; data: Category }>('/admin/categories', data),

  updateCategory: (id: number, data: Partial<Category>) =>
    api.put<{ message: string; data: Category }>(`/admin/categories/${id}`, data),

  deleteCategory: (id: number) => api.delete(`/admin/categories/${id}`),

  brands: () => api.get<{ data: Brand[] }>('/brands'),

  createBrand: (data: Partial<Brand>) =>
    api.post<{ message: string; data: Brand }>('/admin/brands', data),

  updateBrand: (id: number, data: Partial<Brand>) =>
    api.put<{ message: string; data: Brand }>(`/admin/brands/${id}`, data),

  deleteBrand: (id: number) => api.delete(`/admin/brands/${id}`),

  products: (params?: {
    page?: number
    per_page?: number
    active_only?: boolean
    search?: string
    category?: string
    brand?: string
  }) =>
    api.get<PaginatedResponse<Product>>('/products', { params: { ...params, active_only: false } }),

  createProduct: (data: Record<string, unknown>) =>
    api.post<{ message: string; data: Product }>('/admin/products', data),

  updateProduct: (id: number, data: Record<string, unknown>) =>
    api.put<{ message: string; data: Product }>(`/admin/products/${id}`, data),

  deleteProduct: (id: number) => api.delete(`/admin/products/${id}`),

  orders: (params?: { status?: string; page?: number; per_page?: number; search?: string }) =>
    api.get<PaginatedResponse<Order>>('/orders', { params }),

  updateOrderStatus: (
    id: number,
    data: { status: string; payment_status?: string },
  ) => api.patch<{ message: string; data: Order }>(`/admin/orders/${id}/status`, data),

  users: (params?: { page?: number; per_page?: number; search?: string }) =>
    api.get<PaginatedResponse<User>>('/admin/users', { params }),

  createUser: (data: Record<string, unknown>) =>
    api.post<{ message: string; data: User }>('/admin/users', data),

  updateUser: (id: number, data: Record<string, unknown>) =>
    api.put<{ message: string; data: User }>(`/admin/users/${id}`, data),

  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),

  banners: () => api.get<{ data: Banner[] }>('/banners'),

  createBanner: (data: Partial<Banner>) =>
    api.post<{ message: string; data: Banner }>('/admin/banners', data),

  updateBanner: (id: number, data: Partial<Banner>) =>
    api.put<{ message: string; data: Banner }>(`/admin/banners/${id}`, data),

  deleteBanner: (id: number) => api.delete(`/admin/banners/${id}`),

  promos: () => api.get<{ data: Promo[] }>('/promos'),

  createPromo: (data: Partial<Promo>) =>
    api.post<{ message: string; data: Promo }>('/admin/promos', data),

  updatePromo: (id: number, data: Partial<Promo>) =>
    api.put<{ message: string; data: Promo }>(`/admin/promos/${id}`, data),

  deletePromo: (id: number) => api.delete(`/admin/promos/${id}`),

  upload: (file: File, folder?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (folder) formData.append('folder', folder)
    return api.post<{ message: string; url: string; path: string }>('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export default api
