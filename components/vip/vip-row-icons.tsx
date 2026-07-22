/** VIP Hub row icons — built as SVGs so numbers stay crisp (Tabler overlays were clipped). */

import type { ReactNode } from 'react'

type IconProps = { className?: string }

function Svg({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  )
}

/** Rakeback / VIP refresh */
export function VipIconRakeback({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        d="M20.5 8.5A8.5 8.5 0 0 0 5.2 6.4M3.5 15.5a8.5 8.5 0 0 0 15.3 2.1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M20.5 3.5v5h-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 20.5v-5h5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function StopwatchShell({ children }: { children: ReactNode }) {
  return (
    <>
      <circle cx="12" cy="13.25" r="7.25" stroke="currentColor" strokeWidth="1.75" />
      <path d="M9.5 4.25h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M12 4.25V6.1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M17.6 7.1l1.35-1.35" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      {children}
    </>
  )
}

/** Monthly — stopwatch with 30 */
export function VipIconMonthly({ className }: IconProps) {
  return (
    <Svg className={className}>
      <StopwatchShell>
        {/* 3 */}
        <path
          d="M8.35 11.05c.55-.45 1.2-.7 1.85-.7.95 0 1.55.5 1.55 1.25 0 .7-.5 1.15-1.2 1.35.85.2 1.4.7 1.4 1.5 0 .95-.8 1.55-1.9 1.55-.7 0-1.35-.25-1.85-.7"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 0 */}
        <path
          d="M14.05 16c-1.15 0-1.95-.95-1.95-2.75S12.9 10.5 14.05 10.5s1.95.95 1.95 2.75S15.2 16 14.05 16z"
          stroke="currentColor"
          strokeWidth="1.35"
        />
      </StopwatchShell>
    </Svg>
  )
}

/** Post-monthly — stopwatch with 15 */
export function VipIconPostMonthly({ className }: IconProps) {
  return (
    <Svg className={className}>
      <StopwatchShell>
        {/* 1 */}
        <path
          d="M9.15 10.7v5.3M8.2 11.55l.95-.85"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 5 */}
        <path
          d="M15.55 10.7h-2.35v2.05c.35-.2.8-.3 1.2-.3 1.05 0 1.75.7 1.75 1.7 0 1.1-.85 1.85-2.05 1.85-.55 0-1.1-.15-1.5-.45"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </StopwatchShell>
    </Svg>
  )
}

/** Weekly — calendar with 7 */
export function VipIconWeekly({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect
        x="4.25"
        y="5.75"
        width="15.5"
        height="14"
        rx="2.25"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8.25 3.75v3.5M15.75 3.75v3.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M4.25 10h15.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      {/* 7 */}
      <path
        d="M9.6 12.35h4.5L11.4 18.1"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

/** Special / starred reload or boost */
export function VipIconSpecial({ className }: IconProps) {
  return (
    <Svg className={className}>
      <StopwatchShell>
        <path
          d="M12 10.35l.9 1.82 2.01.29-1.45 1.42.34 2L12 14.95l-1.8.93.34-2-1.45-1.42 2.01-.29L12 10.35z"
          fill="currentColor"
        />
      </StopwatchShell>
    </Svg>
  )
}
