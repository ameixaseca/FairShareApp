import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { router } from './router'
import { logInfo } from './services/observability/logging'
import { recordComponentRender, recordRouteTransition } from './services/observability/metrics'
import { initializeTelemetry } from './services/observability/telemetry'

const queryClient = new QueryClient()

initializeTelemetry()

function App(): React.JSX.Element {
  const mountedAtRef = useRef(performance.now())

  useEffect(() => {
    const renderDurationMs = performance.now() - mountedAtRef.current
    recordComponentRender('App', renderDurationMs)

    let transitionStartedAt: number | null = null
    let currentPath = `${router.state.location.pathname}${router.state.location.search}`

    const unsubscribe = router.subscribe((state) => {
      const nextPath = `${state.location.pathname}${state.location.search}`
      const navigationState = state.navigation.state

      if (navigationState !== 'idle') {
        transitionStartedAt ??= performance.now()
        return
      }

      if (nextPath === currentPath) {
        transitionStartedAt = null
        return
      }

      const endedAt = performance.now()
      const durationMs = transitionStartedAt === null ? 0 : endedAt - transitionStartedAt

      if (durationMs > 0) {
        recordRouteTransition(nextPath, durationMs)
        logInfo('route.transition', {
          from: currentPath,
          to: nextPath,
          durationMs,
        })
      }

      transitionStartedAt = null
      currentPath = nextPath
    })

    return unsubscribe
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
