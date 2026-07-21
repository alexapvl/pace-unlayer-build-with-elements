import { renderToHtml, renderToJson, renderToPlainText } from '@unlayer/react-elements'
import type { AgentRun } from '../domain/agent-run'
import {
  PaceDocument,
  PaceEmail,
  PacePage,
  PaceReport,
  type ReportMode,
} from './PaceReport'

export function renderReportHtml(run: AgentRun, mode: ReportMode) {
  return renderToHtml(<PaceReport run={run} mode={mode} />, {
    title: `${run.title} · Pace`,
  })
}

export function renderReportText(run: AgentRun, mode: ReportMode = 'email') {
  return renderToPlainText(<PaceReport run={run} mode={mode} />)
}

export function renderReportJson(run: AgentRun, mode: ReportMode = 'email') {
  const report =
    mode === 'email'
      ? PaceEmail({ run })
      : mode === 'document'
        ? PaceDocument({ run })
        : PacePage({ run })

  return renderToJson(report)
}
