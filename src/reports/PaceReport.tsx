import { Children, Fragment, isValidElement, type ReactNode } from 'react'
import {
  Button,
  Column,
  ColumnLayouts,
  Divider,
  Document,
  Email,
  Heading,
  Page,
  Paragraph,
  Row,
} from '@unlayer/react-elements'
import { statusCopy, type AgentRun, type RiskLevel, type RunStatus } from '../domain/agent-run'

export type ReportMode = 'email' | 'page' | 'document'

const colors = {
  ink: '#171914',
  muted: '#686c61',
  canvas: '#e9e8df',
  paper: '#fffef8',
  line: '#d9dacd',
  lime: '#c9f76f',
  limeDeep: '#446315',
  amber: '#ffd77a',
  amberDeep: '#76500b',
  red: '#ff9f89',
  redDeep: '#7b2818',
  soft: '#f3f2e9',
  white: '#ffffff',
}

const sans = {
  label: 'Arial',
  value: 'Arial, Helvetica, sans-serif',
}

const mono = {
  label: 'Courier',
  value: "'Courier New', Courier, monospace",
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function statusColors(status: RunStatus) {
  if (status === 'ready') return { background: colors.lime, foreground: colors.limeDeep }
  if (status === 'needs_decision') {
    return { background: colors.amber, foreground: colors.amberDeep }
  }
  return { background: colors.red, foreground: colors.redDeep }
}

function riskColors(risk: RiskLevel) {
  if (risk === 'low') return { background: '#e7f4d8', foreground: colors.limeDeep }
  if (risk === 'medium') return { background: '#fff0c8', foreground: colors.amberDeep }
  return { background: '#ffe0d8', foreground: colors.redDeep }
}

function SectionTitle({ index, children }: { index: string; children: string }) {
  return (
    <Row
      layout={ColumnLayouts.ThreeNarrowWideNarrow}
      padding="38px 36px 14px 36px"
      noStackMobile
    >
      <Column>
        <Paragraph
          html={escapeHtml(index)}
          fontFamily={mono}
          fontSize="12px"
          lineHeight="140%"
          color={colors.muted}
        />
      </Column>
      <Column>
        <Heading
          headingType="h2"
          fontFamily={sans}
          fontSize="22px"
          fontWeight={700}
          lineHeight="110%"
          color={colors.ink}
        >
          {children}
        </Heading>
      </Column>
      <Column padding="8px 0px 0px 18px">
        <Divider borderTopWidth="1px" borderTopColor={colors.line} borderTopStyle="solid" />
      </Column>
    </Row>
  )
}

function ReportContent({ run, mode }: { run: AgentRun; mode: ReportMode }) {
  const status = statusColors(run.status)
  const risk = riskColors(run.risk)
  const isCompact = mode === 'email'
  const changedLines = run.metrics.additions + run.metrics.deletions
  const reviewArtifactUrl = run.artifacts.find((artifact) => artifact.url)?.url
  const hasReviewArtifacts = run.artifacts.length > 0

  return (
    <>
      <Row layout={ColumnLayouts.OneColumn} backgroundColor={status.background} padding="7px 0px">
        <Column>
          <Paragraph
            html="&nbsp;"
            fontSize="1px"
            lineHeight="1"
            color={status.background}
          />
        </Column>
      </Row>

      <Row layout={ColumnLayouts.TwoEqual} backgroundColor={colors.paper} padding="26px 36px 18px 36px">
        <Column>
          <Heading
            headingType="h2"
            fontFamily={sans}
            fontSize="23px"
            fontWeight={700}
            lineHeight="100%"
            color={colors.ink}
          >
            pace
          </Heading>
          <Paragraph
            html="Agent work, ready for review."
            fontFamily={sans}
            fontSize="12px"
            lineHeight="140%"
            color={colors.muted}
          />
        </Column>
        <Column>
          <Paragraph
            html={escapeHtml(run.id.toUpperCase())}
            fontFamily={mono}
            fontSize="11px"
            lineHeight="150%"
            textAlign="right"
            color={colors.muted}
          />
          <Paragraph
            html={escapeHtml(`${run.repository} · ${run.branch}`)}
            fontFamily={mono}
            fontSize="10px"
            lineHeight="150%"
            textAlign="right"
            color={colors.muted}
          />
        </Column>
      </Row>

      <Row layout={ColumnLayouts.OneColumn} backgroundColor={colors.paper} padding="0px 36px">
        <Column>
          <Divider borderTopWidth="1px" borderTopColor={colors.line} borderTopStyle="solid" />
        </Column>
      </Row>

      <Row layout={ColumnLayouts.OneColumn} backgroundColor={colors.paper} padding="34px 36px 12px 36px">
        <Column>
          <Paragraph
            html={escapeHtml(statusCopy[run.status].label.toUpperCase())}
            fontFamily={mono}
            fontSize="11px"
            fontWeight={700}
            lineHeight="140%"
            color={status.foreground}
          />
          <Heading
            headingType="h1"
            fontFamily={sans}
            fontSize={isCompact ? '34px' : '42px'}
            fontWeight={700}
            lineHeight="104%"
            color={colors.ink}
          >
            {run.title}
          </Heading>
          <Paragraph
            html={escapeHtml(run.summary)}
            fontFamily={sans}
            fontSize="15px"
            lineHeight="155%"
            color={colors.muted}
          />
        </Column>
      </Row>

      <Row
        layout={ColumnLayouts.FourEqual}
        backgroundColor={colors.paper}
        padding="20px 36px 30px 36px"
        noStackMobile
      >
        <Column padding="0px 10px 0px 0px">
          <Heading headingType="h3" fontFamily={mono} fontSize="20px" fontWeight={700} color={colors.ink}>
            {run.metrics.filesChanged}
          </Heading>
          <Paragraph html="files changed" fontFamily={sans} fontSize="11px" color={colors.muted} />
        </Column>
        <Column padding="0px 10px">
          <Heading headingType="h3" fontFamily={mono} fontSize="20px" fontWeight={700} color={colors.ink}>
            {changedLines}
          </Heading>
          <Paragraph html="lines touched" fontFamily={sans} fontSize="11px" color={colors.muted} />
        </Column>
        <Column padding="0px 10px">
          <Heading headingType="h3" fontFamily={mono} fontSize="20px" fontWeight={700} color={colors.ink}>
            {run.metrics.testsPassed}
          </Heading>
          <Paragraph html="tests passed" fontFamily={sans} fontSize="11px" color={colors.muted} />
        </Column>
        <Column padding="0px 0px 0px 10px">
          <Heading headingType="h3" fontFamily={mono} fontSize="20px" fontWeight={700} color={colors.ink}>
            {run.durationMinutes}m
          </Heading>
          <Paragraph html="elapsed" fontFamily={sans} fontSize="11px" color={colors.muted} />
        </Column>
      </Row>

      {run.decisions.length > 0 ? (
        <>
          <Row layout={ColumnLayouts.OneColumn} backgroundColor={status.background} padding="22px 36px 8px 36px">
            <Column>
              <Paragraph
                html="HUMAN DECISION"
                fontFamily={mono}
                fontSize="10px"
                fontWeight={700}
                color={status.foreground}
              />
              <Heading
                headingType="h2"
                fontFamily={sans}
                fontSize="22px"
                fontWeight={700}
                lineHeight="120%"
                color={colors.ink}
              >
                {run.decisions[0].question}
              </Heading>
              <Paragraph
                html={escapeHtml(run.decisions[0].context)}
                fontFamily={sans}
                fontSize="13px"
                lineHeight="150%"
                color={colors.ink}
              />
            </Column>
          </Row>
          <Row
            layout={ColumnLayouts.ThreeEqual}
            backgroundColor={status.background}
            padding="10px 36px 24px 36px"
            noStackMobile
          >
            {run.decisions[0].options.map((option) => (
              <Column key={option} padding="0px 7px 0px 0px">
                <Paragraph
                  html={escapeHtml(
                    option === run.decisions[0].recommendation ? `${option} · recommended` : option,
                  )}
                  fontFamily={mono}
                  fontSize="10px"
                  lineHeight="140%"
                  color={colors.ink}
                />
              </Column>
            ))}
          </Row>
        </>
      ) : []}

      {SectionTitle({ index: '01', children: 'Objective' })}
      <Row layout={ColumnLayouts.TwoNarrowWide} padding="0px 36px 8px 36px">
        <Column>
          <Paragraph
            html={escapeHtml(`${run.agent} · ${run.durationMinutes} min`)}
            fontFamily={mono}
            fontSize="10px"
            lineHeight="150%"
            color={colors.muted}
          />
        </Column>
        <Column>
          <Paragraph
            html={escapeHtml(run.objective)}
            fontFamily={sans}
            fontSize="14px"
            lineHeight="155%"
            color={colors.ink}
          />
        </Column>
      </Row>

      {SectionTitle({ index: '02', children: 'Changes' })}
      {run.changes.map((change, index) => (
        <Row
          key={change.area}
          layout={ColumnLayouts.TwoNarrowWide}
          backgroundColor={index % 2 === 0 ? colors.soft : colors.paper}
          padding="15px 36px"
        >
          <Column>
            <Paragraph
              html={escapeHtml(change.area.toUpperCase())}
              fontFamily={mono}
              fontSize="10px"
              fontWeight={700}
              color={colors.muted}
            />
          </Column>
          <Column>
            <Paragraph
              html={escapeHtml(change.summary)}
              fontFamily={sans}
              fontSize="13px"
              lineHeight="145%"
              color={colors.ink}
            />
            <Paragraph
              html={escapeHtml(change.files)}
              fontFamily={mono}
              fontSize="9px"
              lineHeight="145%"
              color={colors.muted}
            />
          </Column>
        </Row>
      ))}

      {SectionTitle({ index: '03', children: 'Verification' })}
      {run.verifications.map((check) => {
        const marker = check.status === 'passed' ? '✓' : check.status === 'failed' ? '×' : '−'
        return (
          <Row key={check.name} layout={ColumnLayouts.ThreeNarrowWideNarrow} padding="12px 36px">
            <Column>
              <Paragraph
                html={escapeHtml(`${marker} ${check.status.toUpperCase()}`)}
                fontFamily={mono}
                fontSize="10px"
                fontWeight={700}
                color={check.status === 'passed' ? colors.limeDeep : colors.redDeep}
              />
            </Column>
            <Column>
              <Paragraph
                html={escapeHtml(check.name)}
                fontFamily={sans}
                fontSize="13px"
                fontWeight={700}
                color={colors.ink}
              />
              <Paragraph
                html={escapeHtml(check.evidence)}
                fontFamily={sans}
                fontSize="11px"
                lineHeight="145%"
                color={colors.muted}
              />
            </Column>
            <Column>
              <Paragraph
                html={escapeHtml(check.duration)}
                fontFamily={mono}
                fontSize="10px"
                textAlign="right"
                color={colors.muted}
              />
            </Column>
          </Row>
        )
      })}

      {SectionTitle({ index: '04', children: 'Risk' })}
      <Row layout={ColumnLayouts.OneColumn} backgroundColor={risk.background} padding="18px 36px">
        <Column>
          <Paragraph
            html={escapeHtml(`${run.risk.toUpperCase()} RISK · ${statusCopy[run.status].sentence}`)}
            fontFamily={mono}
            fontSize="10px"
            fontWeight={700}
            lineHeight="145%"
            color={risk.foreground}
          />
        </Column>
      </Row>
      {run.risks.map((item) => (
        <Row key={item.title} layout={ColumnLayouts.TwoNarrowWide} padding="14px 36px">
          <Column>
            <Paragraph
              html={escapeHtml(item.level.toUpperCase())}
              fontFamily={mono}
              fontSize="10px"
              fontWeight={700}
              color={riskColors(item.level).foreground}
            />
          </Column>
          <Column>
            <Paragraph
              html={escapeHtml(item.title)}
              fontFamily={sans}
              fontSize="13px"
              fontWeight={700}
              color={colors.ink}
            />
            <Paragraph
              html={escapeHtml(`${item.detail} Mitigation: ${item.mitigation}`)}
              fontFamily={sans}
              fontSize="11px"
              lineHeight="150%"
              color={colors.muted}
            />
          </Column>
        </Row>
      ))}

      {!isCompact ? (
        <>
          {SectionTitle({ index: '05', children: 'Timeline' })}
          {run.timeline.map((item) => (
            <Row key={`${item.time}-${item.event}`} layout={ColumnLayouts.ThreeNarrowWideNarrow} padding="12px 36px">
              <Column>
                <Paragraph html={escapeHtml(item.time)} fontFamily={mono} fontSize="10px" color={colors.muted} />
              </Column>
              <Column>
                <Paragraph
                  html={escapeHtml(item.event)}
                  fontFamily={sans}
                  fontSize="13px"
                  fontWeight={700}
                  color={colors.ink}
                />
                <Paragraph
                  html={escapeHtml(item.detail)}
                  fontFamily={sans}
                  fontSize="11px"
                  lineHeight="145%"
                  color={colors.muted}
                />
              </Column>
              <Column>
                <Paragraph
                  html={escapeHtml(item.result.toUpperCase())}
                  fontFamily={mono}
                  fontSize="9px"
                  textAlign="right"
                  color={item.result === 'done' ? colors.limeDeep : colors.redDeep}
                />
              </Column>
            </Row>
          ))}
        </>
      ) : []}

      {SectionTitle({ index: isCompact ? '05' : '06', children: 'Receipts' })}
      {run.artifacts.map((artifact) => (
        <Row key={artifact.label} layout={ColumnLayouts.TwoNarrowWide} padding="11px 36px">
          <Column>
            <Paragraph
              html={escapeHtml(artifact.type.replace('_', ' ').toUpperCase())}
              fontFamily={mono}
              fontSize="9px"
              color={colors.muted}
            />
          </Column>
          <Column>
            <Paragraph
              html={escapeHtml(artifact.label)}
              fontFamily={sans}
              fontSize="13px"
              fontWeight={700}
              color={colors.ink}
            />
            <Paragraph
              html={escapeHtml(artifact.detail)}
              fontFamily={sans}
              fontSize="11px"
              color={colors.muted}
            />
          </Column>
        </Row>
      ))}

      {hasReviewArtifacts ? (
        <Row layout={ColumnLayouts.OneColumn} padding="24px 36px 34px 36px">
          <Column>
            <Button
              href={reviewArtifactUrl}
              backgroundColor={reviewArtifactUrl ? colors.ink : '#d0d1c7'}
              color={reviewArtifactUrl ? colors.white : '#686c61'}
              hoverBackgroundColor={reviewArtifactUrl ? '#30342b' : '#d0d1c7'}
              fontFamily={sans}
              fontSize="13px"
              fontWeight={700}
              padding="13px 18px"
              borderRadius="2px"
              textAlign="center"
            >
              Review evidence
            </Button>
          </Column>
        </Row>
      ) : []}

      <Row layout={ColumnLayouts.OneColumn} backgroundColor={colors.ink} padding="22px 36px">
        <Column>
          <Paragraph
            html="Agents produce work faster than humans can confidently review."
            fontFamily={sans}
            fontSize="11px"
            lineHeight="150%"
            color={colors.paper}
          />
          <Paragraph
            html={escapeHtml(`Generated by Pace · ${run.finishedAt}`)}
            fontFamily={mono}
            fontSize="9px"
            lineHeight="150%"
            color="#aeb2a4"
          />
        </Column>
      </Row>
    </>
  )
}

function flattenReportRows(node: ReactNode): ReactNode[] {
  if (Array.isArray(node)) return node.flatMap(flattenReportRows)
  if (node === null || node === undefined || typeof node === 'boolean') return []

  if (isValidElement(node) && node.type === Fragment) {
    const props = node.props as { children?: ReactNode }
    return flattenReportRows(props.children)
  }

  return [node]
}

function reportRows(run: AgentRun, mode: ReportMode) {
  return Children.toArray(flattenReportRows(ReportContent({ run, mode })))
}

export function PaceEmail({ run }: { run: AgentRun }) {
  return (
    <Email
      backgroundColor={colors.canvas}
      contentWidth="640px"
      fontFamily={sans}
      textColor={colors.ink}
      previewText={`${statusCopy[run.status].label}: ${run.title}`}
    >
      {reportRows(run, 'email')}
    </Email>
  )
}

export function PacePage({ run }: { run: AgentRun }) {
  return (
    <Page backgroundColor={colors.canvas} contentWidth="840px" fontFamily={sans} textColor={colors.ink}>
      {reportRows(run, 'page')}
    </Page>
  )
}

export function PaceDocument({ run }: { run: AgentRun }) {
  return (
    <Document backgroundColor={colors.canvas} contentWidth="760px" fontFamily={sans} textColor={colors.ink}>
      {reportRows(run, 'document')}
    </Document>
  )
}

export function PaceReport({ run, mode }: { run: AgentRun; mode: ReportMode }) {
  if (mode === 'email') return <PaceEmail run={run} />
  if (mode === 'document') return <PaceDocument run={run} />
  return <PacePage run={run} />
}
