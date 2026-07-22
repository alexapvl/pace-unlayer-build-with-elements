import { DataIcon } from './icons'
import { PaceMark } from './PaceMark'

export function TopBar({ onOpenContext }: { onOpenContext: () => void }) {
  return (
    <header className="topbar">
      <a className="brand-lockup" href="/" aria-label="Pace home">
        <PaceMark />
        <span className="brand-name">pace</span>
        <span className="brand-tagline">agent work, ready for review</span>
      </a>

      <button className="context-button" type="button" onClick={onOpenContext}>
        <DataIcon />
        <span>Agent context</span>
        <kbd>.toon</kbd>
      </button>
    </header>
  )
}
