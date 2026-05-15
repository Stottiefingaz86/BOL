#!/usr/bin/env node
/**
 * Tightens the VIP banner-tile composition in the home/sports promo
 * carousels. The wrapper around `<VipTierProgressBar bannerTile compact ... />`
 * was using `mt-5` (20px) under the title — too much air for a 300x164 card,
 * leaving the originals note marooned at the bottom.
 *
 * Drops the gap to `mt-3` (12px) which sits the bars right under the title
 * without crowding it. Idempotent: only rewrites the exact 5-class string.
 *
 * Usage:  node scripts/tighten-vip-banner-tile.mjs
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const APP_DIR = join(ROOT, 'app')

const FROM = 'mt-5 flex min-h-0 flex-1 flex-col'
const TO = 'mt-3 flex min-h-0 flex-1 flex-col'

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(full)
    } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
      yield full
    }
  }
}

let scanned = 0
let patched = 0

for await (const file of walk(APP_DIR)) {
  if (file.includes('.backup')) continue
  scanned++
  const original = await readFile(file, 'utf8')
  if (!original.includes(FROM)) continue
  // Only rewrite occurrences immediately followed by a VipTierProgressBar
  // (so we never touch unrelated `mt-5 flex min-h-0 flex-1 flex-col` blocks).
  const next = original.replace(
    /(<div className=")mt-5 flex min-h-0 flex-1 flex-col(">\s*<VipTierProgressBar)/g,
    `$1${TO.replace('mt-5 flex min-h-0 flex-1 flex-col', 'mt-3 flex min-h-0 flex-1 flex-col')}$2`,
  )
  if (next !== original) {
    await writeFile(file, next)
    patched++
    console.log('  tightened', relative(ROOT, file))
  }
}

console.log(`\nScanned ${scanned} .tsx files. Patched ${patched}.`)
