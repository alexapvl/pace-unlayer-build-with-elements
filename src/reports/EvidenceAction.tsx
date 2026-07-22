import { Button, Html } from '@unlayer/react-elements'

const disabledEvidenceActionHtml = `
  <div style="text-align: center;">
    <span
      data-evidence-action="disabled"
      role="button"
      aria-disabled="true"
      style="box-sizing: border-box; display: inline-block; padding: 13px 18px; border-radius: 2px; background: #d0d1c7; color: #686c61; cursor: not-allowed; font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: 700; line-height: 120%;"
    >Review evidence</span>
  </div>
`

export function EvidenceAction({ href }: { href?: string }) {
  if (!href) return <Html html={disabledEvidenceActionHtml} />

  return (
    <Button
      href={href}
      backgroundColor="#171914"
      color="#ffffff"
      hoverBackgroundColor="#30342b"
      fontFamily={{ label: 'Arial', value: 'Arial, Helvetica, sans-serif' }}
      fontSize="13px"
      fontWeight={700}
      padding="13px 18px"
      borderRadius="2px"
      textAlign="center"
    >
      Review evidence
    </Button>
  )
}
