#!/usr/bin/env python3
"""Patch VIP hub scroll areas + crown buttons for logged-out support."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SCROLL_IMPORT = "import { VipHubScrollBody } from '@/components/vip/vip-hub-scroll-body'\n"
CROWN_IMPORT = "import { VipCrownNavButton } from '@/components/vip/vip-crown-nav-button'\n"

SCROLL_OPEN = re.compile(
    r'      <div className=\{cn\("px-4 pt-4 overflow-y-auto flex-1 min-h-0", isMobile \? "pb-6" : "pb-2"\)\} style=\{\{ WebkitOverflowScrolling: \'touch\', overflowY: \'auto\', flex: \'1 1 auto\', minHeight: 0, paddingBottom: isMobile \? \'env\(safe-area-inset-bottom, 24px\)\' : undefined \}\}>'
)

SCROLL_OPEN_REPL = "      <VipHubScrollBody isMobile={isMobile}>"

# Desktop crown — logged-in gated variant (premier-league / home)
DESKTOP_CROWN_GATED_OLD = """            {!isMobile && isUserLoggedIn ? (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('VIP button clicked')
                  openVipDrawer()
                }}
                className={cn(
                  "rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center transition-colors",
                  "hover:bg-yellow-400/30 hover:border-yellow-400/40",
                  "active:bg-gray-500/20",
                  vipDrawerOpen && "bg-yellow-400/30 border-yellow-400/40",
                  "h-8 w-8"
                )}
                style={{ pointerEvents: 'auto', zIndex: 101, position: 'relative', cursor: 'pointer' }}
              >
                <IconCrown className="text-yellow-400 w-4 h-4" />
              </button>
            ) : null}"""

DESKTOP_CROWN_GATED_NEW = """            {!isMobile ? (
              <VipCrownNavButton active={vipDrawerOpen} onClick={openVipDrawer} />
            ) : null}"""

# Desktop crown — always visible variant (most sports/casino pages)
DESKTOP_CROWN_STD_OLD = """            {!isMobile ? (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('VIP button clicked')
                  openVipDrawer()
                }}
                className={cn(
                  "rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center transition-colors",
                  "hover:bg-yellow-400/30 hover:border-yellow-400/40",
                  "active:bg-gray-500/20",
                  vipDrawerOpen && "bg-yellow-400/30 border-yellow-400/40",
                  "h-8 w-8"
                )}
                style={{ pointerEvents: 'auto', zIndex: 101, position: 'relative', cursor: 'pointer' }}
              >
                <IconCrown className="text-yellow-400 w-4 h-4" />
              </button>
            ) : null}"""

DESKTOP_CROWN_STD_NEW = DESKTOP_CROWN_GATED_NEW

MOBILE_CROWN_GATED_OLD = """            {isMobile && isUserLoggedIn && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('VIP button clicked')
                  openVipDrawer()
                }}
                className={cn(
                  "rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center transition-colors",
                  "hover:bg-yellow-400/30 hover:border-yellow-400/40",
                  "active:bg-gray-500/20",
                  vipDrawerOpen && "bg-yellow-400/30 border-yellow-400/40",
                  "h-8 w-8"
                )}
                style={{ pointerEvents: 'auto', zIndex: 101, position: 'relative', cursor: 'pointer' }}
              >
                <IconCrown className="text-yellow-400 w-4 h-4" />
              </button>
            )}"""

MOBILE_CROWN_GATED_NEW = """            {isMobile && (
              <VipCrownNavButton active={vipDrawerOpen} onClick={openVipDrawer} />
            )}"""

MOBILE_CROWN_STD_OLD = """            {isMobile && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('VIP button clicked')
                  openVipDrawer()
                }}
                className={cn(
                  "rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center transition-colors",
                  "hover:bg-yellow-400/30 hover:border-yellow-400/40",
                  "active:bg-gray-500/20",
                  vipDrawerOpen && "bg-yellow-400/30 border-yellow-400/40",
                  "h-8 w-8"
                )}
                style={{ pointerEvents: 'auto', zIndex: 101, position: 'relative', cursor: 'pointer' }}
              >
                <IconCrown className="text-yellow-400 w-4 h-4" />
              </button>
            )}"""

MOBILE_CROWN_STD_NEW = MOBILE_CROWN_GATED_NEW


def ensure_import(text: str, import_line: str) -> str:
    if import_line.strip() in text:
        return text
    marker = "'use client'\n"
    if marker in text:
        return text.replace(marker, marker + "\n" + import_line, 1)
    return import_line + text


def close_vip_scroll_body(text: str) -> str:
    """Replace the scroll container's closing </div> with </VipHubScrollBody>."""
    if "<VipHubScrollBody" not in text or "</VipHubScrollBody>" in text:
        return text

    open_idx = text.find("<VipHubScrollBody")
    if open_idx == -1:
        return text

    # Limit to the containing function so we don't match unrelated JSX later in the file.
    func_end = text.find("\nfunction ", open_idx + 1)
    if func_end == -1:
        func_end = len(text)

    segment = text[open_idx:func_end]
    close_pattern = re.compile(r"</div>(\s*\n\s*)</div>(\s*\n\s*\))")
    matches = list(close_pattern.finditer(segment))
    if not matches:
        return text

    match = matches[-1]
    abs_start = open_idx + match.start()
    abs_end = open_idx + match.end()

    before = text[:abs_start]
    after = text[abs_end:]
    return before + "</VipHubScrollBody>" + match.group(1) + "</div>" + match.group(2) + after


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    orig = text

    if SCROLL_OPEN.search(text):
        text = ensure_import(text, SCROLL_IMPORT)
        text = SCROLL_OPEN.sub(SCROLL_OPEN_REPL, text, count=1)
        text = close_vip_scroll_body(text)

    if DESKTOP_CROWN_GATED_OLD in text:
        text = ensure_import(text, CROWN_IMPORT)
        text = text.replace(DESKTOP_CROWN_GATED_OLD, DESKTOP_CROWN_GATED_NEW, 1)
    elif DESKTOP_CROWN_STD_OLD in text:
        text = ensure_import(text, CROWN_IMPORT)
        text = text.replace(DESKTOP_CROWN_STD_OLD, DESKTOP_CROWN_STD_NEW, 1)

    if MOBILE_CROWN_GATED_OLD in text:
        text = ensure_import(text, CROWN_IMPORT)
        text = text.replace(MOBILE_CROWN_GATED_OLD, MOBILE_CROWN_GATED_NEW, 1)
    elif MOBILE_CROWN_STD_OLD in text:
        text = ensure_import(text, CROWN_IMPORT)
        text = text.replace(MOBILE_CROWN_STD_OLD, MOBILE_CROWN_STD_NEW, 1)

    if text != orig:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    changed = []
    for p in sorted(ROOT.glob("app/**/*.tsx")):
        if patch_file(p):
            changed.append(str(p.relative_to(ROOT)))
    print(f"Patched {len(changed)} files")
    for c in changed:
        print(" ", c)


if __name__ == "__main__":
    main()
