import type { AgentRun } from '../domain/agent-run'

export const decisionRun = {
  schemaVersion: 1,
  id: 'pace-1847',
  title: 'Add team invitations',
  repository: 'acme/cloud-console',
  branch: 'agent/team-invitations',
  agent: 'GPT 5.6 sol high',
  status: 'needs_decision',
  risk: 'medium',
  startedAt: '2026-07-21T09:14:00Z',
  finishedAt: '2026-07-21T10:46:00Z',
  durationMinutes: 92,
  objective:
    'Let workspace admins invite teammates by email, assign a role, and track pending invitations from workspace settings.',
  summary:
    'Invitation creation, acceptance, expiry, and role assignment are implemented. All checks pass. Product input is needed before expiry behavior can be finalized.',
  metrics: {
    filesChanged: 14,
    additions: 684,
    deletions: 93,
    testsPassed: 128,
    testsFailed: 0,
    checksPassed: 7,
    checksTotal: 7,
  },
  changes: [
    {
      area: 'Database',
      summary: 'Added invitation records with status, role, inviter, and expiry.',
      files: 'schema.ts, 0042_team_invitations.sql',
    },
    {
      area: 'API',
      summary: 'Added create, resend, revoke, and accept invitation endpoints.',
      files: 'invitations.ts, invitation-service.ts',
    },
    {
      area: 'Interface',
      summary: 'Added invitation form and pending invitation management.',
      files: 'invite-dialog.tsx, members-page.tsx',
    },
    {
      area: 'Email',
      summary: 'Added branded invitation email with secure acceptance link.',
      files: 'team-invitation.tsx',
    },
  ],
  verifications: [
    {
      name: 'Unit tests',
      status: 'passed',
      evidence: '128 passed, 0 failed',
      duration: '18.4s',
    },
    {
      name: 'TypeScript',
      status: 'passed',
      evidence: 'No type errors across 214 modules',
      duration: '5.1s',
    },
    {
      name: 'Production build',
      status: 'passed',
      evidence: 'App and worker bundles compiled',
      duration: '31.8s',
    },
    {
      name: 'Browser flow',
      status: 'passed',
      evidence: 'Invite, accept, revoke, and expired-link paths exercised',
      duration: '42.0s',
    },
  ],
  risks: [
    {
      level: 'medium',
      title: 'Authentication surface changed',
      detail: 'Invitation acceptance adds a new unauthenticated token flow.',
      mitigation: 'Tokens are hashed, single-use, rate-limited, and covered by expiry tests.',
    },
    {
      level: 'low',
      title: 'Database migration required',
      detail: 'Deployment adds one table and two indexes.',
      mitigation: 'Migration is additive and tested against a production-sized snapshot.',
    },
  ],
  decisions: [
    {
      id: 'invitation-expiry',
      question: 'How long should invitations remain valid?',
      context:
        'Short expiry improves security. Longer expiry reduces resends for teams with slower onboarding.',
      options: ['24 hours', '7 days', '30 days'],
      recommendation: '7 days',
    },
  ],
  timeline: [
    {
      time: '09:14',
      event: 'Scope inspected',
      detail: 'Mapped existing auth, member roles, email, and migration patterns.',
      result: 'done',
    },
    {
      time: '09:31',
      event: 'Data layer complete',
      detail: 'Created additive migration and invitation service.',
      result: 'done',
    },
    {
      time: '10:03',
      event: 'Product flow complete',
      detail: 'Implemented invite, accept, resend, revoke, and expiry states.',
      result: 'done',
    },
    {
      time: '10:31',
      event: 'Verification complete',
      detail: 'All automated and browser checks passed.',
      result: 'done',
    },
    {
      time: '10:46',
      event: 'Human input requested',
      detail: 'Expiry duration changes product behavior and needs owner judgment.',
      result: 'attention',
    },
  ],
  artifacts: [
    {
      type: 'pull_request',
      label: 'PR #184',
      url: 'https://github.com/acme/cloud-console/pull/184',
      detail: 'Team invitation implementation',
    },
    {
      type: 'migration',
      label: 'Migration 0042',
      url: 'https://github.com/acme/cloud-console/blob/agent/team-invitations/db/0042_team_invitations.sql',
      detail: 'Additive invitation schema',
    },
    {
      type: 'screenshot',
      label: 'Browser evidence',
      url: 'https://example.com/evidence/team-invitations',
      detail: 'Four tested interface states',
    },
  ],
} satisfies AgentRun

export const readyRun = {
  schemaVersion: 1,
  id: 'pace-1839',
  title: 'Ship optimistic task updates',
  repository: 'acme/workspace',
  branch: 'agent/optimistic-tasks',
  agent: 'GPT 5.6 sol high',
  status: 'ready',
  risk: 'low',
  startedAt: '2026-07-21T07:48:00Z',
  finishedAt: '2026-07-21T08:37:00Z',
  durationMinutes: 49,
  objective:
    'Make task completion feel instant while preserving server authority and clear rollback behavior.',
  summary:
    'Task completion now updates immediately, reconciles with the server, and rolls back with inline recovery when a request fails.',
  metrics: {
    filesChanged: 8,
    additions: 312,
    deletions: 117,
    testsPassed: 94,
    testsFailed: 0,
    checksPassed: 6,
    checksTotal: 6,
  },
  changes: [
    {
      area: 'State',
      summary: 'Added optimistic mutation and deterministic rollback.',
      files: 'use-task-mutation.ts, task-store.ts',
    },
    {
      area: 'Interface',
      summary: 'Added pending state and inline retry after rollback.',
      files: 'task-row.tsx, task-error.tsx',
    },
    {
      area: 'Telemetry',
      summary: 'Recorded reconciliation latency and rollback rate.',
      files: 'task-events.ts',
    },
  ],
  verifications: [
    {
      name: 'Unit tests',
      status: 'passed',
      evidence: '94 passed, 0 failed',
      duration: '12.7s',
    },
    {
      name: 'TypeScript',
      status: 'passed',
      evidence: 'No type errors across 167 modules',
      duration: '4.3s',
    },
    {
      name: 'Network failure',
      status: 'passed',
      evidence: 'Rollback and retry exercised at 3G latency',
      duration: '26.0s',
    },
    {
      name: 'Production build',
      status: 'passed',
      evidence: 'Client bundle increased by 0.4 kB',
      duration: '24.1s',
    },
  ],
  risks: [
    {
      level: 'low',
      title: 'Brief client-server divergence',
      detail: 'The local interface leads the server by one request.',
      mitigation: 'Server result always wins and failed mutations visibly roll back.',
    },
  ],
  decisions: [],
  timeline: [
    {
      time: '07:48',
      event: 'Behavior reproduced',
      detail: 'Measured 620 ms median delay before task completion appeared.',
      result: 'done',
    },
    {
      time: '08:02',
      event: 'Optimistic path added',
      detail: 'Local state now updates before network completion.',
      result: 'done',
    },
    {
      time: '08:19',
      event: 'Failure path hardened',
      detail: 'Rollback, retry, and duplicate request handling complete.',
      result: 'done',
    },
    {
      time: '08:37',
      event: 'Ready for review',
      detail: 'Checks passed and pull request opened.',
      result: 'done',
    },
  ],
  artifacts: [
    {
      type: 'pull_request',
      label: 'PR #181',
      url: 'https://github.com/acme/workspace/pull/181',
      detail: 'Optimistic task completion',
    },
    {
      type: 'screenshot',
      label: 'Before and after',
      url: 'https://example.com/evidence/optimistic-tasks',
      detail: 'Normal, slow, and failed network states',
    },
    {
      type: 'log',
      label: 'Performance trace',
      url: 'https://example.com/evidence/optimistic-trace',
      detail: 'Interaction latency reduced from 620 ms to 34 ms',
    },
  ],
} satisfies AgentRun

export const stoppedRun = {
  schemaVersion: 1,
  id: 'pace-1826',
  title: 'Migrate billing webhooks',
  repository: 'acme/billing-service',
  branch: 'agent/webhook-v2',
  agent: 'Claude Fable 5',
  status: 'failed_safely',
  risk: 'high',
  startedAt: '2026-07-20T22:10:00Z',
  finishedAt: '2026-07-20T22:44:00Z',
  durationMinutes: 34,
  objective:
    'Move subscription processing to webhook schema v2 without dropping or duplicating billing events.',
  summary:
    'Migration stopped before implementation. Production samples contain undocumented event ordering that can double-apply subscription changes.',
  metrics: {
    filesChanged: 2,
    additions: 146,
    deletions: 0,
    testsPassed: 41,
    testsFailed: 3,
    checksPassed: 3,
    checksTotal: 6,
  },
  changes: [
    {
      area: 'Analysis',
      summary: 'Added replay harness for sanitized production webhook sequences.',
      files: 'replay-webhooks.ts, webhook-v2.fixture.json',
    },
    {
      area: 'Safety',
      summary: 'Added failing characterization tests for duplicate transitions.',
      files: 'webhook-ordering.test.ts',
    },
  ],
  verifications: [
    {
      name: 'Existing tests',
      status: 'passed',
      evidence: '41 passed before migration changes',
      duration: '9.6s',
    },
    {
      name: 'Production replay',
      status: 'failed',
      evidence: '3 of 18 sequences produced duplicate transitions',
      duration: '14.2s',
    },
    {
      name: 'Idempotency check',
      status: 'failed',
      evidence: 'Invoice and subscription events share no stable operation key',
      duration: '3.8s',
    },
    {
      name: 'Implementation',
      status: 'skipped',
      evidence: 'Stopped before production code changed',
      duration: '0.0s',
    },
  ],
  risks: [
    {
      level: 'high',
      title: 'Duplicate billing transitions',
      detail: 'Out-of-order events can apply one subscription change twice.',
      mitigation: 'Define canonical operation keys before migration resumes.',
    },
    {
      level: 'high',
      title: 'Insufficient rollback evidence',
      detail: 'Current logs cannot prove which events were applied by each handler.',
      mitigation: 'Add handler version and event ledger fields before rollout.',
    },
  ],
  decisions: [
    {
      id: 'billing-idempotency',
      question: 'Which event should own subscription state transitions?',
      context: 'Both invoice and subscription events currently mutate the same state.',
      options: ['Subscription events', 'Invoice events', 'Reconciliation worker'],
      recommendation: 'Reconciliation worker',
    },
  ],
  timeline: [
    {
      time: '22:10',
      event: 'Migration inspected',
      detail: 'Mapped old and new schemas plus current handlers.',
      result: 'done',
    },
    {
      time: '22:21',
      event: 'Replay harness created',
      detail: 'Loaded 18 sanitized production sequences.',
      result: 'done',
    },
    {
      time: '22:33',
      event: 'Ordering defect found',
      detail: 'Three sequences applied duplicate transitions.',
      result: 'attention',
    },
    {
      time: '22:44',
      event: 'Work stopped safely',
      detail: 'No migration or production handler changes were applied.',
      result: 'stopped',
    },
  ],
  artifacts: [
    {
      type: 'commit',
      label: 'Analysis commit',
      url: 'https://github.com/acme/billing-service/commit/case1826',
      detail: 'Replay harness and characterization tests only',
    },
    {
      type: 'log',
      label: 'Replay evidence',
      url: 'https://example.com/evidence/webhook-replay',
      detail: 'Redacted event ordering failures',
    },
    {
      type: 'log',
      label: 'Risk note',
      url: 'https://example.com/evidence/webhook-risk',
      detail: 'Required invariants before resuming work',
    },
  ],
} satisfies AgentRun

export const fixtures = [decisionRun, readyRun, stoppedRun] as const
