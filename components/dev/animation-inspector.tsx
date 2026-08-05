'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import {
  IconCopy,
  IconCode,
  IconBrandCss3,
  IconMovie,
  IconX,
  IconCheck,
} from '@tabler/icons-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  extractAnimations,
  formatCssSnippet,
  formatFramerSnippet,
  formatFullSnippet,
  hasExtractableAnimation,
  type AnimationExtract,
} from '@/lib/animation-inspector/extract'

type MenuState = {
  x: number
  y: number
  extract: AnimationExtract
  target: Element
}

const STORAGE_KEY = 'bol:animation-inspector'

function readEnabled(): boolean {
  if (typeof window === 'undefined') return true
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored == null) return true
  return stored !== '0'
}

async function copyText(label: string, text: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`Copied ${label}`, { duration: 1800 })
  } catch {
    toast.error('Clipboard blocked — copy failed')
  }
}

function MenuButton({
  icon,
  label,
  hint,
  onClick,
  disabled,
}: {
  icon: React.ReactNode
  label: string
  hint?: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors',
        disabled
          ? 'cursor-not-allowed opacity-40'
          : 'hover:bg-white/[0.06] active:bg-white/[0.09]'
      )}
    >
      <span className="mt-0.5 shrink-0 text-white/55">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium text-white/90">{label}</span>
        {hint ? (
          <span className="mt-0.5 block truncate text-[11px] text-white/40">{hint}</span>
        ) : null}
      </span>
    </button>
  )
}

export function AnimationInspector() {
  const pathname = usePathname()
  const isPokerApp = pathname?.startsWith('/poker-app') ?? false
  const [enabled, setEnabled] = useState(true)
  const [menu, setMenu] = useState<MenuState | null>(null)
  const [mounted, setMounted] = useState(false)
  const outlineRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMounted(true)
    setEnabled(readEnabled())
  }, [])

  const close = useCallback(() => setMenu(null), [])

  const updateOutline = useCallback((el: Element | null) => {
    const box = outlineRef.current
    if (!box) return
    if (!el) {
      box.style.display = 'none'
      return
    }
    const r = el.getBoundingClientRect()
    box.style.display = 'block'
    box.style.top = `${r.top}px`
    box.style.left = `${r.left}px`
    box.style.width = `${r.width}px`
    box.style.height = `${r.height}px`
  }, [])

  useEffect(() => {
    if (!menu) {
      updateOutline(null)
      return
    }
    updateOutline(menu.target)
    const onScroll = () => updateOutline(menu.target)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [menu, updateOutline])

  useEffect(() => {
    if (!enabled) {
      close()
      return
    }

    const onContextMenu = (event: MouseEvent) => {
      // Shift+right-click → native browser menu
      if (event.shiftKey) return

      const target = event.target
      if (!(target instanceof Element)) return
      if (target.closest('[data-animation-inspector]')) return

      // Walk up a bit to find the most useful animated ancestor
      let best: { el: Element; extract: AnimationExtract } | null = null
      let node: Element | null = target
      for (let i = 0; i < 12 && node; i += 1) {
        if (node instanceof HTMLElement && node.dataset.animationInspector != null) break
        const extract = extractAnimations(node)
        if (hasExtractableAnimation(extract)) {
          best = { el: node, extract }
          // Prefer framer hits higher in the tree once found on current
          if (extract.framer) break
        }
        node = node.parentElement
      }

      const el = best?.el ?? target
      const extract = best?.extract ?? extractAnimations(el)

      event.preventDefault()
      event.stopPropagation()

      const pad = 8
      const menuW = 280
      const menuH = 320
      let x = event.clientX
      let y = event.clientY
      if (x + menuW + pad > window.innerWidth) x = window.innerWidth - menuW - pad
      if (y + menuH + pad > window.innerHeight) y = window.innerHeight - menuH - pad
      x = Math.max(pad, x)
      y = Math.max(pad, y)

      setMenu({ x, y, extract, target: el })
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current) return
      if (event.target instanceof Node && menuRef.current.contains(event.target)) return
      close()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('contextmenu', onContextMenu, true)
    document.addEventListener('mousedown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('contextmenu', onContextMenu, true)
      document.removeEventListener('mousedown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [enabled, close])

  // Expose a tiny toggle for Design Customizer / console
  useEffect(() => {
    if (typeof window === 'undefined') return
    ;(window as unknown as { __bolAnimationInspector?: { setEnabled: (v: boolean) => void } }).__bolAnimationInspector =
      {
        setEnabled: (v: boolean) => {
          window.localStorage.setItem(STORAGE_KEY, v ? '1' : '0')
          setEnabled(v)
          if (!v) close()
          toast.message(v ? 'Animation inspector on' : 'Animation inspector off')
        },
      }
  }, [close])

  if (!mounted) return null

  return createPortal(
    <div data-animation-inspector="" aria-hidden={!menu}>
      <div
        ref={outlineRef}
        className="pointer-events-none fixed z-[9998] hidden rounded-md ring-2 ring-[var(--ds-primary,#ee3536)] ring-offset-2 ring-offset-transparent"
        style={{ display: 'none' }}
      />

      {menu ? (
        <div
          ref={menuRef}
          role="menu"
          data-animation-inspector="menu"
          className="fixed z-[9999] w-[280px] overflow-hidden rounded-xl border border-white/10 bg-[#1c1c1c]/95 shadow-2xl shadow-black/50 backdrop-blur-md"
          style={{ left: menu.x, top: menu.y }}
        >
          <div className="flex items-start justify-between gap-2 border-b border-white/[0.06] px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
                Extract animation
              </p>
              <p className="mt-0.5 truncate font-mono text-[11px] text-white/70">
                {menu.extract.elementLabel}
              </p>
              {menu.extract.ancestors[0] ? (
                <p className="mt-0.5 truncate text-[11px] text-white/40">
                  {menu.extract.ancestors.slice(0, 3).join(' → ')}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={close}
              className="rounded-md p-1 text-white/40 hover:bg-white/[0.06] hover:text-white/80"
              aria-label="Close"
            >
              <IconX className="size-3.5" strokeWidth={1.8} />
            </button>
          </div>

          <div className="space-y-0.5 p-1.5">
            <MenuButton
              icon={<IconCopy className="size-4" strokeWidth={1.8} />}
              label="Copy all"
              hint={
                hasExtractableAnimation(menu.extract)
                  ? 'Framer + CSS + keyframes'
                  : 'No animation detected — still copies report'
              }
              onClick={() => {
                void copyText('animation extract', formatFullSnippet(menu.extract))
                close()
              }}
            />
            <MenuButton
              icon={<IconMovie className="size-4" strokeWidth={1.8} />}
              label="Copy Framer Motion"
              hint={
                menu.extract.framer
                  ? menu.extract.framer.componentName
                  : 'None on this node'
              }
              disabled={!menu.extract.framer}
              onClick={() => {
                void copyText('Framer Motion', formatFramerSnippet(menu.extract))
                close()
              }}
            />
            <MenuButton
              icon={<IconBrandCss3 className="size-4" strokeWidth={1.8} />}
              label="Copy CSS / keyframes"
              hint={
                menu.extract.keyframes.length
                  ? `${menu.extract.keyframes.length} keyframe${menu.extract.keyframes.length === 1 ? '' : 's'}`
                  : menu.extract.animationClasses.length
                    ? menu.extract.animationClasses.join(' ')
                    : 'Classes + computed'
              }
              disabled={
                !menu.extract.keyframes.length &&
                !menu.extract.animationClasses.length &&
                !menu.extract.transitionClasses.length &&
                menu.extract.computed.animation === 'none'
              }
              onClick={() => {
                void copyText('CSS animation', formatCssSnippet(menu.extract))
                close()
              }}
            />
            <MenuButton
              icon={<IconCode className="size-4" strokeWidth={1.8} />}
              label="Copy className"
              hint={
                menu.extract.classList.length
                  ? menu.extract.classList.slice(0, 4).join(' ')
                  : 'Empty'
              }
              disabled={!menu.extract.classList.length}
              onClick={() => {
                void copyText('className', menu.extract.classList.join(' '))
                close()
              }}
            />
          </div>

          <div className="border-t border-white/[0.06] px-3 py-2">
            <p className="text-[10px] leading-relaxed text-white/35">
              Shift+right-click for the browser menu. Toggle via{' '}
              <code className="text-white/50">window.__bolAnimationInspector</code>
            </p>
          </div>
        </div>
      ) : null}

      {/* Quiet status chip — bottom-left, only when enabled */}
      {enabled && !isPokerApp ? (
        <button
          type="button"
          data-animation-inspector="chip"
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, '0')
            setEnabled(false)
            close()
            toast.message('Animation inspector off — enable again from Design Customizer or console')
          }}
          className="fixed bottom-3 left-3 z-[9997] flex items-center gap-1.5 rounded-full border border-white/10 bg-black/70 px-2.5 py-1 text-[10px] font-medium text-white/55 backdrop-blur-sm transition-colors hover:border-white/20 hover:text-white/80"
          title="Right-click any component to extract its animation. Click to disable."
        >
          <IconCheck className="size-3 text-[var(--ds-primary,#ee3536)]" strokeWidth={2} />
          Anim extract
        </button>
      ) : null}
    </div>,
    document.body
  )
}
