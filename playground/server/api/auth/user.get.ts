import type {
  AuthHttpError,
  AuthUserResponse,
} from '../../../types/auth'
import { proxyRequest } from '../../utils/requestProxy'

const getErrorStatusCode = (error: unknown) => {
  const authError = error as AuthHttpError | null | undefined
  const statusCode = authError?.statusCode ?? authError?.status

  return typeof statusCode === 'number' ? statusCode : undefined
}

export default defineEventHandler(async (event) => {
  try {
    return await proxyRequest<AuthUserResponse>(event, '/api/r/weaver/auth/user', {
      method: 'GET',
      errorMessage: '获取用户信息失败',
    })
  }
  catch (error: unknown) {
    console.error('Get user API error:', error)

    if (getErrorStatusCode(error) === 401) {
      throw createError({
        statusCode: 401,
        message: '未登录',
      })
    }

    throw error
  }
})
