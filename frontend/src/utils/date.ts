export const formatDate = (isoDate: string): string =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(isoDate))

export const formatTime = (isoDate: string): string =>
  new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' }).format(new Date(isoDate))
