import { describe, expect, it } from 'vitest'
import { decisionRun, readyRun, stoppedRun } from '../data/fixtures'
import { renderReportHtml, renderReportJson, renderReportText } from './render'

describe('Pace reports', () => {
  it.each(['email', 'page', 'document'] as const)('renders %s HTML', (mode) => {
    const html = renderReportHtml(decisionRun, mode)

    expect(html.toLowerCase()).toContain('<!doctype')
    expect(html).toContain('Add team invitations')
    expect(html).toContain('How long should invitations remain valid?')
    expect(html).toContain('Agents produce work faster than humans can confidently review.')
  })

  it('renders state-specific report content', () => {
    expect(renderReportHtml(readyRun, 'email')).toContain('Ready for review')
    expect(renderReportHtml(stoppedRun, 'email')).toContain('Stopped safely')
    expect(renderReportHtml(stoppedRun, 'email')).toContain('Duplicate billing transitions')
  })

  it('renders plaintext and Unlayer design JSON', () => {
    const plaintext = renderReportText(decisionRun)
    const design = renderReportJson(decisionRun)

    expect(plaintext).toContain('ADD TEAM INVITATIONS')
    expect(design).toBeTruthy()
    expect(design.body.rows.length).toBeGreaterThan(10)
  })
})
