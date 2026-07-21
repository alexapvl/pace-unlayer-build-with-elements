import { decode, encode } from '@toon-format/toon'
import { assertAgentRun, type AgentRun } from '../domain/agent-run'

export type SourceFormat = 'toon' | 'json'

export function encodeRunToToon(run: AgentRun): string {
  return encode(run, {
    delimiter: '\t',
    keyFolding: 'safe',
  })
}

export function encodeRunToJson(run: AgentRun): string {
  return JSON.stringify(run, null, 2)
}

export function encodeRun(run: AgentRun, format: SourceFormat): string {
  return format === 'toon' ? encodeRunToToon(run) : encodeRunToJson(run)
}

export function decodeRun(source: string, format: SourceFormat): AgentRun {
  const value =
    format === 'toon'
      ? decode(source, { strict: true, expandPaths: 'safe' })
      : JSON.parse(source)

  assertAgentRun(value)
  return value
}

export function getSourceStats(run: AgentRun) {
  const toon = encodeRunToToon(run)
  const json = encodeRunToJson(run)
  const savedCharacters = Math.max(0, json.length - toon.length)
  const savedPercent = json.length === 0 ? 0 : Math.round((savedCharacters / json.length) * 100)

  return {
    toonCharacters: toon.length,
    jsonCharacters: json.length,
    savedCharacters,
    savedPercent,
  }
}
