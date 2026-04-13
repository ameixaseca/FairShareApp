export const withSpan = async <T>(name: string, operation: () => Promise<T>): Promise<T> => {
  const start = performance.now()

  try {
    const result = await operation()
    console.warn('trace.success', { name, durationMs: performance.now() - start })
    return result
  } catch (error) {
    console.error('trace.error', { name, durationMs: performance.now() - start, error })
    throw error
  }
}
