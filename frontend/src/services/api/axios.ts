import axios from 'axios'
import { generateRequestId } from '../../utils/idempotency'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? window.location.origin

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  config.headers['X-Request-Id'] = generateRequestId()
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = {
      status: error?.response?.status ?? 500,
      message: error?.response?.data?.message ?? 'Unexpected error',
      details: error?.response?.data,
    }
    return Promise.reject(normalized)
  },
)
