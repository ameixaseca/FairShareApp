import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import {
  AlwaysOnSampler,
  BatchSpanProcessor,
  ParentBasedSampler,
  TraceIdRatioBasedSampler,
  WebTracerProvider,
} from '@opentelemetry/sdk-trace-web'
import { logInfo, logWarn } from './logging'
import { registerInstrumentations } from './instrumentations'

let initialized = false

const parseSampleRate = (value?: string): number => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return import.meta.env.DEV ? 1 : 0.1
  }

  return Math.max(0, Math.min(1, parsed))
}

export const initializeTelemetry = (): void => {
  if (initialized) {
    return
  }

  const enabled = (import.meta.env.VITE_OTEL_ENABLED ?? 'false') === 'true'
  if (!enabled) {
    initialized = true
    return
  }

  const sampleRate = parseSampleRate(import.meta.env.VITE_OTEL_SAMPLE_RATE)
  const exporterUrl = import.meta.env.VITE_OTEL_JAEGER_ENDPOINT

  const sampler = import.meta.env.DEV
    ? new AlwaysOnSampler()
    : new ParentBasedSampler({
        root: new TraceIdRatioBasedSampler(sampleRate),
      })

  const spanProcessors = exporterUrl
    ? [new BatchSpanProcessor(new OTLPTraceExporter({ url: exporterUrl }))]
    : undefined

  const provider = new WebTracerProvider({
    sampler,
    spanProcessors,
  })

  if (!exporterUrl) {
    logWarn('telemetry.exporter.missing', {
      message: 'VITE_OTEL_JAEGER_ENDPOINT not configured; spans stay local only.',
    })
  }

  provider.register()
  registerInstrumentations()

  logInfo('telemetry.initialized', {
    sampleRate,
    environment: import.meta.env.MODE,
    exporterUrl: exporterUrl ?? null,
  })

  initialized = true
}
