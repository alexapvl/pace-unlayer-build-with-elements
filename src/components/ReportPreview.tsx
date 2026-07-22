import { useMemo, useRef } from 'react'
import { reportModes } from '../config/report-modes'
import { statusCopy, type AgentRun } from '../domain/agent-run'
import { runStatusTone } from '../lib/status-tone'
import type { ReportMode } from '../reports/PaceReport'
import { renderReportHtml } from '../reports/render'
import { DownloadIcon } from './icons'

export type PreviewDirection = 'left' | 'right'

interface ReportPreviewProps {
  run: AgentRun
  mode: ReportMode
  direction: PreviewDirection
  onModeChange: (mode: ReportMode) => void
}

export function ReportPreview({ run, mode, direction, onModeChange }: ReportPreviewProps) {
  const previewFrame = useRef<HTMLIFrameElement>(null)
  const reportHtml = useMemo(() => renderReportHtml(run, mode), [run, mode])
  const activeMode = reportModes.find((item) => item.value === mode) ?? reportModes[0]

  function resizePreview(event: React.SyntheticEvent<HTMLIFrameElement>) {
    const frame = event.currentTarget
    const previewDocument = frame.contentDocument

    if (!previewDocument) return

    previewDocument.documentElement.style.overflow = 'hidden'
    previewDocument.body.style.overflow = 'hidden'

    const documentHeight = Math.max(
      previewDocument.documentElement.scrollHeight,
      previewDocument.body.scrollHeight,
    )

    if (documentHeight) frame.style.height = `${Math.ceil(documentHeight) + 1}px`
  }

  function savePdf() {
    const printWindow = previewFrame.current?.contentWindow

    if (!printWindow) return

    printWindow.focus()
    printWindow.print()
  }

  return (
    <section className="preview-panel" aria-label="Report preview">
      <div className="preview-toolbar">
        <div className="mode-switcher" role="tablist" aria-label="Output format">
          {reportModes.map((item) => (
            <button
              type="button"
              role="tab"
              aria-selected={mode === item.value}
              className={mode === item.value ? 'active' : ''}
              key={item.value}
              onClick={() => onModeChange(item.value)}
            >
              <span>{item.label}</span>
              <small>{item.hint}</small>
            </button>
          ))}
        </div>

        <div className="preview-actions">
          <div className="preview-meta">
            <span className={`status-pill ${runStatusTone[run.status]}`}>{statusCopy[run.status].label}</span>
            <span className="mode-dimensions">{activeMode.hint}</span>
          </div>
          <button
            className={`pdf-button ${mode === 'document' ? 'visible' : ''}`}
            type="button"
            onClick={savePdf}
            aria-hidden={mode !== 'document'}
            tabIndex={mode === 'document' ? 0 : -1}
          >
            <DownloadIcon />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      <div className={`preview-canvas mode-${mode}`}>
        <div className={`preview-frame enter-${direction}`} key={`${run.id}-${mode}`}>
          <iframe
            ref={previewFrame}
            title={`${run.title} ${activeMode.label} preview`}
            srcDoc={reportHtml}
            sandbox="allow-modals allow-popups allow-same-origin"
            scrolling="no"
            onLoad={resizePreview}
          />
        </div>
      </div>
    </section>
  )
}
