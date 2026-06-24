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
  | 'jackpot-bg'
  | 'jackpot-numbers'
  | 'jackpot-intro'
  | 'jackpot-final-segment'
  | 'final-selection-win'
  | 'highlight'

const FILE_MAP: Record<SoundName, string> = {
  // Note: existing assets use spaces in the file names — keep them encoded.
  'button-click': 'button%20click.mp3',
  redeem: 'redeem.mp3',
  spin: 'spin2.mp3',
  'jackpot-bg': 'jackpot%20bg_music.mp3',
  'jackpot-numbers': 'jackpot%20animation_numbers.mp3',
  'jackpot-intro': 'jackpot%20first%20screen.wav',
  'jackpot-final-segment': 'finalsegment.wav',
  'final-selection-win': 'final%20selection%20win.mp3',
  highlight: 'highlight.mp3',
}

const cache: Partial<Record<SoundName, HTMLAudioElement>> = {}
const HIGHLIGHT_POOL_SIZE = 16
let highlightPool: HTMLAudioElement[] | null = null
let highlightPoolIndex = 0

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

/** Warm the highlight pool so wheel ticks fire instantly during spin. */
export function preloadWheelHighlightTicks(): void {
  initHighlightPool()
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
          ? 0.68
          : name === 'highlight'
            ? 0.5
            : name === 'final-selection-win'
              ? 0.9
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

/** Looping jackpot bed — keeps playing if already started (wheel → overlay handoff). */
export function playJackpotBgMusic(options: PlaySoundOptions = {}): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  const volume = options.volume ?? 0.4
  const existing = cache['jackpot-bg']
  if (existing && !existing.paused && existing.loop) {
    existing.volume = volume
    return existing
  }
  return playSound('jackpot-bg', { ...options, volume, loop: true })
}

export function setJackpotBgVolume(volume: number): void {
  const audio = cache['jackpot-bg']
  if (audio) audio.volume = volume
}

/** One-shot wheel tick — pitch rises with each segment pass. */
export function playWheelHighlightTick(
  tickIndex: number,
  options: {
    volume?: number
    basePitch?: number
    pitchStep?: number
    pitchBoost?: number
    maxPitch?: number
  } = {}
): void {
  if (typeof window === 'undefined') return
  const pool = initHighlightPool()
  if (!pool.length) return

  const basePitch = options.basePitch ?? 0.96
  const pitchStep = options.pitchStep ?? 0.032
  const pitchBoost = options.pitchBoost ?? 0
  const maxPitch = options.maxPitch ?? 2.2
  const pitch = Math.min(maxPitch, basePitch + tickIndex * pitchStep + pitchBoost)
  const audio = pool[highlightPoolIndex % pool.length]
  highlightPoolIndex += 1

  audio.volume = Math.min(1, options.volume ?? 0.72)
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
  const pool = initHighlightPool()
  // Make sure the sounds we'll fire later during the spin actually exist now, so
  // they get unlocked by this same gesture (otherwise iOS blocks them later).
  const primed: SoundName[] = [
    'jackpot-intro',
    'jackpot-bg',
    'jackpot-numbers',
    'final-selection-win',
    'highlight',
  ]
  for (const name of primed) getAudio(name, 0.0001)
  const elements: HTMLAudioElement[] = [
    ...pool,
    ...(Object.values(cache).filter(Boolean) as HTMLAudioElement[]),
  ]
  for (const audio of elements) {
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
