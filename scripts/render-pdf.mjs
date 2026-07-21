import { access, readdir } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { join, resolve } from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const artifactDirectory = resolve(process.cwd(), 'artifacts')
const chromeCandidates = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Helium.app/Contents/MacOS/Helium',
]

async function findChrome() {
  for (const candidate of chromeCandidates) {
    try {
      await access(candidate)
      return candidate
    } catch {
      // Try next known browser path.
    }
  }

  throw new Error('Chrome, Chromium, or Helium is required for PDF export.')
}

const chrome = await findChrome()
const runDirectories = await readdir(artifactDirectory, { withFileTypes: true })

for (const entry of runDirectories) {
  if (!entry.isDirectory()) continue

  const runDirectory = join(artifactDirectory, entry.name)
  const input = join(runDirectory, 'document.html')
  const output = join(runDirectory, 'report.pdf')

  await execFileAsync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--print-to-pdf-no-header',
    `--print-to-pdf=${output}`,
    `file://${input}`,
  ])
}

console.log(`Rendered Pace PDFs to ${artifactDirectory}`)
