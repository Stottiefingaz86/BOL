#!/usr/bin/env node
// Inject a `vip:close-drawer` event listener next to every existing
// `vip:open-drawer` listener so the VIP hub closes when the Daily Spin
// popup opens (avoids the "modal stacked on top of a modal" feel).

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else if (name.endsWith(".tsx")) out.push(p)
  }
  return out
}

const FILES = walk("app").filter((f) =>
  readFileSync(f, "utf8").includes("vip:open-drawer"),
)

const SRC_RE = /useEffect\(\(\) => \{\s*const handler = \(\) => openVipDrawer\(\)\s*if \(typeof window === 'undefined'\) return\s*window\.addEventListener\('vip:open-drawer', handler\)\s*return \(\) => window\.removeEventListener\('vip:open-drawer', handler\)\s*\}, \[openVipDrawer\]\)/

const REPLACEMENT = `useEffect(() => {
    const handler = () => openVipDrawer()
    if (typeof window === 'undefined') return
    window.addEventListener('vip:open-drawer', handler)
    return () => window.removeEventListener('vip:open-drawer', handler)
  }, [openVipDrawer])

  // Daily Spin (and other promo popups) dispatch this event so the VIP hub
  // doesn't stay stacked behind their dialog. Keeps each modal feeling like
  // the primary thing on screen.
  useEffect(() => {
    const handler = () => setVipDrawerOpen(false)
    if (typeof window === 'undefined') return
    window.addEventListener('vip:close-drawer', handler)
    return () => window.removeEventListener('vip:close-drawer', handler)
  }, [])`

let updated = 0
let skipped = 0

for (const file of FILES) {
  const src = readFileSync(file, "utf8")

  if (src.includes("vip:close-drawer")) {
    skipped++
    continue
  }

  if (!SRC_RE.test(src)) {
    console.warn(`SKIP (no match): ${file}`)
    skipped++
    continue
  }

  const next = src.replace(SRC_RE, REPLACEMENT)
  writeFileSync(file, next)
  updated++
}

console.log(`Updated: ${updated}, Skipped: ${skipped}`)
