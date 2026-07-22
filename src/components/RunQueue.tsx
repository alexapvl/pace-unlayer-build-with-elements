import { statusCopy, type AgentRun } from '../domain/agent-run'
import { runStatusTone } from '../lib/status-tone'
import { ArrowIcon } from './icons'

interface RunQueueProps {
  runs: readonly AgentRun[]
  selectedRunId: string
  onSelect: (run: AgentRun) => void
}

export function RunQueue({ runs, selectedRunId, onSelect }: RunQueueProps) {
  return (
    <aside className="run-rail">
      <div className="rail-heading">
        <div>
          <p className="eyebrow">Review queue</p>
          <h1>Three runs need you.</h1>
        </div>
        <span className="queue-count">{String(runs.length).padStart(2, '0')}</span>
      </div>

      <div className="run-list" role="list" aria-label="Agent runs">
        {runs.map((run, index) => {
          const isSelected = selectedRunId === run.id

          return (
            <button
              className={`run-card ${isSelected ? 'selected' : ''}`}
              type="button"
              key={run.id}
              onClick={() => onSelect(run)}
              aria-pressed={isSelected}
            >
              <span className="run-index">{String(index + 1).padStart(2, '0')}</span>
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
  )
}
