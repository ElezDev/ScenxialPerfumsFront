import type { ReactNode } from 'react'

interface StorePageShellProps {
  children: ReactNode
  className?: string
  narrow?: boolean
}

export function StorePageShell({ children, className = '', narrow }: StorePageShellProps) {
  return (
    <div
      className={`mx-auto px-4 pb-24 pt-10 ${narrow ? 'max-w-3xl' : 'max-w-7xl'} ${className}`}
    >
      {children}
    </div>
  )
}
