'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { IconCheck, IconCrown } from '@tabler/icons-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { rewardAccentStyle } from '@/components/vip/reward-accent'
import { cn } from '@/lib/utils'

interface MyBenefitsAccordionProps {
  /** Which tier to expand by default. */
  defaultTier?: string
  /** Render the surrounding heading. Disable when nesting in a tab that already labels itself. */
  showHeading?: boolean
  className?: string
}


function BenefitLine({
  label,
  muted = false,
}: {
  label: string
  muted?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm',
        muted ? 'text-[var(--ds-fg-subtle)]' : 'text-[var(--ds-fg)]',
      )}
    >
      <div
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[var(--ds-fg)]"
        style={rewardAccentStyle(label)}
      >
        <IconCheck className="h-3 w-3" strokeWidth={2.25} />
      </div>
      <span>{label}</span>
    </div>
  )
}

export function MyBenefitsAccordion({
  defaultTier = 'Gold',
  showHeading = true,
  className,
}: MyBenefitsAccordionProps) {
  return (
    <div className={className}>
      {showHeading && (
        <h3 className="text-lg font-semibold text-[var(--ds-fg)] mb-4">My Benefits</h3>
      )}
      <Accordion type="single" defaultValue={defaultTier} collapsible className="w-full">
        <AccordionItem value="Bronze" className={cn('border-[var(--ds-border)]', 'opacity-50')}>
          <AccordionTrigger value="Bronze" className="text-[var(--ds-fg-subtle)] hover:text-[var(--ds-fg-muted)]">
            <div className="flex items-center gap-3">
              <IconCrown className="w-5 h-5 text-amber-600" />
              <span className="line-through">Bronze</span>
            </div>
          </AccordionTrigger>
          <AccordionContent value="Bronze">
            <div className="space-y-3 pt-2">
              <div className="text-lg font-semibold text-[var(--ds-fg-subtle)]">$0</div>
              <div className="text-sm text-[var(--ds-fg-subtle)]">Wager Amount</div>
              <div className="space-y-2">
                <BenefitLine label="Daily Cash Race" muted />
              </div>
              <div className="pt-2">
                <div className="text-xs text-[var(--ds-fg-subtle)] font-medium">Complete</div>
                <Button variant="ghost" className="mt-2 text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]">
                  VIP Rewards
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="Silver" className={cn('border-[var(--ds-border)]', 'opacity-50')}>
          <AccordionTrigger value="Silver" className="text-[var(--ds-fg-subtle)] hover:text-[var(--ds-fg-muted)]">
            <div className="flex items-center gap-3">
              <IconCrown className="w-5 h-5 text-gray-400" />
              <span className="line-through">Silver</span>
            </div>
          </AccordionTrigger>
          <AccordionContent value="Silver">
            <div className="space-y-3 pt-2">
              <div className="text-lg font-semibold text-[var(--ds-fg-subtle)]">$10K</div>
              <div className="text-sm text-[var(--ds-fg-subtle)]">Wager Amount</div>
              <div className="space-y-2">
                <BenefitLine label="Daily Cash Race" muted />
                <BenefitLine label="Birthday Rewards" muted />
              </div>
              <div className="pt-2">
                <div className="text-xs text-[var(--ds-fg-subtle)] font-medium">Complete</div>
                <Button variant="ghost" className="mt-2 text-[var(--ds-fg-muted)] hover:text-[var(--ds-fg)] hover:bg-[var(--ds-control-bg)]">
                  VIP Rewards
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="Gold" className="border-[var(--ds-border)] relative">
          <motion.div
            className="absolute inset-0 bg-[var(--ds-control-bg)] pointer-events-none"
            animate={{
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <AccordionTrigger value="Gold" className="text-[var(--ds-fg)] hover:text-[var(--ds-fg)] relative z-10">
            <div className="flex items-center gap-3">
              <IconCrown className="w-5 h-5 text-yellow-400" />
              <span>Gold</span>
            </div>
          </AccordionTrigger>
          <AccordionContent value="Gold">
            <div className="space-y-3 pt-2">
              <div className="text-lg font-semibold text-[var(--ds-fg)]">$50K</div>
              <div className="text-sm text-[var(--ds-fg-muted)]">Wager Amount</div>
              <div className="space-y-2">
                <BenefitLine label="Daily Cash Race" />
                <BenefitLine label="Birthday Rewards" />
                <BenefitLine label="Weekly Cash Boost" />
                <BenefitLine label="Monthly Cash Boost" />
                <BenefitLine label="Level Up Bonuses" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="Platinum" className="border-[var(--ds-border)]">
          <AccordionTrigger value="Platinum" className="text-[var(--ds-fg)] hover:text-[var(--ds-fg)]">
            <div className="flex items-center gap-3">
              <IconCrown className="w-5 h-5 text-cyan-400" />
              <span>Platinum I - III</span>
            </div>
          </AccordionTrigger>
          <AccordionContent value="Platinum">
            <div className="space-y-3 pt-2">
              <div className="text-lg font-semibold text-[var(--ds-fg)]">$100K - 500K</div>
              <div className="text-sm text-[var(--ds-fg-muted)]">Wager Amount</div>
              <div className="space-y-2">
                <BenefitLine label="Daily Cash Race" />
                <BenefitLine label="Birthday Rewards" />
                <BenefitLine label="Weekly Cash Boost" />
                <BenefitLine label="Monthly Cash Boost" />
                <BenefitLine label="Level Up Bonuses" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="Diamond" className="border-[var(--ds-border)]">
          <AccordionTrigger value="Diamond" className="text-[var(--ds-fg)] hover:text-[var(--ds-fg)]">
            <div className="flex items-center gap-3">
              <IconCrown className="w-5 h-5 text-emerald-400" />
              <span>Diamond I - III</span>
            </div>
          </AccordionTrigger>
          <AccordionContent value="Diamond">
            <div className="space-y-3 pt-2">
              <div className="text-lg font-semibold text-[var(--ds-fg)]">$1M - 5M</div>
              <div className="text-sm text-[var(--ds-fg-muted)]">Wager Amount</div>
              <div className="space-y-2">
                <BenefitLine label="All Platinum I - III Benefits" />
                <BenefitLine label="Monthly Cash Boost" />
                <BenefitLine label="Level Up Bonuses" />
                <BenefitLine label="Prioritized Withdrawals" />
                <BenefitLine label="Dedicated VIP Team" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="Elite" className="border-[var(--ds-border)]">
          <AccordionTrigger value="Elite" className="text-[var(--ds-fg)] hover:text-[var(--ds-fg)]">
            <div className="flex items-center gap-3">
              <IconCrown className="w-5 h-5 text-purple-400" />
              <span>Elite I - III</span>
            </div>
          </AccordionTrigger>
          <AccordionContent value="Elite">
            <div className="space-y-3 pt-2">
              <div className="text-lg font-semibold text-[var(--ds-fg)]">$100M - 500M</div>
              <div className="text-sm text-[var(--ds-fg-muted)]">Wager Amount</div>
              <div className="space-y-2">
                <BenefitLine label="All Diamond I - III Benefits" />
                <BenefitLine label="Free Crypto Withdrawals" />
                <BenefitLine label="Reduced Deposit Fees" />
                <BenefitLine label="Exclusive Refer-A-Friend" />
                <BenefitLine label="Dedicated VIP Team" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="Black" className="border-[var(--ds-border)]">
          <AccordionTrigger value="Black" className="text-[var(--ds-fg)] hover:text-[var(--ds-fg)]">
            <div className="flex items-center gap-3">
              <IconCrown className="w-5 h-5 text-gray-800" />
              <span>Black I - III</span>
            </div>
          </AccordionTrigger>
          <AccordionContent value="Black">
            <div className="space-y-3 pt-2">
              <div className="text-lg font-semibold text-[var(--ds-fg)]">$100M+</div>
              <div className="text-sm text-[var(--ds-fg-muted)]">Wager Amount</div>
              <div className="space-y-2">
                <BenefitLine label="All Elite I - III Benefits" />
                <BenefitLine label="Reduced Deposit Fees" />
                <BenefitLine label="Exclusive Refer-A-Friend" />
                <BenefitLine label="Tailored Gifts & Rewards" />
                <BenefitLine label="Dedicated VIP Team" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="Obsidian" className="border-[var(--ds-border)]">
          <AccordionTrigger value="Obsidian" className="text-[var(--ds-fg)] hover:text-[var(--ds-fg)]">
            <div className="flex items-center gap-3">
              <IconCrown className="w-5 h-5 text-purple-900" />
              <span>Obsidian I - III</span>
            </div>
          </AccordionTrigger>
          <AccordionContent value="Obsidian">
            <div className="space-y-3 pt-2">
              <div className="text-lg font-semibold text-[var(--ds-fg)]">$1B+</div>
              <div className="text-sm text-[var(--ds-fg-muted)]">Wager Amount</div>
              <div className="space-y-2">
                <BenefitLine label="All Black I - III Benefits" />
                <BenefitLine label="Reduced Deposit Fees" />
                <BenefitLine label="Exclusive Refer-A-Friend" />
                <BenefitLine label="Tailored Gifts & Rewards" />
                <BenefitLine label="Dedicated VIP Team" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default MyBenefitsAccordion
