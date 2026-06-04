#!/usr/bin/env python3
"""Restore Sports, Casino, and Poker desktop nav items removed from sports pages."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPORTS = ROOT / "app" / "sports"

STANDARD_NAV = """
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                        showSports && "!text-white"
                      )}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowSports(true)
                        setShowVipRewards(false)
                        window.scrollTo(0, 0)
                      }}
                      data-active={showSports}
                    >
                      {showSports && (
                        <motion.div
                          layoutId="sportsNavPill" layout="position"
                          className="absolute inset-0 rounded-small"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">Sports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                        !showSports && !showVipRewards && activeSubNav !== 'Live' && "!text-white"
                      )}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                      data-active={!showSports && !showVipRewards && activeSubNav !== 'Live'}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        router.push('/casino')
                      }}
                    >
                      {!showSports && !showVipRewards && activeSubNav !== 'Live' && (
                        <motion.div
                          layoutId="sportsNavPill" layout="position"
                          className="absolute inset-0 rounded-small"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">Casino</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "data-[active=true]:bg-white/10 data-[active=true]:text-white",
                        "text-white/70 active:bg-white/10 cursor-pointer"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        router.push('/casino?poker=true')
                      }}
                    >
                      Poker
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  
"""

FOOTBALL_NAV = """
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                        isSportsProductActive && "!text-white"
                      )}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        trackNav('sports', 'Sports')
                        trackPageView('sports', 'Sports')
                        setShowSports(true)
                        setShowVipRewards(false)
                        router.push('/sports/football')
                        window.scrollTo(0, 0)
                      }}
                      data-active={isSportsProductActive}
                    >
                      {isSportsProductActive && (
                        <motion.div
                          layoutId="sportsNavPill" layout="position"
                          className="absolute inset-0 rounded-small"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">Sports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                        !showSports && !showVipRewards && activeSubNav !== 'Live' && "!text-white"
                      )}
                      style={{ pointerEvents: 'auto' } as React.CSSProperties}
                      data-active={!showSports && !showVipRewards && activeSubNav !== 'Live'}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        trackNav('casino', 'Casino')
                        trackPageView('casino', 'Casino')
                        router.push('/casino')
                      }}
                    >
                      {!showSports && !showVipRewards && activeSubNav !== 'Live' && (
                        <motion.div
                          layoutId="sportsNavPill" layout="position"
                          className="absolute inset-0 rounded-small"
                          style={{ backgroundColor: 'var(--ds-primary, #ee3536)' }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                        />
                      )}
                      <span className="relative z-10">Casino</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[80px] px-4 py-2 rounded-small text-sm font-medium justify-center",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "data-[active=true]:bg-white/10 data-[active=true]:text-white",
                        "text-white/70 active:bg-white/10 cursor-pointer"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        trackNav('poker', 'Poker')
                        trackPageView('poker', 'Poker')
                        router.push('/casino?poker=true')
                      }}
                    >
                      Poker
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  
"""

ANCHOR = """                    <div className="w-px h-5 bg-white/20" />
                  </div>
                  
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      className={cn(
                        "h-10 min-w-[100px] px-4 py-2 rounded-small text-sm font-medium justify-center relative overflow-visible data-[active=true]:bg-transparent [&>span]:!flex-initial",
                        "hover:bg-white/5 hover:text-white transition-colors",
                        "text-white/70 cursor-pointer",
                        showVipRewards && "!text-white"
                      )"""


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if 'relative z-10">Sports</span>' in text:
        return False
    if ANCHOR not in text:
        return False

    nav = FOOTBALL_NAV if path.name == "page.tsx" and path.parent.name == "football" else STANDARD_NAV
    replacement = ANCHOR.replace(
        "\n                  \n                  \n                  <SidebarMenuItem>",
        f"\n                  \n                  {nav}                  <SidebarMenuItem>",
        1,
    )
    text = text.replace(ANCHOR, replacement, 1)
    path.write_text(text, encoding="utf-8")
    return True


def main() -> None:
    changed = []
    for p in sorted(SPORTS.rglob("page.tsx")):
        if patch_file(p):
            changed.append(str(p.relative_to(ROOT)))
    print(f"Restored nav in {len(changed)} files")
    for c in changed:
        print(" ", c)


if __name__ == "__main__":
    main()
