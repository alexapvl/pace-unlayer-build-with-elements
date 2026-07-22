import { describe, expect, it } from 'vitest'
import { decisionRun, paceRun, stoppedRun } from '../data/fixtures'
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
    expect(renderReportHtml(paceRun, 'email')).toContain('Ready for review')
    expect(renderReportHtml(paceRun, 'document')).toContain('Baseline a029f46')
    expect(renderReportHtml(stoppedRun, 'email')).toContain('Stopped safely')
    expect(renderReportHtml(stoppedRun, 'email')).toContain('Duplicate billing transitions')
  })

  it('keeps evidence buttons but only links verified URLs', () => {
    const realEmail = renderReportHtml(paceRun, 'email')
    const decisionEmail = renderReportHtml(decisionRun, 'email')
    const stoppedEmail = renderReportHtml(stoppedRun, 'email')

    expect(realEmail).toContain('Review evidence')
    expect(realEmail).toContain('a029f46ff633d8e79b490e9b62c3269b8300835b')
    expect(decisionEmail).toContain('Review evidence')
    expect(stoppedEmail).toContain('Review evidence')
    expect(decisionEmail).not.toContain('github.com/acme')
    expect(stoppedEmail).not.toContain('github.com/acme')
    expect(decisionEmail).toContain('aria-disabled="true" tabindex="-1" class="v-button')
    expect(stoppedEmail).toContain('aria-disabled="true" tabindex="-1" class="v-button')
  })

  it.each(['email', 'page', 'document'] as const)('renders review evidence actions in %s mode', (mode) => {
    expect(renderReportHtml(paceRun, mode)).toContain('Review evidence')
    expect(renderReportHtml(decisionRun, mode)).toContain('Review evidence')
  })

  it('renders plaintext and Unlayer design JSON', () => {
    const plaintext = renderReportText(decisionRun)
    const design = renderReportJson(decisionRun)

    expect(plaintext).toContain('ADD TEAM INVITATIONS')
    expect(design).toBeTruthy()
    expect(design.body.rows.length).toBeGreaterThan(10)
  })
})
