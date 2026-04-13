type MetricLabelValue = string | number | boolean
type MetricLabels = Record<string, MetricLabelValue>

interface HistogramState {
  count: number
  sum: number
  min: number
  max: number
}

const counters = new Map<string, number>()
const histograms = new Map<string, HistogramState>()

const toMetricKey = (name: string, labels?: MetricLabels): string => {
  if (!labels || Object.keys(labels).length === 0) {
    return name
  }

  const serialized = Object.entries(labels)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${String(value)}`)
    .join(',')

  return `${name}{${serialized}}`
}

export const incrementCounter = (name: string, increment = 1, labels?: MetricLabels): void => {
  if (!Number.isFinite(increment)) {
    return
  }

  const key = toMetricKey(name, labels)
  const current = counters.get(key) ?? 0
  counters.set(key, current + increment)
}

export const recordMetric = (name: string, value: number, labels?: MetricLabels): void => {
  if (!Number.isFinite(value)) {
    return
  }

  const key = toMetricKey(name, labels)
  const current = histograms.get(key)

  if (!current) {
    histograms.set(key, {
      count: 1,
      sum: value,
      min: value,
      max: value,
    })
    return
  }

  current.count += 1
  current.sum += value
  current.min = Math.min(current.min, value)
  current.max = Math.max(current.max, value)
}

export const recordApiDuration = (
  route: string,
  method: string,
  durationMs: number,
  success: boolean,
): void => {
  recordMetric('api.duration.ms', durationMs, { route, method, success })
  incrementCounter('api.calls.total', 1, { route, method, success })
}

export const recordRouteTransition = (route: string, durationMs: number): void => {
  recordMetric('route.transition.ms', durationMs, { route })
}

export const recordComponentRender = (component: string, durationMs: number): void => {
  recordMetric('component.render.ms', durationMs, { component })
}

export const recordError = (scope: string): void => {
  incrementCounter('errors.total', 1, { scope })
}

export const getMetricsSnapshot = (): {
  counters: Record<string, number>
  histograms: Record<string, HistogramState>
} => ({
  counters: Object.fromEntries(counters),
  histograms: Object.fromEntries(histograms),
})
