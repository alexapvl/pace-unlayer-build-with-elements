import { useEffect, useMemo, useRef, useState } from 'react'
import type { AgentRun } from '../domain/agent-run'
import { decodeRun, encodeRun, getSourceStats, type SourceFormat } from '../lib/toon'
import { ArrowIcon, CloseIcon, CopyIcon, EditIcon } from './icons'

interface AgentContextDrawerProps {
  open: boolean
  run: AgentRun
  onApply: (run: AgentRun) => void
  onClose: () => void
}

export function AgentContextDrawer({ open, run, onApply, onClose }: AgentContextDrawerProps) {
  const [sourceFormat, setSourceFormat] = useState<SourceFormat>('toon')
  const [source, setSource] = useState(() => encodeRun(run, 'toon'))
  const [sourceBaseline, setSourceBaseline] = useState(() => encodeRun(run, 'toon'))
  const [sourceError, setSourceError] = useState('')
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')
  const copyTimer = useRef<number | undefined>(undefined)
  const sourceStats = useMemo(() => getSourceStats(run), [run])
  const hasSourceChanges = source !== sourceBaseline

  useEffect(() => {
    if (!open) return

    const nextSource = encodeRun(run, sourceFormat)
    setSource(nextSource)
    setSourceBaseline(nextSource)
    setSourceError('')
  }, [open, run, sourceFormat])

  useEffect(() => {
    return () => window.clearTimeout(copyTimer.current)
  }, [])

  function changeSourceFormat(format: SourceFormat) {
    setSourceFormat(format)
  }

  function applySource() {
    try {
      const nextRun = decodeRun(source, sourceFormat)
      const normalizedSource = encodeRun(nextRun, sourceFormat)

      setSource(normalizedSource)
      setSourceBaseline(normalizedSource)
      setSourceError('')
      onApply(nextRun)
      onClose()
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

  return (
    <div className={`drawer-layer ${open ? 'open' : ''}`} aria-hidden={!open} inert={!open}>
      <button
        className="drawer-scrim"
        type="button"
        aria-label="Close agent context"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <section className="context-drawer" role="dialog" aria-modal="true" aria-labelledby="context-title">
        <header className="drawer-header">
          <div>
            <p className="eyebrow">Lossless context pack</p>
            <h2 id="context-title">Agent context</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </header>

        <div className="drawer-body">
          <div className="format-row">
            <div className="format-switcher" role="tablist" aria-label="Context format">
              {(['toon', 'json'] as const).map((format) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={sourceFormat === format}
                  className={sourceFormat === format ? 'active' : ''}
                  onClick={() => changeSourceFormat(format)}
                  key={format}
                >
                  {format.toUpperCase()}
                </button>
              ))}
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

          <div className="editability-note">
            <span className="editability-icon">
              <EditIcon />
            </span>
            <span>
              <strong>This context is editable</strong>
              <small>Change TOON or JSON, then apply to re-render Web, Email, and PDF.</small>
            </span>
          </div>

          <div className="source-shell">
            <div className="source-toolbar">
              <span>{sourceFormat === 'toon' ? 'run.toon · tab-delimited' : 'run.json'}</span>
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

          {sourceError ? (
            <div className="source-message error" aria-live="polite">
              {sourceError}
            </div>
          ) : null}
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
  )
}
