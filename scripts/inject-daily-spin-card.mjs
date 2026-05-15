#!/usr/bin/env node
/**
 * One-shot codemod: every page that renders its own `VipDrawerContent` copy of
 * the VIP Hub also needs the new <DailySpinCard /> right under the tier
 * progress card in the Overview tab. Rather than hand-editing 70+ duplicated
 * page files, this script:
 *
 *  1. Imports `DailySpinCard` next to the existing `VipTierProgressBar` import.
 *  2. Inserts `<DailySpinCard />` immediately after the closing `</Card>` that
 *     wraps the VIP tier progress card inside the `vipActiveTab === 'Overview'`
 *     branch — using a single, contiguous block match (no greedy backtracking
 *     to unrelated <Card> elements elsewhere in the file).
 *
 * Idempotent — re-running does nothing on already-patched files.
 *
 * Usage:  node scripts/inject-daily-spin-card.mjs
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const APP_DIR = join(ROOT, 'app')

const IMPORT_LINE = "import { VipTierProgressBar } from '@/components/vip/vip-tier-progress-bar'"
const IMPORT_INSERT = `import { VipTierProgressBar } from '@/components/vip/vip-tier-progress-bar'
import { DailySpinCard } from '@/components/promotions/daily-spin-card'`

/**
 * Conservative match: the exact 5-line VIP tier progress card that lives
 * inside every duplicated `vipActiveTab === 'Overview'` branch. We match
 * `<CardContent>`, `<CardTitle>`, `<VipTierProgressBar.../>`, `</CardContent>`,
 * `</Card>` as one contiguous block with NO arbitrary `[\s\S]*?` between
 * them, so the regex engine cannot backtrack into unrelated cards elsewhere
 * in the file (e.g. banner carousels).
 *
 * Capture groups:
 *   1 — the entire block (Card open through Card close)
 *   2 — the trailing newline + indentation up to the next sibling
 */
const CARD_BLOCK_RE = /(<Card className="bg-white\/5 border-white\/10">[ \t]*\n[ \t]*<CardContent className="p-4">[ \t]*\n[ \t]*<CardTitle [^>]*>[^<]*<\/CardTitle>[ \t]*\n[ \t]*<VipTierProgressBar [^/]*\/>[ \t]*\n[ \t]*<\/CardContent>[ \t]*\n[ \t]*<\/Card>)([ \t]*\n)(?![ \t]*\n[ \t]*<DailySpinCard)/g

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
let importPatched = 0
let cardPatched = 0
let alreadyImported = 0
let alreadyInserted = 0

for await (const file of walk(APP_DIR)) {
  // Skip backup files left behind by older edits.
  if (file.includes('.backup')) continue
  scanned++
  let src = await readFile(file, 'utf8')
  if (!src.includes('VipTierProgressBar')) continue

  let changed = false

  if (!src.includes("from '@/components/promotions/daily-spin-card'")) {
    if (src.includes(IMPORT_LINE)) {
      src = src.replace(IMPORT_LINE, IMPORT_INSERT)
      changed = true
      importPatched++
    }
  } else {
    alreadyImported++
  }

  // Track how many distinct VIP cards exist so we know whether to credit a
  // file as "already inserted" vs "no progress-card present at all".
  const cardMatchCount = (src.match(/<Card className="bg-white\/5 border-white\/10">[ \t]*\n[ \t]*<CardContent className="p-4">[ \t]*\n[ \t]*<CardTitle [^>]*>[^<]*<\/CardTitle>[ \t]*\n[ \t]*<VipTierProgressBar /g) || []).length

  const before = src
  src = src.replace(CARD_BLOCK_RE, (_, block, trailingWs) => {
    // Preserve the original indentation of the next sibling so the inserted
    // <DailySpinCard /> lines up with surrounding JSX.
    const indentMatch = block.match(/^(\s*)<Card/)
    const indent = indentMatch ? indentMatch[1].replace(/^\n*/, '') : '            '
    return `${block}${trailingWs}\n${indent}<DailySpinCard />\n`
  })
  if (src !== before) {
    changed = true
    cardPatched++
  } else if (cardMatchCount > 0 && src.includes('<DailySpinCard />')) {
    alreadyInserted++
  }

  if (changed) {
    await writeFile(file, src)
    console.log('  patched', relative(ROOT, file))
  }
}

console.log(`\nScanned ${scanned} .tsx files.`)
console.log(`  imports added: ${importPatched}`)
console.log(`  cards inserted: ${cardPatched}`)
console.log(`  already-imported: ${alreadyImported}`)
console.log(`  already-inserted: ${alreadyInserted}`)
