import { describe, expect, it } from 'vitest'
import { fixtures } from '../data/fixtures'
import { decodeRun, encodeRunToJson, encodeRunToToon, getSourceStats } from './toon'

describe('Pace agent context', () => {
  it.each(fixtures)('round-trips $id through TOON', (run) => {
    const encoded = encodeRunToToon(run)
    const decoded = decodeRun(encoded, 'toon')

    expect(decoded).toEqual(run)
  })

  it.each(fixtures)('round-trips $id through JSON', (run) => {
    const encoded = encodeRunToJson(run)
    const decoded = decodeRun(encoded, 'json')

    expect(decoded).toEqual(run)
  })

  it('reduces repeated review data for the decision fixture', () => {
    const stats = getSourceStats(fixtures[0])

    expect(stats.toonCharacters).toBeLessThan(stats.jsonCharacters)
    expect(stats.savedPercent).toBeGreaterThan(10)
  })
})
