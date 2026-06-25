/**
 * Tiny client-side sound helper.
 *
 * Sound files live in `public/sound/<name>.mp3`. We cache one Audio element
 * per sound and rewind it on each play so rapid retriggers (e.g. multiple
 * toasts in quick succession) all fire.
 *
 * Browser autoplay policies block playback until the user has interacted
 * with the page — that's fine, we silently swallow the rejection.
 */

const SOUND_BASE = '/sound'

export type SoundName =
  | 'button-click'
  | 'redeem'
  | 'spin'
  | 'spin-now'
  | 'jackpot-bg'
  | 'jackpot-numbers'
  | 'jackpot-intro'
  | 'jackpot-win-screen'
  | 'jackpot-final-segment'
  | 'final-selection-win'
  | 'jackpot-transition'
  | 'highlight'

const FILE_MAP: Record<SoundName, string> = {
  // Note: existing assets use spaces in the file names — keep them encoded.
  'button-click': 'button%20click.mp3',
  redeem: 'redeem.mp3',
  spin: 'spin2.mp3',
  'spin-now': 'spin_now.mp3',
  'jackpot-bg': 'jackpot%20bg_music.mp3',
  'jackpot-numbers': 'jackpot%20animation_numbers.mp3',
  'jackpot-intro': 'jackpot%20first%20screen.wav',
  'jackpot-win-screen': 'jackpot%20win%20screen.mp3',
  'jackpot-final-segment': 'finalsegment.wav',
  'final-selection-win': 'final%20selection%20win.mp3',
  'jackpot-transition': 'transition_to_jackpot.mp3',
  highlight: 'highlight.mp3',
}

const cache: Partial<Record<SoundName, HTMLAudioElement>> = {}
const HIGHLIGHT_POOL_SIZE = 16
let highlightPool: HTMLAudioElement[] | null = null
let highlightPoolIndex = 0
let wheelTickCtx: AudioContext | null = null
let wheelTickBuffer: AudioBuffer | null = null
let wheelTickBufferPromise: Promise<AudioBuffer | null> | null = null
let bgVolumeRampRaf = 0

/** Turn off pitch preservation so playbackRate changes the pitch (cross-browser). */
function disablePreservesPitch(audio: HTMLAudioElement): void {
  const a = audio as HTMLAudioElement & {
    preservesPitch?: boolean
    mozPreservesPitch?: boolean
    webkitPreservesPitch?: boolean
  }
  a.preservesPitch = false
  a.mozPreservesPitch = false
  a.webkitPreservesPitch = false
}

function initHighlightPool(): HTMLAudioElement[] {
  if (typeof window === 'undefined') return []
  if (highlightPool) return highlightPool
  highlightPool = Array.from({ length: HIGHLIGHT_POOL_SIZE }, () => {
    const audio = new Audio(`${SOUND_BASE}/${FILE_MAP.highlight}`)
    audio.preload = 'auto'
    // Let playbackRate actually change the PITCH (browsers preserve pitch by
    // default, which makes the ticks only speed up, never pitch up).
    disablePreservesPitch(audio)
    audio.load()
    return audio
  })
  return highlightPool
}

/** Warm the highlight pool + decode tick buffer for Web Audio pitch shifts. */
export function preloadWheelHighlightTicks(): void {
  initHighlightPool()
  void loadWheelTickBuffer()
}

function ensureWheelTickContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!wheelTickCtx) {
    wheelTickCtx = new AudioContext()
  }
  return wheelTickCtx
}

function loadWheelTickBuffer(): Promise<AudioBuffer | null> {
  if (wheelTickBuffer) return Promise.resolve(wheelTickBuffer)
  if (wheelTickBufferPromise) return wheelTickBufferPromise
  wheelTickBufferPromise = (async () => {
    const ctx = ensureWheelTickContext()
    if (!ctx) return null
    try {
      const res = await fetch(`${SOUND_BASE}/${FILE_MAP.highlight}`)
      const data = await res.arrayBuffer()
      wheelTickBuffer = await ctx.decodeAudioData(data)
      return wheelTickBuffer
    } catch {
      return null
    }
  })()
  return wheelTickBufferPromise
}

/** Resume Web Audio tick context — call from a user gesture before spin. */
export function resumeWheelTickAudio(): void {
  const ctx = ensureWheelTickContext()
  if (ctx?.state === 'suspended') {
    void ctx.resume()
  }
}

function getAudio(name: SoundName, volume: number): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  let audio = cache[name]
  if (!audio) {
    audio = new Audio(`${SOUND_BASE}/${FILE_MAP[name]}`)
    audio.preload = 'auto'
    cache[name] = audio
  }
  audio.volume = volume
  return audio
}

/** Spin CTA — play in the user-gesture handler (not via unlock mute cycle). */
export function playSpinNowSound(volume = 0.85): HTMLAudioElement | null {
  const audio = getAudio('spin-now', volume)
  if (!audio) return null
  audio.muted = false
  audio.loop = false
  audio.currentTime = 0
  try {
    const result = audio.play()
    if (result && typeof (result as Promise<void>).catch === 'function') {
      ;(result as Promise<void>).catch(() => {})
    }
  } catch {
    // no-op
  }
  return audio
}

interface PlaySoundOptions {
  /** 0–1. Defaults: click 0.5, redeem 0.7, spin 0.5, jackpot-bg 0.4. */
  volume?: number
  loop?: boolean
}

/**
 * Play a sound and return the underlying `HTMLAudioElement` so the caller can
 * pause / stop it (handy for the spin sound, which we cut off the moment the
 * reel lands on a result). Returns `null` on the server or if the audio can't
 * be created. Callers that don't need to stop the sound can ignore the return
 * value — the existing fire-and-forget call sites are unaffected.
 */
export function playSound(
  name: SoundName,
  options: PlaySoundOptions = {}
): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  const defaultVolume =
    name === 'redeem'
      ? 0.7
      : name === 'jackpot-bg'
        ? 0.4
        : name === 'jackpot-numbers'
          ? 1
          : name === 'jackpot-win-screen'
            ? 0.52
            : name === 'highlight'
            ? 0.5
            : name === 'spin-now'
              ? 0.85
              : name === 'final-selection-win'
              ? 0.9
              : name === 'jackpot-transition'
                ? 0.85
                : 0.5
  const audio = getAudio(name, options.volume ?? defaultVolume)
  if (!audio) return null
  audio.loop = options.loop ?? false
  try {
    audio.currentTime = 0
    const result = audio.play()
    // Some browsers return a Promise; ignore rejections (autoplay policy etc.)
    if (result && typeof (result as Promise<void>).catch === 'function') {
      ;(result as Promise<void>).catch(() => {})
    }
  } catch {
    // no-op — sound is purely cosmetic
  }
  return audio
}

/** Proceed when a one-shot sound ends, or at `maxWaitMs` — whichever comes first. */
export function afterSound(
  audio: HTMLAudioElement | null,
  maxWaitMs: number,
  onDone: () => void
): () => void {
  let done = false
  const finish = () => {
    if (done) return
    done = true
    audio?.removeEventListener('ended', finish)
    clearTimeout(timer)
    onDone()
  }
  audio?.addEventListener('ended', finish, { once: true })
  const timer = setTimeout(finish, maxWaitMs)
  return finish
}

/** Warm sounds used in the wheel → win overlay handoff. */
export function preloadJackpotWinHandoffAudio(): void {
  if (typeof window === 'undefined') return
  getAudio('jackpot-final-segment', 0.88)?.load()
  getAudio('jackpot-transition', 0.85)?.load()
  getAudio('jackpot-win-screen', 0.52)?.load()
}

/** Start the looping bed immediately — retries until buffered or playing. */
export function startJackpotBgMusicImmediate(bgVolume = 0.42): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  const bg = getAudio('jackpot-bg', bgVolume)
  if (!bg) return null

  bg.loop = true
  bg.volume = bgVolume

  if (!bg.paused && bg.currentTime > 0.05) {
    return bg
  }

  const tryPlay = () => {
    if (!bg.paused && bg.currentTime > 0.05) return
    try {
      const result = bg.play()
      if (result && typeof result.catch === 'function') {
        result.catch(() => {})
      }
    } catch {
      // no-op
    }
  }

  if (bg.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
    bg.load()
  }

  tryPlay()

  if (bg.paused) {
    const onReady = () => tryPlay()
    bg.addEventListener('canplay', onReady, { once: true })
    bg.addEventListener('canplaythrough', onReady, { once: true })
  }

  return bg
}

/** Smooth volume change — never restarts playback or drops to silence mid-song. */
export function rampJackpotBgVolume(
  targetVolume: number,
  durationMs = 700
): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  const bg = getAudio('jackpot-bg', targetVolume)
  if (!bg) return null

  bg.loop = true

  const coldStart = bg.paused || bg.currentTime <= 0.05
  if (coldStart) {
    bg.volume = 0
    try {
      if (bg.paused) bg.currentTime = 0
      const result = bg.play()
      if (result && typeof result.catch === 'function') {
        result.catch(() => {})
      }
    } catch {
      // no-op
    }
  }

  const startVolume = coldStart ? 0 : bg.volume
  const started = performance.now()
  cancelAnimationFrame(bgVolumeRampRaf)

  const step = () => {
    const t = Math.min(1, (performance.now() - started) / durationMs)
    bg.volume = startVolume + (targetVolume - startVolume) * t
    if (t < 1) bgVolumeRampRaf = requestAnimationFrame(step)
  }
  bgVolumeRampRaf = requestAnimationFrame(step)
  return bg
}

/** Fade the looping jackpot bed in from silence (or ramp up if already playing). */
export function fadeInJackpotBgMusic(targetVolume = 0.42, durationMs = 2400): HTMLAudioElement | null {
  return rampJackpotBgVolume(targetVolume, durationMs)
}

/** Preload wheel sounds only — does not start playback. */
export function preloadJackpotWheelAudio(bgVolume = 0.42): void {
  if (typeof window === 'undefined') return
  const bg = getAudio('jackpot-bg', bgVolume)
  const intro = getAudio('jackpot-intro', 0.92)
  getAudio('spin-now', 0.85)?.load()
  if (bg) {
    bg.loop = true
    bg.load()
  }
  intro?.load()
}

/** @deprecated Use preloadJackpotWheelAudio — load only, no autoplay. */
export function preloadJackpotIntroAudio(bgVolume = 0.42): void {
  preloadJackpotWheelAudio(bgVolume)
}

/** Intro screen — bed fades in; intro sting plays on top. */
export function startJackpotIntroAudio(bgVolume = 0.42): void {
  if (typeof window === 'undefined') return
  fadeInJackpotBgMusic(bgVolume, 2400)

  const intro = getAudio('jackpot-intro', 0.92)
  if (!intro) return

  try {
    if (intro.paused) {
      intro.currentTime = 0
    }
    const introResult = intro.play()
    if (introResult && typeof introResult.catch === 'function') {
      introResult.catch(() => {})
    }
  } catch {
    // no-op — sound is purely cosmetic
  }
}

/** Looping jackpot bed — keeps playing if already started (wheel → overlay handoff). */
export function playJackpotBgMusic(options: PlaySoundOptions = {}): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  const volume = options.volume ?? 0.4
  const existing = cache['jackpot-bg']
  if (existing && !existing.paused && existing.loop) {
    return existing
  }
  return playSound('jackpot-bg', { ...options, volume, loop: true })
}

/** (Re)start the looping bed if it was paused — never drops volume while playing. */
export function ensureJackpotBgMusic(volume = 0.42): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  const existing = cache['jackpot-bg']
  if (existing) {
    existing.loop = true
    if (existing.paused) {
      existing.volume = volume
      try {
        const result = existing.play()
        if (result && typeof (result as Promise<void>).catch === 'function') {
          ;(result as Promise<void>).catch(() => {})
        }
      } catch {
        // no-op
      }
    }
    return existing
  }
  return playJackpotBgMusic({ volume, loop: true })
}

export function setJackpotBgVolume(volume: number): void {
  const audio = cache['jackpot-bg']
  if (audio) audio.volume = volume
}

export function isJackpotBgAudible(threshold = 0.05): boolean {
  const bg = cache['jackpot-bg']
  return !!(bg && !bg.paused && bg.volume > threshold && bg.currentTime > 0.05)
}

/** One-shot wheel tick — pitch rises via Web Audio (reliable cross-browser). */
export function playWheelHighlightTick(
  tickIndex: number,
  options: {
    volume?: number
    basePitch?: number
    pitchStep?: number
    pitchBoost?: number
    maxPitch?: number
    /** Override computed pitch (playbackRate). */
    playbackRate?: number
  } = {}
): void {
  if (typeof window === 'undefined') return

  const basePitch = options.basePitch ?? 0.96
  const pitchStep = options.pitchStep ?? 0.032
  const pitchBoost = options.pitchBoost ?? 0
  const maxPitch = options.maxPitch ?? 2.2
  const pitch =
    options.playbackRate ??
    Math.min(maxPitch, basePitch + tickIndex * pitchStep + pitchBoost)
  const volume = Math.min(1, options.volume ?? 0.72)

  const ctx = ensureWheelTickContext()
  if (ctx && wheelTickBuffer) {
    if (ctx.state === 'suspended') void ctx.resume()
    const source = ctx.createBufferSource()
    source.buffer = wheelTickBuffer
    source.playbackRate.value = pitch
    const gain = ctx.createGain()
    gain.gain.value = volume
    source.connect(gain)
    gain.connect(ctx.destination)
    source.start(0)
    return
  }

  // Fallback until buffer is decoded
  void loadWheelTickBuffer().then((buffer) => {
    if (buffer) {
      playWheelHighlightTick(tickIndex, options)
      return
    }
    const pool = initHighlightPool()
    if (!pool.length) return
    const audio = pool[highlightPoolIndex % pool.length]
    highlightPoolIndex += 1
    audio.volume = volume
    disablePreservesPitch(audio)
    audio.playbackRate = pitch
    audio.currentTime = 0
    try {
      const result = audio.play()
      if (result && typeof result.catch === 'function') {
        result.catch(() => {})
      }
    } catch {
      // no-op
    }
  })
}

/** Fade a looping sound out, then stop and rewind it. */
export function fadeOutSound(name: SoundName, durationMs = 900): void {
  const audio = cache[name]
  if (!audio || audio.paused) return
  const startVolume = audio.volume
  const started = performance.now()
  const step = () => {
    const elapsed = performance.now() - started
    const t = Math.min(1, elapsed / durationMs)
    audio.volume = startVolume * (1 - t)
    if (t < 1) {
      requestAnimationFrame(step)
    } else {
      stopSound(name)
      audio.volume = startVolume
    }
  }
  requestAnimationFrame(step)
}

/**
 * Unlock audio playback on touch/mobile devices. Call this from a user gesture
 * handler (e.g. the Spin CTA tap). iOS/Safari keeps every HTMLAudioElement
 * locked until it has been `.play()`-ed inside a gesture, so later programmatic
 * plays (the spin tick pool, win sounds) are silently blocked. We briefly play
 * each element muted and pause it, which marks them as user-unlocked.
 */
export function unlockAudioPlayback(): void {
  if (typeof window === 'undefined') return
  resumeWheelTickAudio()
  void loadWheelTickBuffer()
  const pool = initHighlightPool()
  // Make sure the sounds we'll fire later during the spin actually exist now, so
  // they get unlocked by this same gesture (otherwise iOS blocks them later).
  const primed: SoundName[] = [
    'jackpot-intro',
    'jackpot-win-screen',
    'jackpot-bg',
    'jackpot-numbers',
    'jackpot-final-segment',
    'final-selection-win',
    'jackpot-transition',
    'highlight',
  ]
  for (const name of primed) {
    if (name === 'jackpot-bg' && isJackpotBgAudible(0.02)) continue
    getAudio(name, 0.0001)
  }
  const elements: HTMLAudioElement[] = [
    ...pool,
    ...primed
      .map((name) => cache[name])
      .filter((a): a is HTMLAudioElement => !!a),
  ]
  for (const audio of elements) {
    // Only skip unlock rewind if the bed is already audibly playing mid-flow.
    const bed = cache['jackpot-bg']
    if (audio === bed && !bed.paused && bed.currentTime > 0.05) continue
    try {
      const wasMuted = audio.muted
      audio.muted = true
      const result = audio.play()
      if (result && typeof (result as Promise<void>).then === 'function') {
        ;(result as Promise<void>)
          .then(() => {
            audio.pause()
            audio.currentTime = 0
            audio.muted = wasMuted
          })
          .catch(() => {
            audio.muted = wasMuted
          })
      } else {
        audio.pause()
        audio.currentTime = 0
        audio.muted = wasMuted
      }
    } catch {
      // no-op — best-effort unlock
    }
  }
}

/** Stop a sound immediately and rewind it. Safe to call if the sound was
 * never played. */
export function stopSound(name: SoundName): void {
  const audio = cache[name]
  if (!audio) return
  try {
    audio.pause()
    audio.currentTime = 0
    audio.loop = false
  } catch {
    // no-op
  }
}
