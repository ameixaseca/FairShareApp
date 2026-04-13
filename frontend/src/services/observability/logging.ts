export const logInfo = (message: string, context?: unknown): void => {
  // Placeholder logger implementation.
  if (context) {
    console.warn(message, context)
    return
  }

  console.warn(message)
}
