import axios from 'axios'
import { logError, logInfo } from '../observability/logging'
import { recordApiDuration, recordError } from '../observability/metrics'
import { beginSpan, endSpan, type ActiveSpan } from '../observability/tracing'
import { generateRequestId } from '../../utils/idempotency'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? window.location.origin

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
})

interface RequestMetadata {
  startedAt: number
  span: ActiveSpan
}

interface InternalRequestConfig {
  metadata?: RequestMetadata
}

const getEndpointFromUrl = (url?: string): string => {
  if (!url) {
    return 'unknown'
  }

  try {
    const parsed = new URL(url, apiBaseUrl)
    return parsed.pathname
  } catch {
    return url
  }
}

apiClient.interceptors.request.use((config) => {
  const method = (config.method ?? 'get').toUpperCase()
  const endpoint = getEndpointFromUrl(config.url)
  const requestId = generateRequestId()

  config.headers['X-Request-Id'] = requestId
  ;(config as typeof config & InternalRequestConfig).metadata = {
    startedAt: performance.now(),
    span: beginSpan(`api.${method}.${endpoint}`, {
      'http.method': method,
      'http.route': endpoint,
      requestId,
    }),
  }

  logInfo('api.request', {
    method,
    endpoint,
    requestId,
  })

  return config
})

apiClient.interceptors.response.use(
  (response) => {
    const config = response.config as typeof response.config & InternalRequestConfig
    const startedAt = config.metadata?.startedAt ?? performance.now()
    const method = (response.config.method ?? 'get').toUpperCase()
    const endpoint = getEndpointFromUrl(response.config.url)
    const durationMs = performance.now() - startedAt

    if (config.metadata?.span) {
      endSpan(config.metadata.span, {
        success: true,
        attributes: {
          'http.method': method,
          'http.route': endpoint,
          'http.status_code': response.status,
        },
      })
    }

    recordApiDuration(endpoint, method, durationMs, true)

    logInfo('api.response', {
      method,
      endpoint,
      status: response.status,
      durationMs,
    })

    return response
  },
  (error) => {
    const config = (error?.config ?? {}) as typeof error.config & InternalRequestConfig
    const startedAt = config.metadata?.startedAt ?? performance.now()
    const method = (config.method ?? 'get').toUpperCase()
    const endpoint = getEndpointFromUrl(config.url)
    const status = error?.response?.status ?? 500
    const durationMs = performance.now() - startedAt

    if (config.metadata?.span) {
      endSpan(config.metadata.span, {
        success: false,
        error,
        attributes: {
          'http.method': method,
          'http.route': endpoint,
          'http.status_code': status,
        },
      })
    }

    recordApiDuration(endpoint, method, durationMs, false)
    recordError('api')

    logError('api.error', {
      method,
      endpoint,
      status,
      durationMs,
      message: error?.response?.data?.message ?? error?.message ?? 'Unexpected error',
    })

    const normalized = {
      status,
      message: error?.response?.data?.message ?? 'Unexpected error',
      details: error?.response?.data,
    }
    return Promise.reject(normalized)
  },
)
