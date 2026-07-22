import type { ReactNode } from 'react'
import { statusCopy, type AgentRun } from '../domain/agent-run'

function InboxIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  )
}

export function EmailInboxPreview({ run, children }: { run: AgentRun; children: ReactNode }) {
  const subject = `${statusCopy[run.status].label}: ${run.title}`

  return (
    <section className="email-inbox-preview" aria-label={`Inbox preview for ${run.title}`}>
      <header className="email-message-header">
        <div className="email-subject-row">
          <h2>{subject}</h2>
          <span className="email-inbox-label">Inbox</span>
        </div>

        <span className="email-header-tools" aria-hidden="true">
          <span className="email-tool-icon">
            <InboxIcon>
              <path d="M7 9V4h10v5M7 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <path d="M7 14h10v6H7z" />
            </InboxIcon>
          </span>
          <span className="email-tool-icon">
            <InboxIcon>
              <path d="M14 4h6v6M20 4l-8 8" />
              <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
            </InboxIcon>
          </span>
        </span>
      </header>

      <div className="email-sender-row">
        <span className="email-sender-avatar" aria-hidden="true">P</span>
        <div className="email-sender-identity">
          <p>
            <strong>Pace</strong>
            <span>&lt;pace-unlayer@apvl.dev&gt;</span>
          </p>
          <span className="email-recipient">to you</span>
        </div>
        <span className="email-sent-time">just now</span>
        <span className="email-sender-tools" aria-hidden="true">
          <span className="email-tool-icon">
            <InboxIcon>
              <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
            </InboxIcon>
          </span>
          <span className="email-tool-icon">
            <InboxIcon>
              <path d="m10 8-6 5 6 5v-3c5 0 8 1 10 4-1-6-4-9-10-9z" />
            </InboxIcon>
          </span>
          <span className="email-tool-icon">
            <InboxIcon>
              <circle cx="5" cy="12" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
            </InboxIcon>
          </span>
        </span>
      </div>

      <div className="email-message-body">{children}</div>
    </section>
  )
}
