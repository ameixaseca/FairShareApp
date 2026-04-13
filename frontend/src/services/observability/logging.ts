import pino from 'pino'

type LogContextValue = string | number | boolean | null | undefined
type LogContext = Record<string, LogContextValue>

const logger = pino({
  level: import.meta.env.DEV ? 'debug' : 'info',
  name: 'fairshare-frontend',
  browser: {
    asObject: true,
  },
  base: undefined,
})

const runtimeContext: LogContext = {}

const sanitizeContext = (context?: unknown): LogContext => {
  if (!context || typeof context !== 'object' || Array.isArray(context)) {
    return {}
  }

  return Object.entries(context as Record<string, unknown>).reduce<LogContext>(
    (acc, [key, value]) => {
      if (value === undefined || value === null) {
        acc[key] = value as null | undefined
        return acc
      }

      if (['string', 'number', 'boolean'].includes(typeof value)) {
        acc[key] = value as LogContextValue
        return acc
      }

      acc[key] = JSON.stringify(value)
      return acc
    },
    {},
  )
}

const mergeContext = (context?: unknown): LogContext => ({
  ...runtimeContext,
  ...sanitizeContext(context),
})

export const setLogContext = (context: Record<string, unknown>): void => {
  Object.assign(runtimeContext, sanitizeContext(context))
}

export const clearLogContext = (): void => {
  for (const key of Object.keys(runtimeContext)) {
    delete runtimeContext[key]
  }
}

export const logDebug = (message: string, context?: unknown): void => {
  logger.debug(mergeContext(context), message)
}

export const logInfo = (message: string, context?: unknown): void => {
  logger.info(mergeContext(context), message)
}

export const logWarn = (message: string, context?: unknown): void => {
  logger.warn(mergeContext(context), message)
}

export const logError = (message: string, context?: unknown): void => {
  logger.error(mergeContext(context), message)
}
