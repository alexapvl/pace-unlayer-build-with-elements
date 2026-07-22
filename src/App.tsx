import { useEffect, useMemo, useRef, useState } from 'react'
import { fixtures } from './data/fixtures'
import { statusCopy, type AgentRun } from './domain/agent-run'
import { decodeRun, encodeRun, getSourceStats, type SourceFormat } from './lib/toon'
import { renderReportHtml } from './reports/render'
import type { ReportMode } from './reports/PaceReport'

const modes: Array<{ value: ReportMode; label: string; hint: string }> = [
  { value: 'page', label: 'Web', hint: '840px evidence' },
  { value: 'email', label: 'Email', hint: '640px inbox' },
  { value: 'document', label: 'PDF', hint: 'print document' },
]

const runStatusTone = {
  ready: 'ready',
  needs_decision: 'decision',
  failed_safely: 'stopped',
} as const

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  )
}

function DataIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5 3 12l5 7M16 5l5 7-5 7M14 3l-4 18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 20h14" />
    </svg>
  )
}

export function App() {
  const [selectedRunId, setSelectedRunId] = useState(fixtures[0].id)
  const [activeRun, setActiveRun] = useState<AgentRun>(fixtures[0])
  const [mode, setMode] = useState<ReportMode>('page')
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [contextOpen, setContextOpen] = useState(false)
  const [sourceFormat, setSourceFormat] = useState<SourceFormat>('toon')
  const [source, setSource] = useState(() => encodeRun(fixtures[0], 'toon'))
  const [sourceBaseline, setSourceBaseline] = useState(() => encodeRun(fixtures[0], 'toon'))
  const [sourceError, setSourceError] = useState('')
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')
  const copyTimer = useRef<number | undefined>(undefined)
  const previewFrame = useRef<HTMLIFrameElement>(null)

  const reportHtml = useMemo(() => renderReportHtml(activeRun, mode), [activeRun, mode])
  const sourceStats = useMemo(() => getSourceStats(activeRun), [activeRun])
  const activeMode = modes.find((item) => item.value === mode) ?? modes[0]
  const hasSourceChanges = source !== sourceBaseline

  useEffect(() => {
    return () => window.clearTimeout(copyTimer.current)
  }, [])

  function selectRun(run: AgentRun) {
    const nextSource = encodeRun(run, sourceFormat)
    setSelectedRunId(run.id)
    setActiveRun(run)
    setSource(nextSource)
    setSourceBaseline(nextSource)
    setSourceError('')
  }

  function selectMode(nextMode: ReportMode) {
    const currentIndex = modes.findIndex((item) => item.value === mode)
    const nextIndex = modes.findIndex((item) => item.value === nextMode)
    setDirection(nextIndex >= currentIndex ? 'right' : 'left')
    setMode(nextMode)
  }

  function changeSourceFormat(format: SourceFormat) {
    const nextSource = encodeRun(activeRun, format)
    setSourceFormat(format)
    setSource(nextSource)
    setSourceBaseline(nextSource)
    setSourceError('')
  }

  function applySource() {
    try {
      const run = decodeRun(source, sourceFormat)
      const normalizedSource = encodeRun(run, sourceFormat)
      setActiveRun(run)
      setSelectedRunId(run.id)
      setSource(normalizedSource)
      setSourceBaseline(normalizedSource)
      setSourceError('')
      setContextOpen(false)
    } catch (error) {
      setSourceError(error instanceof Error ? error.message : 'Could not parse run data.')
    }
  }

  async function copySource() {
    await navigator.clipboard.writeText(source)
    setCopyState('copied')
    window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopyState('idle'), 1400)
  }

  function openContext() {
    const nextSource = encodeRun(activeRun, sourceFormat)
    setSource(nextSource)
    setSourceBaseline(nextSource)
    setSourceError('')
    setContextOpen(true)
  }

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
    <div className="app-shell">
      <header className="topbar">
        <a className="brand-lockup" href="/" aria-label="Pace home">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-name">pace</span>
          <span className="brand-tagline">agent work, ready for review</span>
        </a>

        <button className="context-button" type="button" onClick={openContext}>
          <DataIcon />
          <span>Agent context</span>
          <kbd>.toon</kbd>
        </button>
      </header>

      <main className="workspace">
        <aside className="run-rail">
          <div className="rail-heading">
            <div>
              <p className="eyebrow">Review queue</p>
              <h1>Three runs need you.</h1>
            </div>
            <span className="queue-count">03</span>
          </div>

          <div className="run-list" role="list" aria-label="Agent runs">
            {fixtures.map((run, index) => {
              const isSelected = selectedRunId === run.id
              return (
                <button
                  className={`run-card ${isSelected ? 'selected' : ''}`}
                  type="button"
                  key={run.id}
                  onClick={() => selectRun(run)}
                  aria-pressed={isSelected}
                >
                  <span className="run-index">0{index + 1}</span>
                  <span className="run-copy">
                    <span className="run-title">{run.title}</span>
                    <span className="run-meta">
                      <i className={`status-dot ${runStatusTone[run.status]}`} />
                      {statusCopy[run.status].label} · {run.durationMinutes}m
                    </span>
                  </span>
                  <span className="run-arrow">
                    <ArrowIcon />
                  </span>
                </button>
              )
            })}
          </div>

          <div className="rail-note">
            <span className="note-rule" />
            <p>Agents produce work faster than humans can confidently review.</p>
            <span className="note-caption">Pace closes review gap with evidence, not summaries.</span>
          </div>
        </aside>

        <section className="preview-panel" aria-label="Report preview">
          <div className="preview-toolbar">
            <div className="mode-switcher" role="tablist" aria-label="Output format">
              {modes.map((item) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === item.value}
                  className={mode === item.value ? 'active' : ''}
                  key={item.value}
                  onClick={() => selectMode(item.value)}
                >
                  <span>{item.label}</span>
                  <small>{item.hint}</small>
                </button>
              ))}
            </div>

            <div className="preview-actions">
              <div className="preview-meta">
                <span className={`status-pill ${runStatusTone[activeRun.status]}`}>
                  {statusCopy[activeRun.status].label}
                </span>
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
            <div className={`preview-frame enter-${direction}`} key={`${activeRun.id}-${mode}`}>
              <iframe
                ref={previewFrame}
                title={`${activeRun.title} ${activeMode.label} preview`}
                srcDoc={reportHtml}
                sandbox="allow-modals allow-popups allow-same-origin"
                scrolling="no"
                onLoad={resizePreview}
              />
            </div>
          </div>
        </section>
      </main>

      <div
        className={`drawer-layer ${contextOpen ? 'open' : ''}`}
        aria-hidden={!contextOpen}
        inert={!contextOpen}
      >
        <button
          className="drawer-scrim"
          type="button"
          aria-label="Close agent context"
          tabIndex={contextOpen ? 0 : -1}
          onClick={() => setContextOpen(false)}
        />
        <section className="context-drawer" role="dialog" aria-modal="true" aria-labelledby="context-title">
          <header className="drawer-header">
            <div>
              <p className="eyebrow">Lossless context pack</p>
              <h2 id="context-title">Agent context</h2>
            </div>
            <button className="icon-button" type="button" onClick={() => setContextOpen(false)} aria-label="Close">
              <CloseIcon />
            </button>
          </header>

          <div className="drawer-body">
            <div className="format-row">
              <div className="format-switcher" role="tablist" aria-label="Context format">
                <button
                  type="button"
                  role="tab"
                  aria-selected={sourceFormat === 'toon'}
                  className={sourceFormat === 'toon' ? 'active' : ''}
                  onClick={() => changeSourceFormat('toon')}
                >
                  TOON
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={sourceFormat === 'json'}
                  className={sourceFormat === 'json' ? 'active' : ''}
                  onClick={() => changeSourceFormat('json')}
                >
                  JSON
                </button>
              </div>
              <div className="format-stat">
                {sourceFormat === 'toon' ? (
                  <>
                    <strong>{sourceStats.savedPercent}%</strong>
                    <span>fewer characters</span>
                  </>
                ) : (
                  <>
                    <strong>{sourceStats.jsonCharacters.toLocaleString()}</strong>
                    <span>characters</span>
                  </>
                )}
              </div>
            </div>

            <div className="source-shell">
              <div className="source-toolbar">
                <div className="source-file">
                  <span>{sourceFormat === 'toon' ? 'run.toon · tab-delimited' : 'run.json'}</span>
                  <span className="editable-label">Editable</span>
                </div>
                <button type="button" onClick={copySource}>
                  <CopyIcon />
                  <span className="copy-label" aria-live="polite">
                    {copyState === 'copied' ? 'Copied' : 'Copy'}
                  </span>
                </button>
              </div>
              <textarea
                id="agent-context-source"
                name="agent-context-source"
                value={source}
                onChange={(event) => {
                  setSource(event.target.value)
                  setSourceError('')
                }}
                spellCheck={false}
                aria-label={`${sourceFormat.toUpperCase()} agent run source`}
              />
            </div>

            <div className={`source-message ${sourceError ? 'error' : ''}`} aria-live="polite">
              {sourceError ? (
                sourceError
              ) : (
                <>
                  Editable context. Change it, then apply to re-render Web, Email, and PDF. JSON stays canonical
                  inside Pace.
                </>
              )}
            </div>
          </div>

          <footer className="drawer-footer">
            <div className="size-comparison">
              <span>TOON {sourceStats.toonCharacters.toLocaleString()}</span>
              <span className="comparison-line">
                <i style={{ width: `${100 - sourceStats.savedPercent}%` }} />
              </span>
              <span>JSON {sourceStats.jsonCharacters.toLocaleString()}</span>
            </div>
            <button className="apply-button" type="button" onClick={applySource} disabled={!hasSourceChanges}>
              Apply changes
              <ArrowIcon />
            </button>
          </footer>
        </section>
      </div>
    </div>
  )
}
