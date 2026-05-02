#!/usr/bin/env python3
"""Patch sports + navtest sidebars: standard footer VIP Hub / Promotions / Wallet / Need Help."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

IMPORT_LINE = (
    "import { DEFAULT_SIDEBAR_FOOTER_NAV_ITEMS, SIDEBAR_FOOTER_NEED_HELP, "
    "SIDEBAR_FOOTER_PROMOTIONS, SIDEBAR_FOOTER_VIP_HUB, SIDEBAR_FOOTER_WALLET } "
    "from '@/lib/sidebar-footer-nav'\n"
)

FOOTER_BLOCK = """
              <div className="flex-1 min-h-0" />
              <Separator className="bg-white/10 mx-2" />
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {DEFAULT_SIDEBAR_FOOTER_NAV_ITEMS.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <SidebarMenuItem key={`sidebar-footer-${index}`}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  if (isMobile) setOpenMobile(false)
                                  if (item.label === SIDEBAR_FOOTER_VIP_HUB) {
                                    window.dispatchEvent(new CustomEvent('vip:open-drawer'))
                                  } else if (item.label === SIDEBAR_FOOTER_PROMOTIONS) {
                                    router.push('/promotions')
                                  } else if (item.label === SIDEBAR_FOOTER_WALLET) {
                                    openDepositDrawer()
                                  } else if (item.label === SIDEBAR_FOOTER_NEED_HELP) {
                                    console.log('Need Help clicked')
                                  }
                                }}
                                className="w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer text-white/70 hover:text-white hover:bg-white/5"
                              >
                                <Icon strokeWidth={1.5} className="w-5 h-5" />
                                <span>{item.label}</span>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            {sidebarState === 'collapsed' && (
                              <TooltipContent side="right" className="bg-[#2d2d2d] border-white/10 text-white">
                                <p>{item.label}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
"""

ANCHOR = (
    "              </SidebarGroup>\n"
    "              </TooltipProvider>\n"
    "            </SidebarContent>\n"
    "          </Sidebar>\n"
    "          )}\n"
    "          {/* VIP Sidebar - shown in outer sidebar context when VIP is active */}"
)

VIP_REPLACE_PATTERN = re.compile(
    r"\[\s*\n\s*\{ icon: IconBuilding, label: 'Banking' \},\s*\n\s*\{ icon: IconLifebuoy, label: 'Need Help' \},\s*\n\s*\]\.map\(\(item, index\) => \{\s*\n\s*const Icon = item\.icon\s*\n\s*return \(\s*\n\s*<SidebarMenuItem key=\{`vip-bottom-\$\{index\}`\}>\s*\n\s*<Tooltip>\s*\n\s*<TooltipTrigger asChild>\s*\n\s*<SidebarMenuButton\s*\n\s*className=\"w-full justify-start rounded-small h-auto py-2\.5 px-3 text-sm font-medium cursor-pointer text-white/70 hover:text-white hover:bg-white/5\"\s*\n\s*>",
    re.MULTILINE,
)

VIP_REPLACE_WITH = """DEFAULT_SIDEBAR_FOOTER_NAV_ITEMS.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <SidebarMenuItem key={`vip-bottom-${index}`}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (isMobile) setOpenMobile(false)
                                    if (item.label === SIDEBAR_FOOTER_VIP_HUB) {
                                      window.dispatchEvent(new CustomEvent('vip:open-drawer'))
                                    } else if (item.label === SIDEBAR_FOOTER_PROMOTIONS) {
                                      router.push('/promotions')
                                    } else if (item.label === SIDEBAR_FOOTER_WALLET) {
                                      openDepositDrawer()
                                    } else if (item.label === SIDEBAR_FOOTER_NEED_HELP) {
                                      console.log('Need Help clicked')
                                    }
                                  }}
                                  className="w-full justify-start rounded-small h-auto py-2.5 px-3 text-sm font-medium cursor-pointer text-white/70 hover:text-white hover:bg-white/5"
                                >"""

RE_REMOVE_MENU_FOOTER_HANDLERS = re.compile(
    r"\n\s*} else if \(item\.label === 'Loyalty Hub'\) \{.*?"
    r"\n\s*\} else if \(item\.label === 'Banking'\) \{.*?"
    r"\n\s*\} else if \(item\.label === 'Need Help'\) \{.*?"
    r"\n\s*\}",
    re.DOTALL,
)


def ensure_import(text: str) -> str:
    if "from '@/lib/sidebar-footer-nav'" in text:
        return text
    m = re.search(r"(import \{ cn \} from '@/lib/utils'\n)", text)
    if m:
        return text[: m.end()] + IMPORT_LINE + text[m.end() :]
    raise ValueError("Could not find cn import")


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "const sidebarMenuItems = [" not in text:
        return False
    if "{ icon: IconBuilding, label: 'Banking' }" not in text:
        return False

    orig = text

    text = text.replace(
        "    { icon: IconBuilding, label: 'Banking' },\n    { icon: IconLifebuoy, label: 'Need Help' },\n",
        "",
    )
    text = text.replace(
        "                        const showSeparatorAbove = item.label === 'Loyalty Hub'",
        "                        const showSeparatorAbove = false",
    )
    text, _n = RE_REMOVE_MENU_FOOTER_HANDLERS.subn("", text)

    if ANCHOR in text and "`sidebar-footer-${index}`" not in text:
        text = text.replace(
            ANCHOR,
            "              </SidebarGroup>" + FOOTER_BLOCK + "\n              </TooltipProvider>\n            </SidebarContent>\n          </Sidebar>\n          )}\n          {/* VIP Sidebar - shown in outer sidebar context when VIP is active */}",
            1,
        )

    text, vip_n = VIP_REPLACE_PATTERN.subn(VIP_REPLACE_WITH, text)

    changed = text != orig
    if changed or vip_n:
        text = ensure_import(text)
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    paths = sorted(Path(ROOT / "app/sports").rglob("page.tsx"))
    paths.append(ROOT / "app/navtest/page.tsx")
    n = 0
    for p in paths:
        if not p.is_file():
            continue
        try:
            if patch_file(p):
                n += 1
                print("patched", p.relative_to(ROOT))
        except Exception as e:
            print("FAIL", p, e)
    print("done, patched", n, "files")


if __name__ == "__main__":
    main()
