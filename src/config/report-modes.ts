import type { ReportMode } from '../reports/PaceReport'

export interface ReportModeOption {
  value: ReportMode
  label: string
  hint: string
}

export const reportModes: ReportModeOption[] = [
  { value: 'page', label: 'Web', hint: '840px evidence' },
  { value: 'email', label: 'Email', hint: '640px inbox' },
  { value: 'document', label: 'PDF', hint: 'print document' },
]
