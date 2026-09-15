/**
 * Sports betting UI stays on the dark palette regardless of site light/dark.
 * Content is still largely hardcoded dark; forcing `.dark` here keeps chrome
 * (header/sidebar tokens) aligned with the odds board instead of a half-light shell.
 */
export default function SportsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="dark sports-theme min-h-screen bg-[var(--ds-page-bg)] text-[var(--ds-fg)]"
      data-sports-theme="dark"
    >
      {children}
    </div>
  )
}
