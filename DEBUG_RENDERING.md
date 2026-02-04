# Debug: Character Not Showing

## Potential Issues:

1. **Image Loading**: Sprite images might not be loading
   - Check: Browser Console → Network tab → Look for `/walk/image 1.png`
   - Should return 200 OK

2. **CSS Positioning**: Character might be positioned off-screen
   - Check: Element starts at `x: '-100vw'` (off-screen left)
   - Should animate to `x: 0` over 3 seconds

3. **Z-index**: Character might be behind other elements
   - Character container has `zIndex: 100`
   - Should be above most elements

4. **Conditional Rendering**: Character might be hidden by conditions
   - Renders when: `(isWalkingOut || !showLilly)` is true
   - Both should be false initially, so character should show

5. **Chat Hidden**: Chat only shows when `!showLilly && !isWalkingOut`
   - Both should be false initially, so chat should show

## Quick Fix Test:

Add this to see if character container is rendering:
- Open browser DevTools
- Find the `<div>` with `z-index: 100` in the center area
- Check if it has any child elements
- Check computed styles (might be hidden or positioned incorrectly)
