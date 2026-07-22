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
  const html = renderToHtml(<PaceReport run={run} mode={mode} />, {
    title: `${run.title} · Pace`,
  })
  const safeHtml = html.replace(
    /<a href="" target="_blank" class="v-button/g,
    '<a aria-disabled="true" tabindex="-1" class="v-button',
  )

  if (mode !== 'document') return safeHtml

  const printStyles = `
    <style>
      @media print {
        .u_row {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .u_row:has(h2) {
          break-after: avoid-page;
          page-break-after: avoid;
        }
      }
    </style>
  `

  return safeHtml
    .replace(/\s*<div style="page-break-before: always;" \/>/g, '')
    .replace('</head>', `${printStyles}</head>`)
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
