import { describe, expect, it } from 'vitest'
import { formatDate, formatTime } from '../../src/utils/date'

describe('date utils', () => {
  it('formats date and time from ISO strings', () => {
    const iso = '2030-01-01T15:30:00Z'

    expect(formatDate(iso)).toContain('2030')
    expect(formatTime(iso)).toMatch(/\d{2}:\d{2}/)
  })
})
