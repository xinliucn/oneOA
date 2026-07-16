export type AuthRoleLevel = 'superadmin' | 'admin' | 'user' | 'viewer'
export type AuthRolePriority = 1 | 2 | 3 | 4

export interface AuthUser {
  name?: string
  email?: string
  username?: string
  displayName?: string
  roles?: string[]
  role_level?: AuthRoleLevel
  role_priority?: AuthRolePriority
  permissions?: string[]
  is_admin?: boolean
}

export interface AuthUserResponse {
  authenticated?: boolean
  user?: AuthUser | null
}

export interface AuthLoginResponse {
  authorization_url: string
}

export interface AuthLogoutResponse {
  code: number
  logout_url?: string
  message: string
}

export interface AuthHttpError {
  status?: number
  statusCode?: number
}
