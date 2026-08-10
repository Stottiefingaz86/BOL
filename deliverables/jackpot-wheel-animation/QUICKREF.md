# Quick reference — constants & imports

## npm

```
framer-motion@^11.3.19
canvas-confetti@^1.9.4
@number-flow/react@^0.5.11   # lobby tickers only
```

## Imports in this prototype

```ts
// Wheel
import { motion, AnimatePresence, animate, useMotionValue } from 'framer-motion'
import { fireConfetti } from '@/lib/confetti'

// Win overlay
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

// Lobby amounts
import NumberFlow from '@number-flow/react'
```

## Key timing (lib/jackpot/constants.ts)

| Constant | ms | Use |
|----------|-----|-----|
| JACKPOT_WIN_COUNTUP_DELAY_MS | 900 | Odometer start after win bed |
| JACKPOT_ODOMETER_SPIN_MS | 5200 | Per-column spin length |
| JACKPOT_ODOMETER_STAGGER_MS | 1050 | Right→left stop gap |
| JACKPOT_FINAL_SEGMENT_MAX_MS | 750 | Land hold budget |
| JACKPOT_TRANSITION_MAX_MS | 1300 | Riser before wipe |
| JACKPOT_TRANSITION_FADE_MS | 550 | Riser fade tail |
| JACKPOT_POST_FLASH_BEAT_MS | 500 | After flash → wipe |
| JACKPOT_WINNER_PULSE_MS | 460 | One gold pulse |
| JACKPOT_WINNER_PULSE_COUNT | 3 | Pulse repeats |
| WHEEL_TICK_AUDIO_LEAD_MS | 45 | Tick vs visual lead |

## Wheel locals (jackpot-wheel-bonus.tsx)

| Constant | Value |
|----------|-------|
| SPIN_DURATION_MS | 18000 |
| EXTRA_SPINS | 1 |
| SEGMENT_COUNT | 8 |
| LAND_SETTLE_MS | 520 |
| CLOSE_IN_AT | 0.22 |
| WIPE_DURATION_MS | 920 |
| EXCITE_SEGMENTS | 10 |
