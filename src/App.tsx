import { useState } from 'react'
import { AgentContextDrawer } from './components/AgentContextDrawer'
import { ReportPreview, type PreviewDirection } from './components/ReportPreview'
import { RunQueue } from './components/RunQueue'
import { TopBar } from './components/TopBar'
import { reportModes } from './config/report-modes'
import { fixtures } from './data/fixtures'
import type { AgentRun } from './domain/agent-run'
import type { ReportMode } from './reports/PaceReport'

export function App() {
  const [activeRun, setActiveRun] = useState<AgentRun>(fixtures[0])
  const [mode, setMode] = useState<ReportMode>('page')
  const [direction, setDirection] = useState<PreviewDirection>('right')
  const [contextOpen, setContextOpen] = useState(false)

  function selectMode(nextMode: ReportMode) {
    const currentIndex = reportModes.findIndex((item) => item.value === mode)
    const nextIndex = reportModes.findIndex((item) => item.value === nextMode)

    setDirection(nextIndex >= currentIndex ? 'right' : 'left')
    setMode(nextMode)
  }

  return (
    <div className="app-shell">
      <TopBar onOpenContext={() => setContextOpen(true)} />

      <main className="workspace">
        <RunQueue runs={fixtures} selectedRunId={activeRun.id} onSelect={setActiveRun} />
        <ReportPreview run={activeRun} mode={mode} direction={direction} onModeChange={selectMode} />
      </main>

      <AgentContextDrawer
        open={contextOpen}
        run={activeRun}
        onApply={setActiveRun}
        onClose={() => setContextOpen(false)}
      />
    </div>
  )
}
