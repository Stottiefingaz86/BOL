# Jackpot wheel & win animation — sound package

Assets used by the BetOnline design prototype for the in-game jackpot **wheel** and **win overlay**.

Source map in code: `lib/sounds.ts` (`FILE_MAP` + jackpot helpers).
Wheel timing: `components/casino/jackpot/jackpot-wheel-bonus.tsx`, `components/casino/jackpot-overlay.tsx`, `lib/jackpot/constants.ts`.

## Playback order (happy path)

| # | File | When it plays | Code key | Notes |
|---|------|---------------|----------|-------|
| 01 | `01-jackpot-bg-music.mp3` | Wheel intro opens | `jackpot-bg` | Looping bed. Fades in (~2.4s). Stays under wheel until win overlay takes over / fades out. Typical vol ~0.30 |
| 02 | `02-jackpot-intro.wav` | Same moment as bed starts | `jackpot-intro` | One-shot intro sting on top of bed. Vol ~0.92 |
| 03 | `03-spin-now.mp3` | Preloaded for wheel; spin CTA / start cue | `spin-now` | Short button/start cue. Vol ~0.85 |
| 04 | `04-wheel-spin-bed.mp3` | During zoom / active spin | `jackpot-wheel-spin` | Looping wheel bed until land. Fades out ~500ms on land. Vol ~0.38 |
| 05 | `05-segment-tick-spin.mp3` | Each segment highlight during main spin | `highlight` | Fired per tick via Web Audio. Playback rate/pitch rises as wheel slows. Trim leading silence ~24ms. Lead ~45ms vs visual |
| 06 | `06-segment-tick-anticipation.mp3` | Anticipation / pre-spin ticks | `highlight-2` | Second tick sample for anticipation phase. Trim ~38ms |
| 07 | `07-final-segment.wav` | Winner segment locks | `jackpot-final-segment` | Land sting. Vol ~0.88 |
| 08 | `08-final-selection-win.mp3` | Same beat as final segment (wheel) + again when win numbers settle | `final-selection-win` | Win confirm. Wheel vol ~0.9; overlay settle vol ~1.0 |
| 09 | `09-transition-to-jackpot.mp3` | After winner flash, before/with overlay handoff | `jackpot-transition` | Riser / transition. Vol ~0.48, then fade |
| 10 | `10-jackpot-win-screen.mp3` | Win overlay mounted | `jackpot-win-screen` | Looping win-screen bed. Vol ~0.52. BG bed faded/stopped |
| 11 | `11-jackpot-numbers.mp3` | Odometer / number count-up on win screen | `jackpot-numbers` | Loops while numbers animate; stops when settle. Vol ~1.0 |

## Implementation notes for eng

1. **Autoplay**: browsers block audio until a user gesture. Unlock / preload on the spin click (or earlier gesture).
2. **Ticks**: do not use a single HTMLAudioElement for rapid ticks — pool or Web Audio `AudioBufferSourceNode` per tick so they can overlap and pitch independently.
3. **Pitch**: disable `preservesPitch` / `mozPreservesPitch` / `webkitPreservesPitch` when using `playbackRate` on tick samples.
4. **Sync**: schedule ticks in the same frame as segment highlight; optional audio lead `WHEEL_TICK_AUDIO_LEAD_MS = 45`.
5. **Layers**: intro sting + bg bed can overlap; wheel bed + ticks overlap; final segment + final selection win fire together on land.
6. **Handoff**: fade wheel bed → play transition → stop/fade bg bed → start win-screen bed → numbers loop → final selection win on settle.

## Original filenames in `public/sound/`

| Packaged | Original |
|----------|----------|
| 01-jackpot-bg-music.mp3 | `jackpot bg_music.mp3` |
| 02-jackpot-intro.wav | `jackpot first screen.wav` |
| 03-spin-now.mp3 | `spin_now.mp3` |
| 04-wheel-spin-bed.mp3 | `wheel screen.mp3` |
| 05-segment-tick-spin.mp3 | `highlight.mp3` |
| 06-segment-tick-anticipation.mp3 | `highlight_sound2.mp3` |
| 07-final-segment.wav | `finalsegment.wav` |
| 08-final-selection-win.mp3 | `final selection win.mp3` |
| 09-transition-to-jackpot.mp3 | `transition_to_jackpot.mp3` |
| 10-jackpot-win-screen.mp3 | `jackpot win screen.mp3` |
| 11-jackpot-numbers.mp3 | `jackpot animation_numbers.mp3` |

## License / usage

These are prototype assets currently shipped in the design app. Confirm licensing with the source owners before production use (some folders also contain Epidemic Sound samples that are **not** part of this pack).
