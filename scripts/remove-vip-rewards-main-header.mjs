#!/usr/bin/env node
/**
 * Removes "VIP Rewards" from the main site header:
 * - Mobile quick-links rows ({ label: 'VIP Rewards', onClick | product })
 * - visibleProducts.vipRewards spread fragments in those arrays
 * - Desktop SidebarMenuItem that shows VIP Rewards (wrapped or bare)
 *
 * Does NOT remove sidebar drawer rows that use { page: 'vipRewards' }.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, acc)
    else if (name === "page.tsx") acc.push(p)
  }
  return acc
}

function strip(src) {
  let s = src

  // Spread fragments in quick-link arrays
  s = s.replace(
    /\r?\n[ \t]*\.\.\.\(visibleProducts\.vipRewards \? \[[^\]]*\] : \[\]\),?/g,
    "",
  )

  // Quick link objects (mobile strip / casino) — not `page: 'vipRewards'` sidebar rows
  s = s.replace(
    /\r?\n[ \t]*\{ label: 'VIP Rewards',[^\n]*(?:onClick|product):[^\n]*\r?\n/g,
    "",
  )

  // {visibleProducts.vipRewards && ( ... SidebarMenuItem ... VIP Rewards ... )}
  s = s.replace(
    /\r?\n[ \t]*\{visibleProducts\.vipRewards && \(\r?\n[ \t]*<SidebarMenuItem>[\s\S]*?<span className="relative z-10">VIP Rewards<\/span>[\s\S]*?<\/SidebarMenuItem>\r?\n[ \t]*\)\}\r?\n/g,
    "\n",
  )

  // Bare desktop header SidebarMenuItem (home, sports, etc.) — z-10 span
  s = s.replace(
    /\r?\n[ \t]*<SidebarMenuItem>\r?\n[ \t]*<SidebarMenuButton[\s\S]*?<span className="relative z-10">VIP Rewards<\/span>[\s\S]*?<\/SidebarMenuButton>\r?\n[ \t]*<\/SidebarMenuItem>\r?\n/g,
    "\n",
  )

  // Homepage-style: raw text node "VIP Rewards" inside SidebarMenuButton (no span)
  s = s.replace(
    /\r?\n[ \t]*<SidebarMenuItem>\r?\n[ \t]*<SidebarMenuButton[\s\S]*?trackNav\('vip-rewards'[\s\S]*?>[\s\r\n\t]*VIP Rewards[\s\r\n\t]*<\/SidebarMenuButton>\r?\n[ \t]*<\/SidebarMenuItem>\r?\n/g,
    "\n",
  )

  return s
}

const files = walk("app")
let updated = 0
for (const f of files) {
  const orig = readFileSync(f, "utf8")
  const next = strip(orig)
  if (next !== orig) {
    writeFileSync(f, next)
    updated++
    console.log(f)
  }
}
console.log(`Updated ${updated} file(s).`)
