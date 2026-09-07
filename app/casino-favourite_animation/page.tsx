'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  IconArrowLeft,
  IconCode,
  IconDownload,
  IconFileText,
  IconPackage,
  IconPlayerPlay,
  IconRefresh,
} from '@tabler/icons-react'
import { GameTileFavoriteButton } from '@/components/casino/game-tile-favorite-button'
import { cn } from '@/lib/utils'

const PACK_ZIP = '/deliverables/favorite-heart-animation.zip'
const PACK_MD = '/deliverables/favorite-heart-animation.md'

/** Exact CSS from app/globals.css — do not “simplify”. */
const PROD_CSS = `/* Sheet: 29 frames × 100px = 2900×100 */
/* Center heart masked out — icon size stays fixed */
/* Hue-shifted so fill matches pink-500, not Twitter red */
.twitter-heart-sprite {
  background-image: url('/animations/twitter-heart-sprite.png');
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 2900px 100px;
  image-rendering: auto;
  -webkit-mask-image: radial-gradient(
    circle at center,
    transparent 0 20px,
    #000 22px
  );
  mask-image: radial-gradient(circle at center, transparent 0 20px, #000 22px);
  filter:
    drop-shadow(0 1px 2px rgba(0, 0, 0, 0.55))
    hue-rotate(-22deg)
    saturate(1.2)
    brightness(1.05);
}

.twitter-heart-sprite.is-animating {
  animation: twitter-heart-burst 0.8s steps(28) forwards;
}

@keyframes twitter-heart-burst {
  from { background-position: 0 0; }
  to   { background-position: -2800px 0; } /* frame 29 */
}

@media (prefers-reduced-motion: reduce) {
  .twitter-heart-sprite.is-animating {
    animation: none;
    background-position: -2800px 0;
  }
}`

/** Exact burst logic from components/casino/game-tile-favorite-button.tsx */
const PROD_COMPONENT = `'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconHeart } from '@tabler/icons-react'

const SPRITE_SIZE = 100 // one frame of the sheet

export function GameTileFavoriteButton({ favorited, onToggle, variant = 'tile' }) {
  const buttonRef = useRef(null)
  const [animating, setAnimating] = useState(false)
  const [burstOrigin, setBurstOrigin] = useState(null)
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => { setMounted(true) }, [])

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const willFavorite = !favorited
    onToggle()
    if (willFavorite) {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (rect) {
        setBurstOrigin({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
      }
      setAnimating(true)
    } else {
      setAnimating(false)
      setBurstOrigin(null)
    }
  }

  const burst =
    mounted && animating && burstOrigin &&
    createPortal(
      <span
        className="twitter-heart-sprite is-animating pointer-events-none fixed z-[100200]"
        style={{
          left: burstOrigin.x,
          top: burstOrigin.y,
          width: SPRITE_SIZE,
          height: SPRITE_SIZE,
          marginLeft: -SPRITE_SIZE / 2,
          marginTop: -SPRITE_SIZE / 2,
        }}
        onAnimationEnd={() => {
          setAnimating(false)
          setBurstOrigin(null)
        }}
        aria-hidden
      />,
      document.body
    )

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-pressed={favorited}
        onClick={handleClick}
        className="absolute right-1.5 top-1.5 z-40 flex size-8 items-center justify-center overflow-visible"
      >
        {/* glass chrome (tile) */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full border border-white/15 bg-black/45 shadow-[0_4px_12px_rgba(0,0,0,0.35)] backdrop-blur-md"
          aria-hidden
        />
        {/* Fixed-size heart — NEVER scales; burst is particles only */}
        <IconHeart
          className={
            'relative z-10 size-4 shrink-0 ' +
            (favorited ? 'fill-pink-500 text-pink-500' : 'text-white')
          }
          strokeWidth={2}
        />
      </button>
      {burst}
    </>
  )
}`

const TILES = [
  { id: 'a', title: 'Neon Drift', tone: 'from-fuchsia-700/50 via-[#1c1224] to-black' },
  { id: 'b', title: 'Temple Gold', tone: 'from-amber-700/40 via-[#1a1510] to-black' },
  { id: 'c', title: 'Ice Vault', tone: 'from-cyan-700/40 via-[#0f1720] to-black' },
] as const

function DemoTile({
  title,
  tone,
  favorited,
  onToggle,
}: {
  title: string
  tone: string
  favorited: boolean
  onToggle: () => void
}) {
  return (
    <div className="relative h-[240px] w-[170px] overflow-hidden rounded-xl border border-white/10 bg-[#141414] shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
      <div className={cn('absolute inset-0 bg-gradient-to-br', tone)} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
      <GameTileFavoriteButton
        favorited={favorited}
        onToggle={onToggle}
        variant="tile"
      />
      <div className="absolute bottom-3 left-3 right-3">
        <div className="text-[13px] font-semibold text-white">{title}</div>
        <div className="mt-0.5 text-[11px] text-white/50">
          {favorited ? 'In favourites' : 'Tap the heart'}
        </div>
      </div>
    </div>
  )
}

export default function CasinoFavouriteAnimationPage() {
  const [favs, setFavs] = useState<Record<string, boolean>>({
    a: false,
    b: false,
    c: false,
  })
  const [toolbarFav, setToolbarFav] = useState(false)

  const resetAll = () => {
    setFavs({ a: false, b: false, c: false })
    setToolbarFav(false)
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/casino"
              className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-white/45 transition-colors hover:text-white/80"
            >
              <IconArrowLeft className="size-3.5" aria-hidden />
              Casino
            </Link>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Favourite burst animation
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
              Isolated prod control used on casino game tiles / launcher. Heart
              icon stays fixed size — ring + particles come from a portaled
              Twitter sprite sheet. Burst fires only when adding.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="#exact-code"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-pink-500/30 bg-pink-500/10 px-3 text-xs font-semibold uppercase tracking-wide text-pink-300 transition-colors hover:border-pink-500/50 hover:bg-pink-500/15 hover:text-pink-200"
            >
              <IconCode className="size-3.5 opacity-80" aria-hidden />
              Code
            </a>
            <a
              href={PACK_ZIP}
              download="favorite-heart-animation.zip"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 text-xs font-semibold uppercase tracking-wide text-white/90 transition-colors hover:border-white/30 hover:bg-white/10"
            >
              <IconDownload className="size-3.5 opacity-80" aria-hidden />
              Download zip
            </a>
            <a
              href={PACK_MD}
              download="favorite-heart-animation.md"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 text-xs font-semibold uppercase tracking-wide text-white/90 transition-colors hover:border-white/30 hover:bg-white/10"
            >
              <IconFileText className="size-3.5 opacity-80" aria-hidden />
              Guide
            </a>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 text-xs font-semibold uppercase tracking-wide text-white/90 transition-colors hover:border-white/30 hover:bg-white/10"
            >
              <IconRefresh className="size-3.5 opacity-80" aria-hidden />
              Reset
            </button>
          </div>
        </div>

        {/* Live demo */}
        <section className="rounded-2xl border border-white/10 bg-[#121212] p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-white/90">
            <IconPlayerPlay className="size-4 text-pink-400" aria-hidden />
            Live demo — click a heart to add
          </div>

          <div className="flex flex-wrap items-end gap-5">
            {TILES.map((tile) => (
              <DemoTile
                key={tile.id}
                title={tile.title}
                tone={tile.tone}
                favorited={Boolean(favs[tile.id])}
                onToggle={() =>
                  setFavs((prev) => ({ ...prev, [tile.id]: !prev[tile.id] }))
                }
              />
            ))}
          </div>

          <div className="mt-8">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 sm:max-w-xs">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-white/40">
                Toolbar variant
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/5">
                  <GameTileFavoriteButton
                    favorited={toolbarFav}
                    onToggle={() => setToolbarFav((v) => !v)}
                    variant="toolbar"
                  />
                </div>
                <span className="text-sm text-white/60">
                  {toolbarFav ? 'Favourited' : 'Not favourited'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* npm + install */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-[#121212] p-5 sm:p-7">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/90">
            <IconPackage className="size-4 text-emerald-400" aria-hidden />
            npm / install
          </div>

          <ol className="list-decimal space-y-4 pl-5 text-sm text-white/70">
            <li>
              <span className="font-medium text-white/90">Install icon package</span>
              <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-black/50 p-3 text-[12px] text-emerald-300/90">
                {`npm i @tabler/icons-react`}
              </pre>
              <p className="mt-1.5 text-xs text-white/40">
                No Framer / Lottie / canvas-confetti — burst is CSS sprite only.
                React + react-dom (portal) required.
              </p>
            </li>
            <li>
              <span className="font-medium text-white/90">Copy sprite asset</span>
              <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-black/50 p-3 text-[12px] text-white/75">
                {`assets/twitter-heart-sprite.png
  → public/animations/twitter-heart-sprite.png`}
              </pre>
            </li>
            <li>
              <span className="font-medium text-white/90">Import CSS once</span>
              <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-black/50 p-3 text-[12px] text-white/75">
                {`import './twitter-heart-sprite.css'`}
              </pre>
              <p className="mt-1.5 text-xs text-white/40">
                If CSS is missing you get a filled heart with no ring/particles.
              </p>
            </li>
            <li>
              <span className="font-medium text-white/90">Wire the button</span>
              <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-black/50 p-3 text-[12px] text-white/75">
                {`import { GameTileFavoriteButton } from './game-tile-favorite-button'

<GameTileFavoriteButton
  favorited={isFavorited}
  onToggle={toggleFavorite}
  variant="tile"
/>`}
              </pre>
            </li>
          </ol>
        </section>

        {/* Exact prod code */}
        <section
          id="exact-code"
          className="mt-6 scroll-mt-8 rounded-2xl border border-white/10 bg-[#121212] p-5 sm:p-7"
        >
          <h2 className="mb-2 text-sm font-semibold text-white/90">
            Exact prod code — copy as-is
          </h2>
          <p className="mb-5 text-xs leading-relaxed text-white/45">
            This is everything that makes the burst. No other libs. Same files as
            casino tiles (`game-tile-favorite-button.tsx` + `.twitter-heart-sprite`
            in `globals.css`).
          </p>

          <div className="space-y-5">
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/40">
                1. CSS — paste into global stylesheet
              </div>
              <pre className="max-h-[320px] overflow-auto rounded-lg border border-white/10 bg-black/50 p-3 text-[11px] leading-relaxed text-white/75">
                {PROD_CSS}
              </pre>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/40">
                2. Component — drop-in React button (prod file)
              </div>
              <pre className="max-h-[420px] overflow-auto rounded-lg border border-white/10 bg-black/50 p-3 text-[11px] leading-relaxed text-white/75">
                {PROD_COMPONENT}
              </pre>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/40">
                3. Usage on a tile
              </div>
              <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/50 p-3 text-[11px] leading-relaxed text-white/75">
                {`// parent must be position: relative
<div className="relative ...">
  <GameTileFavoriteButton
    favorited={isFavorited}
    onToggle={toggleFavorite}
    variant="tile"
  />
</div>`}
              </pre>
            </div>
          </div>
        </section>

        {/* Pitfalls */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-[#121212] p-5 sm:p-7">
          <h2 className="mb-3 text-sm font-semibold text-white/90">
            If your copy doesn’t match this demo
          </h2>
          <ul className="space-y-2 text-sm text-white/55">
            <li>
              <span className="text-white/85">Forgot CSS import</span> → heart
              fills, no burst
            </li>
            <li>
              <span className="text-white/85">Wrong sprite path</span> → empty
              burst layer (check Network for 404 on the PNG)
            </li>
            <li>
              <span className="text-white/85">Animating / scaling the icon</span>{' '}
              → wrong; icon must stay `size-4`, burst is a separate portal
            </li>
            <li>
              <span className="text-white/85">Burst clipped</span> → portal must
              target `document.body`, not inside `overflow:hidden` tiles
            </li>
            <li>
              <span className="text-white/85">Missing mask / hue-rotate</span> →
              big red growing heart instead of pink ring + dots
            </li>
          </ul>
        </section>

        <p className="mt-8 text-center text-xs text-white/30">
          Source of truth: this page uses the same{' '}
          <code className="text-white/45">GameTileFavoriteButton</code> as casino
          tiles.
        </p>
      </div>
    </div>
  )
}
