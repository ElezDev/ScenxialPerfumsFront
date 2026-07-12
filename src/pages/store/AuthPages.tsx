import { type FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { MarbleBackground } from '../../components/catalog/MarbleBackground'
import { ScenxialLogo } from '../../components/store/ScenxialLogo'
import { LuxurySectionHeader } from '../../components/store/LuxurySectionHeader'
import { toastError, toastSuccess, toastWarning } from '../../lib/alerts'
import { useAuth } from '../../context/AuthContext'

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[70vh]">
      <div className="mx-auto max-w-md px-4 py-16">{children}</div>
    </div>
  )
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)

    try {
      await login(form.get('email') as string, form.get('password') as string)
      toastSuccess('Bienvenido', 'Sesión iniciada correctamente.')
      navigate('/')
    } catch {
      toastError('Credenciales inválidas', 'Revisá tu email y contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <LuxurySectionHeader
        eyebrow="Mi cuenta"
        title="Ingresar"
        subtitle={
          <>
            ¿No tenés cuenta?{' '}
            <Link to="/registro" className="text-amber-400 transition hover:text-amber-300">
              Registrate
            </Link>
          </>
        }
      />

      <form onSubmit={handleSubmit} className="luxury-card mt-4 space-y-5 p-6">
        <div>
          <label className="luxury-label">Email</label>
          <input name="email" type="email" required className="input-field" />
        </div>
        <div>
          <label className="luxury-label">Contraseña</label>
          <input name="password" type="password" required className="input-field" />
        </div>
        <button type="submit" disabled={loading} className="btn-gold-shine w-full py-3">
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </AuthShell>
  )
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)

    const password = form.get('password') as string
    const confirmation = form.get('password_confirmation') as string

    if (password !== confirmation) {
      toastWarning('Contraseñas distintas', 'Las contraseñas no coinciden.')
      setLoading(false)
      return
    }

    try {
      await register({
        name: form.get('name') as string,
        email: form.get('email') as string,
        password,
        password_confirmation: confirmation,
        phone: (form.get('phone') as string) || undefined,
      })
      toastSuccess('Cuenta creada', 'Ya podés empezar a comprar.')
      navigate('/')
    } catch {
      toastError('Error al registrarse', 'Verificá los datos e intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <LuxurySectionHeader
        eyebrow="Nueva cuenta"
        title="Registrarse"
        subtitle={
          <>
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-amber-400 transition hover:text-amber-300">
              Ingresá
            </Link>
          </>
        }
      />

      <form onSubmit={handleSubmit} className="luxury-card mt-4 space-y-5 p-6">
        <div>
          <label className="luxury-label">Nombre</label>
          <input name="name" required className="input-field" />
        </div>
        <div>
          <label className="luxury-label">Email</label>
          <input name="email" type="email" required className="input-field" />
        </div>
        <div>
          <label className="luxury-label">Teléfono</label>
          <input name="phone" className="input-field" />
        </div>
        <div>
          <label className="luxury-label">Contraseña</label>
          <input name="password" type="password" required minLength={8} className="input-field" />
        </div>
        <div>
          <label className="luxury-label">Confirmar contraseña</label>
          <input
            name="password_confirmation"
            type="password"
            required
            minLength={8}
            className="input-field"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-gold-shine w-full py-3">
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </form>
    </AuthShell>
  )
}

export function AdminLoginPage() {
  const { login, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)

    try {
      const user = await login(form.get('email') as string, form.get('password') as string)
      if (user.roles.includes('admin')) {
        toastSuccess('Panel admin', `Bienvenido, ${user.name}.`)
        navigate('/admin')
      } else {
        toastWarning('Sin permisos', 'No tenés acceso de administrador.')
      }
    } catch {
      toastError('Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  if (isAdmin) return <Navigate to="/admin" replace />

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-luxury-black px-4">
      <MarbleBackground />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 text-center">
          <ScenxialLogo size="lg" asLink={false} />
          <p className="luxury-eyebrow mt-6">Acceso de administrador</p>
        </div>

        <form onSubmit={handleSubmit} className="luxury-card space-y-5 p-6">
          <div>
            <label className="luxury-label">Email</label>
            <input name="email" type="email" required className="input-field" />
          </div>
          <div>
            <label className="luxury-label">Contraseña</label>
            <input name="password" type="password" required className="input-field" />
          </div>
          <button type="submit" disabled={loading} className="btn-gold-shine w-full py-3">
            {loading ? 'Ingresando...' : 'Ingresar al panel'}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link
            to="/"
            className="font-body text-xs font-light uppercase tracking-widest text-champagne transition hover:text-amber-400"
          >
            Volver a la tienda
          </Link>
        </p>
      </div>
    </div>
  )
}
