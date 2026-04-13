import { SpanStatusCode, trace, type Span } from '@opentelemetry/api'
import { logError, logInfo } from './logging'
import { recordError, recordMetric } from './metrics'

type SpanAttributeValue = string | number | boolean
type SpanAttributes = Record<string, SpanAttributeValue | undefined>

const tracer = trace.getTracer('fairshareapp.frontend')

const attachAttributes = (span: Span, attributes?: SpanAttributes): void => {
  if (!attributes) {
    return
  }

  for (const [key, value] of Object.entries(attributes)) {
    if (value !== undefined) {
      span.setAttribute(key, value)
    }
  }
}

export interface ActiveSpan {
  name: string
  span: Span
  startedAt: number
}

export const beginSpan = (name: string, attributes?: SpanAttributes): ActiveSpan => {
  const span = tracer.startSpan(name)
  attachAttributes(span, attributes)

  return {
    name,
    span,
    startedAt: performance.now(),
  }
}

export const endSpan = (
  activeSpan: ActiveSpan,
  options?: {
    success?: boolean
    attributes?: SpanAttributes
    error?: unknown
  },
): void => {
  const endedAt = performance.now()
  const durationMs = endedAt - activeSpan.startedAt
  const success = options?.success ?? true

  attachAttributes(activeSpan.span, options?.attributes)
  activeSpan.span.setAttribute('duration.ms', Math.round(durationMs))

  if (!success) {
    activeSpan.span.setStatus({ code: SpanStatusCode.ERROR })
    if (options?.error instanceof Error) {
      activeSpan.span.recordException(options.error)
    }
    recordError('span')
    logError('trace.error', {
      name: activeSpan.name,
      durationMs,
      error: options?.error instanceof Error ? options.error.message : String(options?.error),
    })
  } else {
    activeSpan.span.setStatus({ code: SpanStatusCode.OK })
    logInfo('trace.success', { name: activeSpan.name, durationMs })
  }

  recordMetric('trace.duration.ms', durationMs, {
    span: activeSpan.name,
    success,
  })

  activeSpan.span.end()
}

export const withSpan = async <T>(
  name: string,
  operation: () => Promise<T>,
  attributes?: SpanAttributes,
): Promise<T> => {
  const activeSpan = beginSpan(name, attributes)

  try {
    const result = await operation()
    endSpan(activeSpan, { success: true })
    return result
  } catch (error) {
    endSpan(activeSpan, { success: false, error })
    throw error
  }
}
