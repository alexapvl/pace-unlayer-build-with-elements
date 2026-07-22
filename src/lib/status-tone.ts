import type { RunStatus } from '../domain/agent-run'

export const runStatusTone: Record<RunStatus, 'ready' | 'decision' | 'stopped'> = {
  ready: 'ready',
  needs_decision: 'decision',
  failed_safely: 'stopped',
}
