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

export const paceRun = {
  schemaVersion: 1,
  id: 'pace-a029f46',
  title: 'Build Pace v0',
  repository: 'alexapvl/pace-unlayer-build-with-elements',
  branch: 'main',
  agent: 'Codex · GPT-5',
  status: 'ready',
  risk: 'medium',
  startedAt: '2026-07-21T00:23:55Z',
  finishedAt: '2026-07-21T10:17:09Z',
  durationMinutes: 594,
  objective:
    'Turn structured agent runs into evidence-backed web, email, and PDF reports that humans can review with confidence.',
  summary:
    'Pace v0 is implemented and verified. One structured run now produces three review surfaces, compact TOON context, and portable evidence artifacts.',
  metrics: {
    filesChanged: 19,
    additions: 4506,
    deletions: 0,
    testsPassed: 12,
    testsFailed: 0,
    checksPassed: 6,
    checksTotal: 6,
  },
  changes: [
    {
      area: 'Review workspace',
      summary: 'Built a three-state review queue with isolated report scrolling and responsive output previews.',
      files: 'src/App.tsx, src/styles.css',
    },
    {
      area: 'Report system',
      summary: 'Created reusable Unlayer Elements reports for web, email, document, plain text, and design JSON.',
      files: 'src/reports/PaceReport.tsx, src/reports/render.tsx',
    },
    {
      area: 'Agent context',
      summary: 'Added a validated AgentRun schema with lossless TOON and JSON editing and round-trip support.',
      files: 'src/domain/agent-run.ts, src/lib/toon.ts, src/data/fixtures.ts',
    },
    {
      area: 'Evidence export',
      summary: 'Added deterministic artifact generation, PDF rendering, and automated verification.',
      files: 'scripts/render.tsx, scripts/render-pdf.mjs, src/**/*.test.tsx',
    },
  ],
  verifications: [
    {
      name: 'Unit tests',
      status: 'passed',
      evidence: '12 passed across 2 test files, 0 failed',
      duration: '256ms',
    },
    {
      name: 'TypeScript',
      status: 'passed',
      evidence: 'tsc --noEmit completed without errors',
      duration: '540ms',
    },
    {
      name: 'Production build',
      status: 'passed',
      evidence: 'Vite transformed 27 modules and emitted production assets',
      duration: '137ms',
    },
    {
      name: 'Browser review flow',
      status: 'passed',
      evidence: 'Three run states and Web, Email, PDF views exercised in Chrome',
      duration: 'manual',
    },
    {
      name: 'TOON round-trip',
      status: 'passed',
      evidence: 'All fixtures encode and decode without data loss',
      duration: 'included',
    },
    {
      name: 'PDF handoff',
      status: 'passed',
      evidence: 'Document preview invokes native Save as PDF flow',
      duration: 'manual',
    },
  ],
  risks: [
    {
      level: 'medium',
      title: 'Agent ingestion remains manual',
      detail: 'Pace v0 consumes structured run data but does not connect directly to an agent harness.',
      mitigation: 'A strict schema plus editable TOON and JSON keeps integration boundaries explicit and testable.',
    },
    {
      level: 'low',
      title: 'PDF saving depends on browser print support',
      detail: 'Interactive PDF saving hands the document to the native print dialog.',
      mitigation: 'The repository also includes a deterministic headless Chrome PDF export command.',
    },
  ],
  decisions: [],
  timeline: [
    {
      time: '03:23',
      event: 'Review model established',
      detail: 'Defined run states, evidence structure, and reviewer-focused information hierarchy.',
      result: 'done',
    },
    {
      time: '03:27',
      event: 'Elements reports implemented',
      detail: 'Shared content began rendering as web, email, document, text, and design JSON.',
      result: 'done',
    },
    {
      time: '03:32',
      event: 'Evidence exports completed',
      detail: 'Added TOON, HTML, design JSON, plain text, and PDF artifact generation.',
      result: 'done',
    },
    {
      time: '11:32',
      event: 'Review surfaces polished',
      detail: 'Improved document hierarchy, PDF handoff, navigation order, and scroll behavior.',
      result: 'done',
    },
    {
      time: '13:17',
      event: 'Ready for review',
      detail: 'Verification passed and immutable baseline commit was published.',
      result: 'done',
    },
  ],
  artifacts: [
    {
      type: 'commit',
      label: 'Baseline a029f46',
      url: 'https://github.com/alexapvl/pace-unlayer-build-with-elements/commit/a029f46ff633d8e79b490e9b62c3269b8300835b',
      detail: '19 files and 4,506 additions implementing Pace v0',
    },
    {
      type: 'screenshot',
      label: 'Browser evidence',
      url: 'https://github.com/alexapvl/pace-unlayer-build-with-elements/blob/main/docs/evidence/pace-v0/screenshot.png',
      detail: 'Real Pace run rendered in the review workspace',
    },
    {
      type: 'log',
      label: 'Generated review pack',
      url: 'https://github.com/alexapvl/pace-unlayer-build-with-elements/tree/main/docs/evidence/pace-v0',
      detail: 'PDF, TOON source, and Unlayer design JSON',
    },
    {
      type: 'log',
      label: 'Continuous verification',
      url: 'https://github.com/alexapvl/pace-unlayer-build-with-elements/actions/workflows/verify.yml',
      detail: 'TypeScript, tests, and production build on every push',
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

export const fixtures = [paceRun, decisionRun, stoppedRun] as const
