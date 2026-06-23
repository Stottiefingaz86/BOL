'use client'

import { useEffect } from 'react'
import {
  IconChartBar,
  IconLink,
  IconMail,
  IconUserPlus,
  IconWallet,
} from '@tabler/icons-react'
import { SidebarInset } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { requestLogin } from '@/lib/auth-session'
import { cn } from '@/lib/utils'

const WHY_CHOOSE = [
  'Unlimited earning potential — earn as much as your friends wager, with no caps.',
  'Transparency at every step — real-time reporting shows wagers, commissions, and progress.',
  'Flexible campaign tools — manage up to 10 unique referral links to test and optimize.',
  'Fair rewards system — commissions are based on the theoretical house edge across all games.',
  'Exclusive deals for top partners — high-volume referrers can unlock tailored opportunities.',
]

function ContentSection({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('space-y-4', className)}>
      <h2 className="text-xl font-bold text-white md:text-2xl">{title}</h2>
      <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-white/65 md:text-[15px]">
        {children}
      </div>
    </section>
  )
}

function StepCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof IconLink
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 md:p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ds-primary,#ee3536)]/15 text-[var(--ds-primary,#ee3536)]">
        <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
      </div>
      <h3 className="mb-2 text-sm font-semibold text-white md:text-base">{title}</h3>
      <p className="text-sm leading-relaxed text-white/60">{description}</p>
    </div>
  )
}

export function ReferAFriendPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <SidebarInset className="bg-[#1a1a1a] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-6 md:px-6 md:pt-8">
        {/* Hero banner */}
        <div className="relative mb-8 overflow-hidden rounded-xl border border-white/10 md:mb-10">
          <div
            className="absolute inset-0 bg-gradient-to-br from-[var(--ds-primary,#ee3536)]/25 via-[#242424] to-[#1a1a1a]"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(238,53,54,0.2),transparent_60%)]"
            aria-hidden
          />
          <div className="relative space-y-4 p-6 md:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
              Promotions
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Refer-a-Friend
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
              Maximize your earnings with the Refer-a-Friend program. Share your link,
              track activity in real time, and earn commission on every wager your friends
              place.
            </p>
            <p className="text-xs text-white/40">Updated February 11, 2026</p>
            <Button
              type="button"
              onClick={() => requestLogin()}
              className="h-10 rounded-lg bg-[var(--ds-primary,#ee3536)] px-5 text-sm font-semibold text-white hover:bg-[var(--ds-primary,#ee3536)]/90 md:h-11 md:px-6"
            >
              Login to refer
            </Button>
          </div>
        </div>

        <div className="space-y-10 md:space-y-12">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white md:text-2xl">How it works</h2>
            <p className="max-w-3xl text-sm leading-relaxed text-white/65 md:text-[15px]">
              Joining the Refer-a-Friend program is simple. Share your personalized link,
              track referred players in your dashboard, and earn as they wager on sports and
              casino games.
            </p>
            <div className="grid gap-4 pt-2 md:grid-cols-3">
              <StepCard
                icon={IconLink}
                title="Share your personalized link"
                description="Invite friends with your unique referral link. If someone registers using your link—or visits it and signs up later—your referral code is automatically applied."
              />
              <StepCard
                icon={IconChartBar}
                title="Track progress in real time"
                description="Stay updated on your referred users' activity with a transparent dashboard. See live stats on wagers and know exactly how much commission you are earning."
              />
              <StepCard
                icon={IconWallet}
                title="Earn commissions on every wager"
                description="Every bet your referred players make contributes to your commission, based on the game's theoretical house edge. This applies to both sports and casino wagers and is calculated instantly."
              />
            </div>
          </section>

          <ContentSection title="How much can you earn?">
            <p>
              There is no limit to how much you can earn. The more your friends wager, the
              more you make—without caps or restrictions. Top referrers already generate tens
              of thousands of dollars in commissions, and there is no ceiling on your
              potential.
            </p>
          </ContentSection>

          <ContentSection title="Why did I earn less for a player?">
            <p>
              Commissions are tied to the theoretical house edge of each game, so the rate
              varies depending on what your friends wager on. Some games naturally have lower
              house edges, meaning lower commission per bet, while others generate more. Over
              time, activity balances out, ensuring fair and transparent rewards.
            </p>
          </ContentSection>

          <ContentSection title="Customize with campaigns">
            <p>
              Create up to 10 unique campaigns, each with its own referral link. Use them to
              test different strategies, track performance across traffic sources, and optimize
              for success.
            </p>
          </ContentSection>

          <ContentSection title="Why choose Refer-a-Friend?">
            <ul className="space-y-2.5">
              {WHY_CHOOSE.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <IconUserPlus
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ds-primary,#ee3536)]"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ContentSection>

          <ContentSection title="Extra opportunities for larger partners">
            <p>
              While anyone can earn through Refer-a-Friend, partners with larger audiences or
              professional marketing platforms can access special deals. If you are a
              high-performing referrer or influencer, contact{' '}
              <a
                href="mailto:partners@betonline.ag"
                className="inline-flex items-center gap-1 font-medium text-white underline decoration-white/30 underline-offset-2 transition-colors hover:text-[var(--ds-primary,#ee3536)]"
              >
                <IconMail className="h-4 w-4" aria-hidden />
                partners@betonline.ag
              </a>{' '}
              to unlock tailored partnerships and exclusive offers.
            </p>
            <p>
              Whether you are sharing with friends or scaling your referral efforts, the
              Refer-a-Friend program is designed to reward everyone. Log in to get your link
              and start earning with every wager.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => requestLogin()}
              className="mt-1 border-white/15 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white"
            >
              Login to refer
            </Button>
          </ContentSection>
        </div>
      </div>
    </SidebarInset>
  )
}
