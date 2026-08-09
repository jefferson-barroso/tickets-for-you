import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from './AuthContext'
import type { UserRole } from './types'

type RequireRoleProps = {
  allowedRoles: UserRole[]
  children: ReactNode
}

export function RequireRole({
  allowedRoles,
  children,
}: RequireRoleProps) {
  const { token, user } = useAuth()
  const location = useLocation()

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}