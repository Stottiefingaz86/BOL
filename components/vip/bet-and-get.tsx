'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconCheck, IconCircleCheck } from '@tabler/icons-react'
import { useAuthSession } from '@/hooks/use-auth-session'
import { VipLoggedOutCta } from '@/components/vip/vip-logged-out-cta'

type MissionStatus = 'completed' | 'in_progress' | 'not_started'

interface Mission {
  id: string
  title: string
  description: string
  task: string
  progress: number
  target: number
  status: MissionStatus
  claimed: boolean
}

const MISSIONS: Mission[] = [
  {
    id: 'prop-shop',
    title: 'Prop Shop Reward',
    description: 'Get $10 Cash when you bet $10 in the Prop Shop or Same Game Parlay Builder on Wednesday\'s UEFA Champions League games. Min. 3 Legs, +100 odds. Only graded wagers qualify',
    task: 'Place $10 of qualifying bets',
    progress: 10,
    target: 10,
    status: 'completed',
    claimed: false,
  },
  {
    id: 'super-bowl',
    title: 'Super Bowl LX Reward',
    description: 'Get a $10 Free Bet when you wager $10 in the Prop Shop or Same Game Parlay Builder on Super Bowl LX by Thursday, February 5th. Min. 3 Legs, +100 odds. Only graded wagers qualify.',
    task: 'Place $10 of qualifying bets',
    progress: 8,
    target: 10,
    status: 'in_progress',
    claimed: false,
  },
  {
    id: 'bet-150',
    title: 'Bet $150 & Get $25 Cash',
    description: 'Get a $10 Free Bet by completing the following tasks. Expires on August 15th. Get a $10 Free Bet by completing the following tasks. (Only for graded bets – limited time offer).',
    task: 'The Bet $150 & Get $25 Cash promotion ends',
    progress: 0,
    target: 250,
    status: 'not_started',
    claimed: false,
  },
  {
    id: 'parlay-bonus',
    title: 'Parlay Power Bonus',
    description: 'Build a 5+ leg parlay on any NBA game this week. Minimum odds +500. Win or lose, get a $15 Free Bet back. Only settled parlays count.',
    task: 'Build a 5+ leg NBA parlay',
    progress: 3,
    target: 5,
    status: 'in_progress',
    claimed: false,
  },
  {
    id: 'live-bet-reward',
    title: 'Live Betting Challenge',
    description: 'Place 10 live in-play bets of $5 or more this weekend. Get a $20 Free Bet reward. All sports qualify. Only settled wagers count toward progress.',
    task: 'Place 10 live bets of $5+',
    progress: 10,
    target: 10,
    status: 'completed',
    claimed: false,
  },
]

function MissionCard({ mission, onClaim }: { mission: Mission; onClaim: (id: string) => void }) {
  const { isLoggedIn } = useAuthSession()
  const progressPercent = Math.min((mission.progress / mission.target) * 100, 100)
  const isComplete = mission.status === 'completed'
  const canClaim = isLoggedIn && isComplete && !mission.claimed

  return (
    <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] overflow-hidden">
      {/* Banner Skeleton */}
      <div className="w-full h-32 overflow-hidden relative bg-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }} />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h4 className="text-base font-bold text-white leading-tight">{mission.title}</h4>
        <p className="text-xs text-white/50 leading-relaxed">{mission.description}</p>

        {/* Task + Progress */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconCircleCheck
              className={`w-4 h-4 flex-shrink-0 ${isComplete ? 'text-[#fbbf24]' : 'text-white/30'}`}
              strokeWidth={2}
            />
            <span className="text-xs text-white/60">{mission.task}</span>
          </div>
          {isLoggedIn && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-white/[0.08] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-[#fbbf24]"
                />
              </div>
              <span className="text-xs text-white/50 font-medium tabular-nums flex-shrink-0">
                ${mission.progress} / ${mission.target}
              </span>
            </div>
          )}
        </div>

        {/* Claim / Log in */}
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            <VipLoggedOutCta className="!h-auto !py-3 !rounded-lg !text-sm" />
          ) : mission.claimed ? (
            <motion.div
              key="claimed"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold text-center flex items-center justify-center gap-2"
            >
              <IconCheck className="w-4 h-4" /> Claimed!
            </motion.div>
          ) : (
            <button
              onClick={() => canClaim && onClaim(mission.id)}
              disabled={!canClaim}
              className={`
                w-full py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all
                ${canClaim
                  ? 'bg-[#ee3536] hover:bg-[#d42f30] text-white cursor-pointer'
                  : 'bg-white/[0.06] text-white/30 cursor-not-allowed'
                }
              `}
            >
              Claim Now
            </button>
          )}
        </AnimatePresence>

        {/* Terms */}
        <button className="w-full text-center text-xs text-white/30 hover:text-white/50 transition-colors">
          Terms & Conditions
        </button>
      </div>
    </div>
  )
}

export function BetAndGet() {
  const [subTab, setSubTab] = useState<'all' | 'in_progress'>('all')
  const [missions, setMissions] = useState(MISSIONS)

  const handleClaim = useCallback((id: string) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, claimed: true } : m))
    )
  }, [])

  // Sort: completed (unclaimed) first, then in_progress, then not_started, then claimed at bottom
  const sortedMissions = useMemo(() => {
    const filtered = subTab === 'in_progress'
      ? missions.filter((m) => m.status === 'in_progress')
      : missions

    return [...filtered].sort((a, b) => {
      const order = (m: Mission) => {
        if (m.status === 'completed' && !m.claimed) return 0
        if (m.status === 'in_progress') return 1
        if (m.status === 'not_started') return 2
        return 3 // claimed
      }
      return order(a) - order(b)
    })
  }, [missions, subTab])

  return (
    <div className="space-y-4">
      {/* Sub-tabs: All / In Progress */}
      <div className="flex border-b border-white/[0.08]">
        {(['all', 'in_progress'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`
              flex-1 pb-2.5 text-sm font-medium transition-all relative
              ${subTab === tab ? 'text-white' : 'text-white/40 hover:text-white/60'}
            `}
          >
            {tab === 'all' ? 'All' : 'In Progress'}
            {subTab === tab && (
              <motion.div
                layoutId="betget-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Mission Cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {sortedMissions.map((mission) => (
            <motion.div
              key={mission.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <MissionCard mission={mission} onClaim={handleClaim} />
            </motion.div>
          ))}
        </AnimatePresence>

        {sortedMissions.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-white/40">No missions in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}
