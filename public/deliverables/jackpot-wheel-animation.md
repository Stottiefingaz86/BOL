# Jackpot wheel & win overlay — animation package

Engineering handoff for recreating the in-game jackpot **wheel spin** and **win screen** animations from the BetOnline design prototype.

Companion audio pack: `deliverables/jackpot-wheel-sounds/` (also `/deliverables/jackpot-wheel-sounds.zip`).

---

## Libraries (what this prototype uses)

| Library | Version (approx) | Role |
|---------|------------------|------|
| **framer-motion** | `^11.3.19` | Declarative UI motion: intro/zoom camera, wipe `clipPath`, winner flash, CTA pulses, win-overlay enters. Imperative `animate()` + `useMotionValue` for wheel scale/Y. Odometer digit columns use `motion.span`. |
| **requestAnimationFrame** (browser) | n/a | **Primary spin driver.** Continuous rotation curve, segment-under-pointer detection, tick sync. Not driven by framer-motion’s rotate. |
| **canvas-confetti** | `^1.9.4` | Particle bursts on wheel land / win overlay. Prefer app helper `lib/confetti.ts` → `fireConfetti()` (fixed high z-index canvas above drawers). Overlay also imports `canvas-confetti` directly for mega win bursts. |
| **@number-flow/react** | `^0.5.11` | Lobby **ticker** amounts (`jackpot-ticking-amount`, `jackpot-roll-amount`). **Not** used for the win-screen odometer. |
| **Web Audio API** | n/a | Segment tick samples with rising `playbackRate` (see sound pack). |
| **SVG + CSS** | n/a | Wheel geometry (pie slices), lit-edge overlays, rim gradients, `seg-logo-in` keyframes. |
| **Canvas 2D** | n/a | Win-overlay **GoldRain** particle field (`jackpot-overlay.tsx`). |

**Not used for the wheel:** GSAP, Lottie, Three.js, CSS `@keyframes` for the main spin.

---

## Source map (read these first)

| Concern | Path |
|---------|------|
| Wheel phases, spin ease, camera, wipe | `components/casino/jackpot/jackpot-wheel-bonus.tsx` |
| Win overlay, odometer, gold rain, confetti | `components/casino/jackpot-overlay.tsx` |
| Timing constants (handoff, odometer) | `lib/jackpot/constants.ts` |
| Confetti helper (drawer-safe z-index) | `lib/confetti.ts` |
| Tick / bed / win audio | `lib/sounds.ts` + sound pack README |
| Lobby amount tickers (NumberFlow) | `components/casino/jackpot/jackpot-ticking-amount.tsx`, `jackpot-roll-amount.tsx` |
| Visual assets | `public/jackpot/` (`wheel-pointer.svg`, `wheel-center.svg`, `*_reel.svg`, ring PNGs) |

---

## Wheel phase machine

```
intro → zoom → spin → landed → wipe → (unmount / win overlay)
```

| Phase | What moves | Driver |
|-------|------------|--------|
| **intro** | Wheel at `introScale` / `introY`; intro confetti; Sound pack buttons | framer-motion layout MVs + confetti helper |
| **zoom** | Scale/Y animate to `zoomScale` / `zoomY` (~1s); swap bed → wheel spin music | `animate(wheelScaleMV, …)`, `animate(wheelYMV, …)` |
| **spin** | SVG group `transform="rotate(deg cx cy)"` every frame; segment highlight via DOM; ticks | **rAF** + `spinEase(t)` |
| **landed** | Winner flash pulses; optional settle into dead centre; land confetti | framer-motion opacity keyframes + rAF settle |
| **wipe** | Full-screen `clipPath: inset(0 0 0 100%)` reveals win overlay underneath | framer-motion `clipPath` (~920ms) |

Desktop vs mobile camera constants: `DESKTOP_WHEEL_LAYOUT` / `MOBILE_WHEEL_LAYOUT` in `jackpot-wheel-bonus.tsx`.

---

## Spin math (extract this carefully)

**Constants (prototype defaults):**

| Symbol | Value | Meaning |
|--------|-------|---------|
| `SEGMENT_COUNT` | 8 | 4 tiers × 2 slices |
| `SEGMENT_ANGLE` | 45° | `360 / 8` |
| `SPIN_DURATION_MS` | 18000 | Main spin length |
| `EXTRA_SPINS` | 1 | Full turns before land |
| `LAND_SEGMENT_FRACTION` | 0.5 | Land mid-slice under pointer |
| `LAND_SETTLE_MS` | 520 | Ease-out cubic snap to exact angle |
| `CLOSE_IN_AT` | 0.22 | Start camera push when `t ≥ 0.22` |
| `EXCITE_SEGMENTS` | 10 | Last N crossings → louder / higher tick pitch |

**Ease (`spinEase(t)`):** single continuous curve — short accel (~10%), then long power decel (`SPIN_DECEL_POW = 2.75`). Velocity never resets mid-spin (anticipation crawl without multi-revolution wind-up).

**Pointer → segment:**

```ts
segmentAtPointer(rotationDeg) =
  floor(normalizeAngle(-rotationDeg) / SEGMENT_ANGLE) % SEGMENT_COUNT
```

**Target rotation:**

```ts
rotationToLandOnSegment(i) =
  EXTRA_SPINS * 360 + normalizeAngle(360 - (i * SEGMENT_ANGLE + SEGMENT_ANGLE * 0.5))
```

**Per frame (spin):**

1. `t = elapsed / SPIN_DURATION_MS`
2. `current = start + totalTravel * spinEase(t)`
3. Apply SVG rotate; if segment under pointer changed → play tick + toggle lit DOM attrs
4. Near end / within snap tolerance → optional `LAND_SETTLE_MS` easeOutCubic into exact target
5. On complete → `landed` handoff (flash → transition audio → wipe)

**Performance tip used here:** segment highlight mutates SVG attributes (`data-seg`, `data-seg-top`) instead of React state every tick.

---

## Win overlay animation

| Layer | Technique | Timing (see `lib/jackpot/constants.ts`) |
|-------|-----------|----------------------------------------|
| Mount under wheel | Parent mounts overlay before wipe | `JACKPOT_POST_FLASH_BEAT_MS` after flash |
| Gold rain | Canvas 2D particle loop | Continuous while visible |
| Confetti | `canvas-confetti` bursts | On settle / mega win |
| **Odometer** | Stacked digit strips; `motion.span` `y` travel | Delay `JACKPOT_WIN_COUNTUP_DELAY_MS` (900); each column spins `JACKPOT_ODOMETER_SPIN_MS` (5200); columns stop **right → left** with `JACKPOT_ODOMETER_STAGGER_MS` (1050) |
| Number bed | Sound `jackpot-numbers` loops during spin; `final-selection-win` on settle | See sound pack |

Odometer columns are **not** NumberFlow — they are framer-motion vertical reel strips (`SpinDigit` in `jackpot-overlay.tsx`).

---

## Handoff timeline (happy path)

Approximate sequence after spin lands:

1. **Winner flash** — `JACKPOT_WINNER_PULSE_COUNT` (3) × `JACKPOT_WINNER_PULSE_MS` (460) + hold ≈ `JACKPOT_WINNER_FLASH_MS`
2. **Transition riser** — `jackpot-transition` up to `JACKPOT_TRANSITION_MAX_MS` (1300), fade last `JACKPOT_TRANSITION_FADE_MS` (550)
3. **Post-flash beat** — `JACKPOT_POST_FLASH_BEAT_MS` (500) then set phase `wipe`
4. **Wipe** — `WIPE_DURATION_MS` (920) clip-path
5. **Win screen** — bed + delayed odometer + confetti

Land sting overlap: `jackpot-final-segment` + `final-selection-win` on wheel land (see sound pack).

---

## How to extract / rebuild in another app

1. **Copy constants** from `lib/jackpot/constants.ts` (handoff + odometer) and the wheel locals at the top of `jackpot-wheel-bonus.tsx`.
2. **Port `spinEase` + `segmentAtPointer` + `rotationToLandOnSegment`** unchanged; drive rotation with rAF, not CSS `transition: rotate`.
3. **Camera** — two motion values (scale, y); zoom on spin start; close-in when `t ≥ CLOSE_IN_AT`.
4. **Wheel art** — 8 SVG wedges + lit overlay layer + fixed pointer at top; assets under `public/jackpot/`.
5. **Ticks** — Web Audio buffer pool; pitch by segments remaining (sound pack § Implementation notes).
6. **Wipe** — animate `clipPath` on the wheel shell while win overlay is already mounted beneath.
7. **Win numbers** — either keep the reel odometer pattern or swap to NumberFlow; match stagger timings if you want the same feel.
8. **Confetti** — use a dedicated high-z canvas if the wheel lives inside a drawer/modal.

### Minimal dependency install (npm)

```bash
npm i framer-motion canvas-confetti
npm i -D @types/canvas-confetti
# optional lobby tickers only:
npm i @number-flow/react
```

### Suggested file split for production

```
jackpot/
  wheel/
    WheelBonus.tsx      # phases + rAF spin
    wheelMath.ts        # spinEase, segmentAtPointer, …
    wheelSegments.ts    # palette + segment build
  overlay/
    WinOverlay.tsx
    OdometerAmount.tsx
    GoldRain.tsx
  timing.ts             # shared ms constants
```

---

## Visual / motion checklist for parity

- [ ] 8 segments, interleaved tier copies opposite each other
- [ ] Pointer fixed at top; wheel rotates underneath
- [ ] Accel → long decel (anticipation); ~18s spin
- [ ] Segment light + tick on each crossing; pitch rises in last ~10
- [ ] Mid-slice land + short settle (no flicker)
- [ ] Camera zoom on spin, subtle close-in on tail
- [ ] Winner gold flash pulses before handoff
- [ ] Left-to-right wipe reveals win screen
- [ ] Odometer columns same spin speed, stop right → left
- [ ] Confetti + gold rain on win screen

---

## Related packs

| Pack | Contents |
|------|----------|
| `jackpot-wheel-sounds/` | Numbered audio files + cue sheet |
| `jackpot-wheel-animation/` (this) | Libraries, phases, math, extract guide |

## License / usage

Prototype implementation in the design app. Confirm asset and library licensing before production use.
