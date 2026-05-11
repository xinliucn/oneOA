export interface AuthUser {
  name: string
  email?: string
  username?: string
  displayName?: string
  roles?: string[]
}

export interface AuthSession {
  id?: string
  loginAt?: number
  loggedInFor?: number
}

export interface AuthToken {
  valid: boolean
  verified?: boolean
  expired?: boolean
  expiresAt?: number
  expiresIn?: number
  refreshed?: boolean
  sessionRotated?: boolean
}

export interface AuthUserResponse {
  code: 0 | 1
  authenticated: boolean
  user: AuthUser | null
  session?: AuthSession
  token: AuthToken
}
