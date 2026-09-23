'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconBroadcast, IconChartBar, IconCheck, IconCopy, IconDotsVertical, IconEye, IconFlask, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { deleteCampaign, listCampaigns, saveCampaign, setCampaignStatus, type CampaignList } from '@/components/research/campaign-storage'
import { DEFAULT_FINAL_QUESTIONS, DEFAULT_TASK_QUESTIONS, newId, type Campaign } from '@/components/research/types'
import { RButton } from '@/components/research/ui'
import { StatusBadge } from '@/components/research/admin/status-badge'

/** Campaign list: create drafts, set exactly one live, copy the tester link, jump to results. */
export default function ResearchCampaignsPage() {
  const router = useRouter()
  const [data, setData] = useState<CampaignList | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [origin, setOrigin] = useState('')
  useEffect(() => setOrigin(window.location.origin), [])

  const refresh = async () => setData(await listCampaigns())
  useEffect(() => {
    void refresh()
  }, [])

  const campaigns = data?.campaigns ?? []
  const live = campaigns.find((c) => c.status === 'live')

  const createDraft = async () => {
    const now = new Date().toISOString()
    const c: Campaign = {
      id: newId('cmp'),
      title: 'Untitled campaign',
      description: '',
      status: 'draft',
      startPath: '/',
      estimatedMinutes: 5,
      tasks: [{ id: newId('task'), instruction: '', complete: { type: 'manual' }, questions: DEFAULT_TASK_QUESTIONS }],
      finalQuestions: DEFAULT_FINAL_QUESTIONS,
      outro: 'Thanks — that’s everything.',
      reward: null,
      createdAt: now,
      updatedAt: now,
    }
    await saveCampaign(c)
    router.push(`/research/campaigns/${c.id}`)
  }

  const act = async (id: string, fn: () => Promise<void>) => {
    setBusy(id)
    await fn()
    await refresh()
    setBusy(null)
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#7c5cff]/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#b7a8ff]">
            <IconFlask className="size-3.5" />
            User research
          </span>
          <h1 className="mt-3 text-2xl font-semibold">Campaigns</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
            One campaign is live at a time. Testers always get the live one via the tester link; drafts can be previewed with their own link.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/research/admin" className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-white/15 px-4 text-sm font-medium hover:bg-white/[0.06]">
            <IconChartBar className="size-4" />
            Results
          </Link>
          <RButton onClick={createDraft}>
            <IconPlus className="size-4" />
            New campaign
          </RButton>
        </div>
      </header>

      {/* Live tester link */}
      <section className="mt-8 rounded-2xl border border-[#7c5cff]/40 bg-[#7c5cff]/10 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#b7a8ff]">
              <IconBroadcast className="size-3.5" />
              Tester link
            </p>
            <p className="mt-1 truncate font-mono text-sm text-white/80">{origin}/?research=live</p>
            <p className="mt-1 text-xs text-white/50">{live ? `Currently running: ${live.title}` : 'No campaign is live — testers will see nothing.'}</p>
          </div>
          <CopyButton text={`${origin}/?research=live`} label="Copy tester link" />
        </div>
      </section>

      <ul className="mt-6 space-y-3">
        {data && campaigns.length === 0 && <li className="rounded-2xl border border-white/10 p-8 text-center text-sm text-white/45">No campaigns yet.</li>}
        {campaigns.map((c) => (
          <li key={c.id} className={cn('rounded-2xl border bg-[#1c1c1c] p-5', c.status === 'live' ? 'border-[#7c5cff]/50' : 'border-white/10')}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-lg font-semibold">{c.title}</h2>
                  <StatusBadge status={c.status} />
                </div>
                {c.description && <p className="mt-1 text-sm leading-relaxed text-white/60">{c.description}</p>}
                <p className="mt-2 text-xs text-white/45">
                  {c.tasks.length} task{c.tasks.length === 1 ? '' : 's'} · ~{c.estimatedMinutes} min · starts at <span className="font-mono">{c.startPath}</span>
                  {c.reward && <> · reward <span className="font-mono">{c.reward.code}</span></>}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {c.status !== 'live' && (
                  <RButton disabled={busy === c.id || !c.tasks.some((t) => t.instruction.trim())} onClick={() => act(c.id, () => setCampaignStatus(c.id, 'live'))}>
                    <IconBroadcast className="size-4" />
                    Set live
                  </RButton>
                )}
                {c.status === 'live' && (
                  <RButton variant="outline" disabled={busy === c.id} onClick={() => act(c.id, () => setCampaignStatus(c.id, 'ended'))}>
                    End
                  </RButton>
                )}
                <Link href={`/research/campaigns/${c.id}`} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-white/15 px-3 text-sm font-medium hover:bg-white/[0.06]">
                  <IconPencil className="size-4" />
                  Edit
                </Link>
                <RowMenu
                  onPreview={() => (window.location.href = `${c.startPath}?research=${c.id}`)}
                  onCopyPreview={() => navigator.clipboard.writeText(`${window.location.origin}${c.startPath}?research=${c.id}`)}
                  onResults={() => router.push(`/research/admin?campaign=${c.id}`)}
                  onDuplicate={() =>
                    act(c.id, async () => {
                      const now = new Date().toISOString()
                      await saveCampaign({ ...c, id: newId('cmp'), title: `${c.title} (copy)`, status: 'draft', createdAt: now, updatedAt: now })
                    })
                  }
                  onDelete={() => {
                    if (window.confirm(`Delete “${c.title}”? Results already collected are kept.`)) void act(c.id, () => deleteCampaign(c.id))
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      {data?.source === 'local' && (
        <p className="mt-6 text-xs text-amber-300/80">
          Campaigns are saved locally only ({data.error}). Run <code className="rounded bg-white/[0.06] px-1">scripts/research-migration.sql</code> so testers on other devices get the live campaign.
        </p>
      )}
    </main>
  )
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <RButton
      variant="outline"
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? <IconCheck className="size-4" /> : <IconCopy className="size-4" />}
      {copied ? 'Copied' : label}
    </RButton>
  )
}

function RowMenu({
  onPreview,
  onCopyPreview,
  onResults,
  onDuplicate,
  onDelete,
}: {
  onPreview: () => void
  onCopyPreview: () => void
  onResults: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)
  const item = 'flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white/80 hover:bg-white/[0.06] hover:text-white'
  return (
    <div className="relative">
      <button type="button" aria-label="More" onClick={() => setOpen((o) => !o)} className="flex size-10 items-center justify-center rounded-lg border border-white/15 hover:bg-white/[0.06]">
        <IconDotsVertical className="size-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-lg border border-white/10 bg-[#242424] py-1 shadow-xl">
            <button type="button" className={item} onClick={() => { setOpen(false); onPreview() }}>
              <IconEye className="size-4" /> Preview
            </button>
            <button type="button" className={item} onClick={() => { setOpen(false); onCopyPreview() }}>
              <IconCopy className="size-4" /> Copy preview link
            </button>
            <button type="button" className={item} onClick={() => { setOpen(false); onResults() }}>
              <IconChartBar className="size-4" /> Results
            </button>
            <button type="button" className={item} onClick={() => { setOpen(false); onDuplicate() }}>
              <IconPlus className="size-4" /> Duplicate
            </button>
            <button type="button" className={cn(item, 'text-[#ff6b6b] hover:text-[#ff6b6b]')} onClick={() => { setOpen(false); onDelete() }}>
              <IconTrash className="size-4" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}
