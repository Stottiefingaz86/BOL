import { IconCrown, IconLifebuoy, IconRocket, IconWallet } from '@tabler/icons-react'

/** Labels + default icon order for the pinned footer on primary sidebars (casino, sports, VIP, etc.). */
export const SIDEBAR_FOOTER_VIP_HUB = 'VIP Hub' as const
export const SIDEBAR_FOOTER_PROMOTIONS = 'Promotions' as const
export const SIDEBAR_FOOTER_WALLET = 'Wallet' as const
export const SIDEBAR_FOOTER_NEED_HELP = 'Need Help' as const

export type SidebarFooterNavLabel =
  | typeof SIDEBAR_FOOTER_VIP_HUB
  | typeof SIDEBAR_FOOTER_PROMOTIONS
  | typeof SIDEBAR_FOOTER_WALLET
  | typeof SIDEBAR_FOOTER_NEED_HELP

export const DEFAULT_SIDEBAR_FOOTER_NAV_ITEMS = [
  { icon: IconCrown, label: SIDEBAR_FOOTER_VIP_HUB },
  { icon: IconRocket, label: SIDEBAR_FOOTER_PROMOTIONS },
  { icon: IconWallet, label: SIDEBAR_FOOTER_WALLET },
  { icon: IconLifebuoy, label: SIDEBAR_FOOTER_NEED_HELP },
] as const
