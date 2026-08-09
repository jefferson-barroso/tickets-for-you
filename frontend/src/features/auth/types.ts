export type UserRole = 'ORGANIZADOR' | 'CLIENTE' | 'PORTARIA'

export type LoginResponse = {
  token: string
  tokenType: 'Bearer'
  expiresIn: number
  role: UserRole
}

export type AuthUser = {
  email: string
  role: UserRole
}