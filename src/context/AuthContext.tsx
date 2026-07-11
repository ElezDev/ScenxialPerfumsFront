import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authApi } from '../lib/api'
import { toastInfo } from '../lib/alerts'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<User>
  register: (data: {
    name: string
    email: string
    password: string
    password_confirmation: string
    phone?: string
  }) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function persistAuth(token: string, user: User) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

function clearAuth() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? (JSON.parse(stored) as User) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    authApi
      .me()
      .then(({ data }) => {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      })
      .catch(() => {
        clearAuth()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await authApi.login(email, password)
    persistAuth(data.access_token, data.user)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(
    async (formData: {
      name: string
      email: string
      password: string
      password_confirmation: string
      phone?: string
    }) => {
      const { data } = await authApi.register(formData)
      persistAuth(data.access_token, data.user)
      setUser(data.user)
      return data.user
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore logout errors
    } finally {
      clearAuth()
      setUser(null)
      toastInfo('Sesión cerrada')
    }
  }, [])

  const isAdmin = useMemo(() => user?.roles.includes('admin') ?? false, [user])

  const value = useMemo(
    () => ({ user, loading, isAdmin, login, register, logout }),
    [user, loading, isAdmin, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
