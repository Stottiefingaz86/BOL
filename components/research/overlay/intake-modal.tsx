'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IconArrowLeft, IconBallAmericanFootball, IconCards, IconFlask, IconGift, IconSparkles, IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { AGE_BANDS, DEPOSIT_BANDS, PLAYER_TYPES, type Campaign, type PlayerType, type Tester, type TesterProfile } from '../types'
import { findPriorSession } from '../research-storage'
import { RButton, RInput, RLabel } from '../ui'
import { RewardCard } from './reward-card'

interface IntakeModalProps {
  campaign: Campaign
  onStart: (tester: Tester, ip: string | null) => void
  onCancel: () => void
}

const TESTER_KEY = 'research:tester'

const EMPTY_PROFILE: TesterProfile = { plays: null, favourite: '', age: null, location: '', monthlyDeposit: null, hobbies: '' }

/**
 * Onboarding — four short steps:
 *   0 Welcome (what this is, why it matters, what they get)
 *   1 You (name, email)
 *   2 How you play (casino / sports / both / new, favourite thing)
 *   3 A bit more (age, location, monthly deposit, hobbies) → builds the player persona
 */
export function IntakeModal({ campaign, onStart, onCancel }: IntakeModalProps) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profile, setProfile] = useState<TesterProfile>(EMPTY_PROFILE)
  const [ip, setIp] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [alreadyDone, setAlreadyDone] = useState(false)

  const setP = <K extends keyof TesterProfile>(k: K, v: TesterProfile[K]) => setProfile((p) => ({ ...p, [k]: v }))

  // Remember the tester on this device so returning testers don't retype; fetch IP for de-duplication.
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(TESTER_KEY) ?? 'null') as Tester | null
      if (saved) {
        setName(saved.name)
        setEmail(saved.email)
        if (saved.profile) setProfile({ ...EMPTY_PROFILE, ...saved.profile })
      }
    } catch {
      /* ignore */
    }
    fetch('/api/research/ip')
      .then((r) => r.json())
      .then((d: { ip: string | null }) => setIp(d.ip))
      .catch(() => setIp(null))
  }, [])

  const validYou = name.trim().length > 1 && /.+@.+\..+/.test(email)
  const validPlay = profile.plays !== null
  const validMore = profile.age !== null && profile.monthlyDeposit !== null

  const go = (n: number) => {
    setDir(n > step ? 1 : -1)
    setStep(n)
  }

  const start = async () => {
    if (!validYou || !validPlay || !validMore || checking) return
    setChecking(true)
    const tester: Tester = {
      name: name.trim(),
      email: email.trim(),
      consent: true,
      profile: { ...profile, favourite: profile.favourite.trim(), location: profile.location.trim(), hobbies: profile.hobbies.trim() },
    }
    window.localStorage.setItem(TESTER_KEY, JSON.stringify(tester))
    const prior = await findPriorSession(campaign.id, { email: tester.email, ip })
    setChecking(false)
    if (prior) {
      setAlreadyDone(true)
      return
    }
    onStart(tester, ip)
  }

  const steps = 4

  return (
    <div className="fixed inset-0 z-[100050] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        role="dialog"
        data-research-ignore
        aria-modal="true"
        aria-labelledby="research-intake-title"
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#7c5cff]/35 bg-[#181433] text-white shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
      >
        {/* Header: brand mark, step dots, close */}
        <div className="flex items-center justify-between px-6 pt-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#b7a8ff]">
            <IconFlask className="size-4" />
            Research
          </span>
          <div className="flex items-center gap-2">
            {!alreadyDone && (
              <div className="flex items-center gap-1" aria-label={`Step ${step + 1} of ${steps}`}>
                {Array.from({ length: steps }).map((_, i) => (
                  <span key={i} className={cn('h-1.5 rounded-full transition-all', i === step ? 'w-5 bg-[#7c5cff]' : i < step ? 'w-1.5 bg-[#7c5cff]/60' : 'w-1.5 bg-white/15')} />
                ))}
              </div>
            )}
            <button type="button" onClick={onCancel} aria-label="Close" className="ml-1 flex size-8 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white">
              <IconX className="size-4" />
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4">
          {alreadyDone ? (
            <>
              <h2 id="research-intake-title" className="text-xl font-semibold leading-tight">
                You&apos;ve already done this one
              </h2>
              <p className="mt-1.5 text-sm text-white/55">Thanks — we only need one go per person.</p>
              {campaign.reward && <RewardCard reward={campaign.reward} className="mt-4" />}
              <RButton variant="outline" className="mt-4 w-full" onClick={onCancel}>
                Close
              </RButton>
            </>
          ) : (
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                initial={{ opacity: 0, x: dir * 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -28 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                {step === 0 && (
                  <>
                    <h2 id="research-intake-title" className="text-2xl font-semibold leading-tight">
                      Welcome to our demo
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      This is where we test and research new ideas before they go live. We need your help to make sure we&apos;re building the right things.
                    </p>
                    <ul className="mt-4 space-y-2.5 text-sm">
                      <li className="flex items-start gap-3">
                        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#7c5cff]/15 text-[#b7a8ff]">
                          <IconSparkles className="size-4" />
                        </span>
                        <span className="text-white/80">
                          <strong className="font-semibold text-white">{campaign.tasks.length} short tasks</strong> · about {campaign.estimatedMinutes} minutes. Just use the site like you normally would.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#7c5cff]/15 text-[#b7a8ff]">
                          <IconFlask className="size-4" />
                        </span>
                        <span className="text-white/80">After each task, tell us how it felt. There are no wrong answers — honest is best.</span>
                      </li>
                      {campaign.reward && (
                        <li className="flex items-start gap-3">
                          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#7c5cff]/15 text-[#b7a8ff]">
                            <IconGift className="size-4" />
                          </span>
                          <span className="text-white/80">
                            Complete the tasks and we&apos;ll reward you with a <strong className="font-semibold text-white">{campaign.reward.label} code</strong>.
                          </span>
                        </li>
                      )}
                    </ul>
                    <RButton className="mt-5 w-full" onClick={() => go(1)} autoFocus>
                      Let&apos;s go
                    </RButton>
                    <p className="mt-3 text-center text-[11px] leading-relaxed text-white/40">
                      By continuing you agree we can record your answers and how you use the demo, for research only.
                    </p>
                  </>
                )}

                {step === 1 && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (validYou) go(2)
                    }}
                  >
                    <StepTitle title="First, who are you?" sub="So we can send your reward and follow up if we have questions." />
                    <div className="mt-4 space-y-3">
                      <div>
                        <RLabel>Name</RLabel>
                        <RInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" autoFocus />
                      </div>
                      <div>
                        <RLabel>Email</RLabel>
                        <RInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
                      </div>
                    </div>
                    <Nav onBack={() => go(0)} nextLabel="Continue" nextDisabled={!validYou} submit />
                  </form>
                )}

                {step === 2 && (
                  <>
                    <StepTitle title="How do you like to play?" sub="Helps us understand who we're hearing from." />
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {PLAYER_TYPES.map((t) => (
                        <ChoiceCard key={t.id} active={profile.plays === t.id} onClick={() => setP('plays', t.id)} icon={playIcon(t.id)} label={t.label} hint={t.hint} />
                      ))}
                    </div>
                    <div className="mt-4">
                      <RLabel>Favourite thing to do here?</RLabel>
                      <RInput value={profile.favourite} onChange={(e) => setP('favourite', e.target.value)} placeholder="e.g. live blackjack, NFL parlays, jackpots… (optional)" />
                    </div>
                    <Nav onBack={() => go(1)} onNext={() => go(3)} nextLabel="Continue" nextDisabled={!validPlay} />
                  </>
                )}

                {step === 3 && (
                  <>
                    <StepTitle title="Last bit about you" sub="Kept private — used only to group feedback by type of player." />
                    <div className="mt-4 space-y-4">
                      <div>
                        <RLabel>Age</RLabel>
                        <PillGroup options={AGE_BANDS} value={profile.age} onChange={(v) => setP('age', v)} />
                      </div>
                      <div>
                        <RLabel>Roughly how much do you deposit a month?</RLabel>
                        <PillGroup options={DEPOSIT_BANDS} value={profile.monthlyDeposit} onChange={(v) => setP('monthlyDeposit', v)} />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <RLabel>Where are you based?</RLabel>
                          <RInput value={profile.location} onChange={(e) => setP('location', e.target.value)} placeholder="City or country" autoComplete="country-name" />
                        </div>
                        <div>
                          <RLabel>Hobbies</RLabel>
                          <RInput value={profile.hobbies} onChange={(e) => setP('hobbies', e.target.value)} placeholder="Football, gaming, travel…" />
                        </div>
                      </div>
                    </div>
                    <Nav onBack={() => go(2)} onNext={() => void start()} nextLabel={checking ? 'One sec…' : 'Start the test'} nextDisabled={!validMore || checking} />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Pieces ───────────────────────────────────────────────────

function StepTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <>
      <h2 id="research-intake-title" className="text-xl font-semibold leading-tight">
        {title}
      </h2>
      <p className="mt-1.5 text-sm text-white/55">{sub}</p>
    </>
  )
}

function Nav({ onBack, onNext, nextLabel, nextDisabled, submit }: { onBack: () => void; onNext?: () => void; nextLabel: string; nextDisabled?: boolean; submit?: boolean }) {
  return (
    <div className="mt-5 flex items-center gap-2">
      <RButton type="button" variant="ghost" onClick={onBack} className="px-3" aria-label="Back">
        <IconArrowLeft className="size-4" />
      </RButton>
      <RButton type={submit ? 'submit' : 'button'} onClick={submit ? undefined : onNext} disabled={nextDisabled} className="flex-1">
        {nextLabel}
      </RButton>
    </div>
  )
}

function ChoiceCard({ active, onClick, icon, label, hint }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; hint: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-colors',
        active ? 'border-[#7c5cff] bg-[#7c5cff]/15' : 'border-white/12 bg-white/[0.03] hover:border-white/30'
      )}
    >
      <span className={cn('flex size-8 items-center justify-center rounded-lg', active ? 'bg-[#7c5cff] text-white' : 'bg-white/[0.06] text-white/70')}>{icon}</span>
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-[11px] text-white/50">{hint}</span>
      </span>
    </button>
  )
}

function PillGroup<T extends string>({ options, value, onChange }: { options: readonly T[]; value: T | null; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="radiogroup">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn(
            'h-9 rounded-full border px-3 text-sm transition-colors',
            value === o ? 'border-[#7c5cff] bg-[#7c5cff] text-white' : 'border-white/12 bg-white/[0.04] text-white/70 hover:border-white/30 hover:text-white'
          )}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

function playIcon(t: PlayerType) {
  if (t === 'casino') return <IconCards className="size-4" />
  if (t === 'sports') return <IconBallAmericanFootball className="size-4" />
  if (t === 'both') return <IconSparkles className="size-4" />
  return <IconFlask className="size-4" />
}
