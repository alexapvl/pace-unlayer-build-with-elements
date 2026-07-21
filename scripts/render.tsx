import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fixtures } from '../src/data/fixtures'
import { encodeRunToJson, encodeRunToToon } from '../src/lib/toon'
import { renderReportHtml, renderReportJson, renderReportText } from '../src/reports/render'
import type { ReportMode } from '../src/reports/PaceReport'

const outputDirectory = join(process.cwd(), 'artifacts')
const modes: ReportMode[] = ['email', 'page', 'document']

await mkdir(outputDirectory, { recursive: true })

for (const run of fixtures) {
  const runDirectory = join(outputDirectory, run.id)
  await mkdir(runDirectory, { recursive: true })

  await Promise.all([
    writeFile(join(runDirectory, 'run.json'), encodeRunToJson(run)),
    writeFile(join(runDirectory, 'run.toon'), encodeRunToToon(run)),
    writeFile(join(runDirectory, 'report.txt'), renderReportText(run)),
    writeFile(
      join(runDirectory, 'design.json'),
      JSON.stringify(renderReportJson(run), null, 2),
    ),
    ...modes.map((mode) =>
      writeFile(join(runDirectory, `${mode}.html`), renderReportHtml(run, mode)),
    ),
  ])
}

console.log(`Rendered ${fixtures.length} Pace runs to ${outputDirectory}`)
