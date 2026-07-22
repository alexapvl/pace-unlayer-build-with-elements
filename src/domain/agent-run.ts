export type RunStatus = 'ready' | 'needs_decision' | 'failed_safely'
export type RiskLevel = 'low' | 'medium' | 'high'
export type CheckStatus = 'passed' | 'failed' | 'skipped'

export interface AgentRun {
  schemaVersion: 1
  id: string
  title: string
  repository: string
  branch: string
  agent: string
  status: RunStatus
  risk: RiskLevel
  startedAt: string
  finishedAt: string
  durationMinutes: number
  objective: string
  summary: string
  metrics: {
    filesChanged: number
    additions: number
    deletions: number
    testsPassed: number
    testsFailed: number
    checksPassed: number
    checksTotal: number
  }
  changes: Array<{
    area: string
    summary: string
    files: string
  }>
  verifications: Array<{
    name: string
    status: CheckStatus
    evidence: string
    duration: string
  }>
  risks: Array<{
    level: RiskLevel
    title: string
    detail: string
    mitigation: string
  }>
  decisions: Array<{
    id: string
    question: string
    context: string
    options: string[]
    recommendation: string
  }>
  timeline: Array<{
    time: string
    event: string
    detail: string
    result: 'done' | 'attention' | 'stopped'
  }>
  artifacts: Array<{
    type: 'pull_request' | 'commit' | 'screenshot' | 'log' | 'migration'
    label: string
    url?: string
    detail: string
  }>
}

const statuses = new Set<RunStatus>(['ready', 'needs_decision', 'failed_safely'])
const riskLevels = new Set<RiskLevel>(['low', 'medium', 'high'])

export function assertAgentRun(value: unknown): asserts value is AgentRun {
  if (!value || typeof value !== 'object') {
    throw new Error('Run must be an object.')
  }

  const run = value as Partial<AgentRun>
  if (run.schemaVersion !== 1) throw new Error('Unsupported schemaVersion.')
  if (typeof run.id !== 'string' || !run.id) throw new Error('Run id is required.')
  if (typeof run.title !== 'string' || !run.title) throw new Error('Run title is required.')
  if (!run.status || !statuses.has(run.status)) throw new Error('Run status is invalid.')
  if (!run.risk || !riskLevels.has(run.risk)) throw new Error('Run risk is invalid.')

  const requiredArrays: Array<keyof AgentRun> = [
    'changes',
    'verifications',
    'risks',
    'decisions',
    'timeline',
    'artifacts',
  ]

  for (const key of requiredArrays) {
    if (!Array.isArray(run[key])) throw new Error(`${key} must be an array.`)
  }

  if (!run.metrics || typeof run.metrics !== 'object') {
    throw new Error('Run metrics are required.')
  }
}

export const statusCopy: Record<RunStatus, { label: string; sentence: string }> = {
  ready: {
    label: 'Ready for review',
    sentence: 'Implementation complete. Evidence collected. Human review can begin.',
  },
  needs_decision: {
    label: 'Decision needed',
    sentence: 'Work is safe and verified. One product decision blocks completion.',
  },
  failed_safely: {
    label: 'Stopped safely',
    sentence: 'Agent found unacceptable risk and stopped before changing production behavior.',
  },
}
