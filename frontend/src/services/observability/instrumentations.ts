import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web'
import { registerInstrumentations as registerOtelInstrumentations } from '@opentelemetry/instrumentation'

let isRegistered = false

export const registerInstrumentations = (): void => {
  if (isRegistered) {
    return
  }

  registerOtelInstrumentations({
    instrumentations: getWebAutoInstrumentations({
      '@opentelemetry/instrumentation-fetch': {
        clearTimingResources: true,
        propagateTraceHeaderCorsUrls: [/.*/],
      },
      '@opentelemetry/instrumentation-xml-http-request': {
        propagateTraceHeaderCorsUrls: [/.*/],
      },
    }),
  })

  isRegistered = true
}
