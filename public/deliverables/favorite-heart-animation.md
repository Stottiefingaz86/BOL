# Favourite heart animation — eng deliverable

Twitter-style **ring + particles** burst when adding a game to favourites. The UI heart icon stays fixed size; only the sprite particles play on top.

**Live demo:** `/casino-favourite_animation`  
**Canonical component:** `components/casino/game-tile-favorite-button.tsx`  
**CSS:** `app/globals.css` → `.twitter-heart-sprite`  
**Asset:** `public/animations/twitter-heart-sprite.png`

This folder is self-contained for handoff. Use the **live demo** as the source of truth for behaviour.

---

## npm / install

```bash
# Required — heart icon used in prod
npm i @tabler/icons-react

# Already needed for portal — you almost certainly have these
# react react-dom
```

**No animation library.** Burst is a CSS sprite sheet (`steps(28)`), not Framer / Lottie.

Tailwind is used for button chrome classes (same as prod). If you don’t use Tailwind, keep the classes as-is after adding Tailwind, or restyle the button shell — **do not change** `.twitter-heart-sprite` CSS.

---

## Setup (must do all three)

1. Copy sprite  
   `assets/twitter-heart-sprite.png` → `public/animations/twitter-heart-sprite.png`

2. Import CSS **once** in app entry / global stylesheet:
   ```ts
   import './twitter-heart-sprite.css'
   ```
   If this CSS is missing, you get a filled heart with **no ring/particles**.

3. Use the button:
   ```tsx
   import { GameTileFavoriteButton } from './game-tile-favorite-button'

   <GameTileFavoriteButton
     favorited={isFavorited}
     onToggle={toggleFavorite}
     variant="tile"
   />
   ```

---

## Why a copy often “doesn’t look the same”

| Mistake | Symptom |
|---------|---------|
| Forgot to import `twitter-heart-sprite.css` | Heart fills pink, no burst |
| Sprite not at `/animations/twitter-heart-sprite.png` | Empty / broken burst layer |
| Scaling / animating the heart icon itself | Icon “pops” bigger — **wrong**; prod keeps icon fixed |
| Firing burst on unfavourite too | Extra burst when removing |
| Portal not to `document.body` | Burst clipped inside overflow:hidden tile |
| Missing mask on `.twitter-heart-sprite` | Big growing sprite heart covers the icon |
| Missing `hue-rotate(-22deg)` filter | Twitter red particles instead of pink |

---

## Interaction model

```
Click heart (not favourited yet)
  → onToggle() immediately (optimistic UI → filled pink-500)
  → measure button center (getBoundingClientRect)
  → portal a 100×100 .twitter-heart-sprite.is-animating to document.body
       fixed, centered on button, z-index 100200
  → CSS steps through 29 frames in 0.8s
  → onAnimationEnd → remove portal

Click again (unfavourite)
  → onToggle() only — no burst
```

**Important:** Burst fires **only on add**, never on remove.

---

## Visual recipe

| Knob | Value | Notes |
|------|-------|-------|
| Frame size | `100×100` px | One cell of the sheet |
| Sheet | `2900×100` | 29 frames left→right |
| Duration | `0.8s` | |
| Timing | `steps(28) forwards` | Discrete frame advance |
| End position | `background-position: -2800px 0` | Last frame |
| Mask | radial hole `transparent 0–20px` | Hides growing sprite heart |
| Filter | `hue-rotate(-22deg) saturate(1.2) brightness(1.05)` | Twitter red → pink-500 |
| Filled icon | Tailwind `pink-500` / `#ec4899` | Matches nav favourites |
| Portal z-index | `100200` | Above drawers / launchers |

### Why mask the center?

The official sprite grows a big heart in the middle. We keep the **Tabler/nav-sized** icon and only show the **ring + floating dots**, so the control never “pops” larger than the rest of the UI.

---

## Files in this package

| File | What |
|------|------|
| `README.md` | This spec |
| `game-tile-favorite-button.tsx` | Prod behaviour (drop-in) |
| `twitter-heart-sprite.css` | Sprite sheet animation + mask + pink hue |
| `assets/twitter-heart-sprite.png` | 29-frame sheet (2900×100 PNG) |
| `example.tsx` | Minimal tile demo |

---

## Variants (prod)

| `variant` | Use |
|-----------|-----|
| `tile` | Absolute top-right on game art (glass circle chrome) |
| `toolbar` | Game launcher header |
| `inline` | Icon-only in composed rows |
| `menu` | Full-width row with “Add / Remove from Favourites” label |

---

## Accessibility

- `aria-label`: “Add to favourites” / “Remove from favourites”
- `aria-pressed={favorited}`
- Burst node is `aria-hidden` + `pointer-events: none`
- `prefers-reduced-motion: reduce` → skip frames, jump to last position

---

## Checklist for replication

- [ ] `npm i @tabler/icons-react`
- [ ] Sprite at `/animations/twitter-heart-sprite.png`
- [ ] CSS classes `.twitter-heart-sprite` + `.is-animating` + keyframes loaded once
- [ ] Heart icon **does not** scale; burst is a separate portaled layer
- [ ] Burst origin = button center in viewport coords
- [ ] Animate **only when favouriting**, not when removing
- [ ] Clean up portal on `animationend`
- [ ] Respect reduced motion
- [ ] Compare against live demo `/casino-favourite_animation`

---

## Source map (repo)

```
components/casino/game-tile-favorite-button.tsx
app/globals.css                          ← .twitter-heart-sprite block
public/animations/twitter-heart-sprite.png
app/casino-favourite_animation/page.tsx  ← isolated demo + download
```
