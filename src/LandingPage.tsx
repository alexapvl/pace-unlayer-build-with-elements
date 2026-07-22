import pacePreview from '../docs/evidence/pace-v0/screenshot.png'
import './landing.css'

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 16 16 8M9 8h7v7" />
    </svg>
  )
}

export function LandingPage() {
  return (
    <div className="landing-shell">
      <header className="landing-header">
        <a className="landing-brand" href="/" aria-label="Pace home">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>pace</span>
        </a>

        <a
          className="contest-link"
          href="https://unlayer.com/elements"
          target="_blank"
          rel="noreferrer"
        >
          <span>Built with</span>
          <strong>Unlayer Elements</strong>
          <ExternalIcon />
        </a>
      </header>

      <main className="landing-hero">
        <section className="landing-copy">
          <p className="contest-kicker">
            <span aria-hidden="true" />
            Build with Elements challenge submission
          </p>

          <h1>Agents produce work faster than humans can confidently review.</h1>

          <p className="landing-summary">
            Pace turns one agent run into evidence-backed web, email, and PDF review surfaces. Every decision,
            risk, check, and receipt stays intact.
          </p>

          <div className="landing-actions">
            <a className="landing-button primary" href="/demo">
              Demo
              <ArrowIcon />
            </a>
            <a
              className="landing-button secondary"
              href="https://github.com/alexapvl/pace-unlayer-build-with-elements"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <ExternalIcon />
            </a>
          </div>

          <div className="landing-proof" aria-label="Pace highlights">
            <span>
              <strong>1</strong>
              source of truth
            </span>
            <span>
              <strong>3</strong>
              review surfaces
            </span>
            <span>
              <strong>30%+</strong>
              leaner with TOON
            </span>
          </div>

          <a className="creator-credit" href="https://apvl.dev" target="_blank" rel="noreferrer">
            Made by Alex
            <ExternalIcon />
          </a>
        </section>

        <section className="landing-visual" aria-label="Pace product preview">
          <div className="visual-orbit one" />
          <div className="visual-orbit two" />

          <div className="product-window">
            <div className="product-window-bar">
              <span className="window-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <a className="window-address" href="/demo">
                pace-unlayer.apvl.dev/demo
              </a>
              <span className="window-live">
                <i /> live
              </span>
            </div>
            <div className="product-crop">
              <img src={pacePreview} alt="Pace review workspace showing a real agent run" />
            </div>
          </div>

          <div className="floating-receipt receipt-status">
            <span className="receipt-label">Run status</span>
            <strong>
              <i /> Ready for review
            </strong>
          </div>

          <div className="floating-receipt receipt-output">
            <span className="receipt-label">One run</span>
            <strong>Web · Email · PDF</strong>
          </div>
        </section>
      </main>
    </div>
  )
}
