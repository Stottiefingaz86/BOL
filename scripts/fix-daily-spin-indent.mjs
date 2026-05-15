#!/usr/bin/env node
/**
 * Tiny follow-up codemod: re-indents the just-injected `<DailySpinCard />`
 * lines to match the surrounding JSX (12-space indent, matching the sibling
 * `<VipBenefitTiles` etc.). The previous codemod inserted them flush-left.
 *
 * Idempotent — only rewrites lines that are still flush-left.
 *
 * Usage:  node scripts/fix-daily-spin-indent.mjs
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const APP_DIR = join(ROOT, 'app')

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
let fixed = 0

for await (const file of walk(APP_DIR)) {
  if (file.includes('.backup')) continue
  scanned++
  const original = await readFile(file, 'utf8')
  if (!original.includes('<DailySpinCard />')) continue
  // Only rewrite the flush-left occurrence introduced by the prior codemod.
  const updated = original.replace(/^<DailySpinCard \/>\s*$/gm, '            <DailySpinCard />')
  if (updated !== original) {
    await writeFile(file, updated)
    fixed++
    console.log('  fixed', relative(ROOT, file))
  }
}

console.log(`\nScanned ${scanned} .tsx files. Fixed indent in ${fixed}.`)
