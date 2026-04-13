import type { AuthUser, LoginRequest, RegisterRequest } from '../../types/auth'
import { apiClient } from './axios'

export const register = async (payload: RegisterRequest): Promise<AuthUser> => {
  const { data } = await apiClient.post<AuthUser>('/auth/register', payload)
  return data
}

export const login = async (payload: LoginRequest): Promise<AuthUser> => {
  const { data } = await apiClient.post<AuthUser>('/auth/login', payload)
  return data
}

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout')
}

export const me = async (): Promise<AuthUser> => {
  const { data } = await apiClient.get<AuthUser>('/auth/me')
  return data
}
