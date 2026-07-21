import { describe, expect, it } from 'vitest'
import { decisionRun } from '../data/fixtures'
import { renderReportHtml } from './render'

describe('Pace document printing', () => {
  it('keeps rows intact without adding a trailing print page', () => {
    const html = renderReportHtml(decisionRun, 'document')

    expect(html).toContain('break-inside: avoid')
    expect(html).not.toContain('page-break-before: always')
  })
})
