import type { LeagueGroup, OddsCell, SportsEvent } from './mock-data'

/** Which event-page tab(s) a market belongs to. */
export type MarketGroup = 'popular' | 'builder' | 'players' | 'quarters' | 'halves' | 'team' | 'specials'

export interface MarketColumnHeader {
  label: string
  logo?: string
}

/** Two rows (home / away) — spread, moneyline, total. */
export interface TwoWayMarket {
  kind: 'two-way'
  id: string
  name: string
  groups: MarketGroup[]
  rows: { id: string; label: string; logo?: string; cell: OddsCell }[]
}

/** Row label on the left, N odds columns with headers (Over / Under, Home / Away, Over / Exactly / Under …). */
export interface TableMarket {
  kind: 'table'
  id: string
  name: string
  groups: MarketGroup[]
  columns: MarketColumnHeader[]
  rows: { id: string; label: string; cells: (OddsCell | null)[] }[]
}

/** Columns of stacked selections (correct score / winning margin) — Home | Tie | Away. */
export interface GridMarket {
  kind: 'grid'
  id: string
  name: string
  groups: MarketGroup[]
  columns: { header: MarketColumnHeader; cells: OddsCell[] }[]
}

/** Player rows with an escalating ladder of selections (1+, 2+, 3+ …). */
export interface PlayerPropsMarket {
  kind: 'players'
  id: string
  name: string
  groups: MarketGroup[]
  teams: { code: string; name: string; logo: string }[]
  players: { id: string; name: string; number: number; teamCode: string; cells: OddsCell[] }[]
}

export type EventMarket = TwoWayMarket | TableMarket | GridMarket | PlayerPropsMarket

// ─── Helpers ─────────────────────────────────────────────────

const cell = (id: string, odds: string, line?: string): OddsCell => ({ id, odds, line })

const FIRST = ['Jalen', 'Marcus', 'DeAndre', 'Tyler', 'Chris', 'Devin', 'Jordan', 'Kenny', 'Malik', 'Brandon', 'Travis', 'Cooper']
const LAST = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Wilson', 'Taylor', 'Walker', 'Hill', 'Allen', 'Young']

function seeded(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = (h ^ str.charCodeAt(i)) * 16777619
  return () => {
    h = (h * 1664525 + 1013904223) >>> 0
    return h / 4294967296
  }
}

function players(eventId: string, teamCode: string, count: number) {
  const rnd = seeded(`${eventId}-${teamCode}`)
  const used = new Set<string>()
  const out: { name: string; number: number }[] = []
  while (out.length < count) {
    const name = `${FIRST[Math.floor(rnd() * FIRST.length)]} ${LAST[Math.floor(rnd() * LAST.length)]}`
    if (used.has(name)) continue
    used.add(name)
    out.push({ name, number: 1 + Math.floor(rnd() * 89) })
  }
  return out
}

const american = (p: number) => (p >= 2 ? `+${Math.round((p - 1) * 100)}` : `-${Math.round(100 / (p - 1))}`)

// ─── Builder ─────────────────────────────────────────────────

export function buildEventMarkets(event: SportsEvent, league: LeagueGroup): EventMarket[] {
  const { home, away } = event
  const id = event.id
  const isBasketball = league.sport === 'basketball'
  const byName = (re: RegExp) => event.markets.find((m) => re.test(m.name))
  const spread = byName(/^spread$/i)
  const ml = byName(/^moneyline$/i)
  const total = byName(/^total$/i)
  const totalLine = total?.cells[0]?.line?.replace(/^O\s*/, '') ?? (isBasketball ? '224.5' : '45.5')
  const totalNum = parseFloat(totalLine)

  const markets: EventMarket[] = []

  // Game lines — the same three headline markets as the sports home rows
  for (const m of [spread, ml, total]) {
    if (!m) continue
    const isTotal = /total/i.test(m.name)
    markets.push({
      kind: 'two-way',
      id: m.id,
      name: m.name,
      groups: ['popular'],
      rows: m.cells.map((c, i) => {
        const team = i === 0 ? home : away
        return {
          id: c.id,
          label: isTotal ? (i === 0 ? 'Over' : 'Under') : team.name,
          logo: isTotal ? undefined : team.logo,
          cell: c,
        }
      }),
    })
  }

  // Result by period — Home / Away columns headed by the team logos
  const periods = isBasketball
    ? ['Game', '1st Half', '2nd Half', '1st Quarter', '2nd Quarter']
    : ['Game', '1st Half', '2nd Half', '1st Quarter', '2nd Quarter']
  const mlHome = ml?.cells[0]?.odds ?? '-130'
  const mlAway = ml?.cells[1]?.odds ?? '+110'
  markets.push({
    kind: 'table',
    id: `${id}-result`,
    name: 'Result',
    groups: ['popular', 'halves', 'quarters'],
    columns: [
      { label: home.code, logo: home.logo },
      { label: away.code, logo: away.logo },
    ],
    rows: periods.map((p, i) => ({
      id: `${id}-result-${i}`,
      label: p,
      cells: [
        cell(`${id}-result-${i}-h`, i === 0 ? mlHome : ['-115', '+105', '-105', '+100'][i % 4]),
        cell(`${id}-result-${i}-a`, i === 0 ? mlAway : ['-105', '-125', '-115', '-120'][i % 4]),
      ],
    })),
  })

  // Total points by period — Over / Under table
  const periodTotals = isBasketball
    ? [totalNum, totalNum / 2 + 0.5, totalNum / 2 - 1.5, totalNum / 4 + 0.5, totalNum / 4 - 0.5]
    : [totalNum, totalNum / 2 - 1, totalNum / 2, totalNum / 4 - 0.5, totalNum / 4 + 0.5]
  markets.push({
    kind: 'table',
    id: `${id}-totals`,
    name: 'Total Points',
    groups: ['popular', 'halves', 'quarters'],
    columns: [{ label: 'Over' }, { label: 'Under' }],
    rows: periods.map((p, i) => {
      const line = periodTotals[i].toFixed(1)
      return {
        id: `${id}-totals-${i}`,
        label: p,
        cells: [
          cell(`${id}-totals-${i}-o`, ['-110', '-115', '-105', '-110', '-120'][i], `O ${line}`),
          cell(`${id}-totals-${i}-u`, ['-110', '-105', '-115', '-110', '+100'][i], `U ${line}`),
        ],
      }
    }),
  })

  // Team totals — Over / Under per team, logos in the row labels via the grid header
  markets.push({
    kind: 'table',
    id: `${id}-team-totals`,
    name: 'Team Total Points',
    groups: ['popular', 'team'],
    columns: [{ label: 'Over' }, { label: 'Under' }],
    rows: [home, away].map((t, i) => {
      const line = (isBasketball ? totalNum / 2 + (i === 0 ? 2.5 : -2.5) : totalNum / 2 + (i === 0 ? 1.5 : -1.5)).toFixed(1)
      return {
        id: `${id}-tt-${i}`,
        label: t.name,
        cells: [cell(`${id}-tt-${i}-o`, '-115', `O ${line}`), cell(`${id}-tt-${i}-u`, '-105', `U ${line}`)],
      }
    }),
  })

  // Winning margin — Home | Tie | Away stacks
  const margins = isBasketball
    ? ['1-5', '6-10', '11-15', '16-20', '21+']
    : ['1-6', '7-12', '13-18', '19-24', '25+']
  const marginOdds = isBasketball
    ? [['+450', '+500', '+650', '+900', '+800'], ['+550', '+600', '+800', '+1100', '+1000']]
    : [['+400', '+450', '+600', '+800', '+700'], ['+500', '+550', '+750', '+1000', '+900']]
  markets.push({
    kind: 'grid',
    id: `${id}-margin`,
    name: 'Winning Margin',
    groups: ['popular', 'specials'],
    columns: [
      {
        header: { label: home.name, logo: home.logo },
        cells: margins.map((m, i) => cell(`${id}-margin-h-${i}`, marginOdds[0][i], m)),
      },
      {
        header: { label: isBasketball ? 'Overtime' : 'Tie' },
        cells: [cell(`${id}-margin-tie`, isBasketball ? '+900' : '+6000', isBasketball ? 'OT' : 'Tie')],
      },
      {
        header: { label: away.name, logo: away.logo },
        cells: margins.map((m, i) => cell(`${id}-margin-a-${i}`, marginOdds[1][i], m)),
      },
    ],
  })

  // Player props — ladder of selections
  const ladder = isBasketball ? ['15+', '20+', '25+', '30+', '35+'] : ['1+', '2+', '3+']
  const propName = isBasketball ? 'Player Points' : 'Player Touchdowns'
  const homePlayers = players(id, home.code, 5)
  const awayPlayers = players(id, away.code, 5)
  const baseProb = isBasketball ? [1.4, 1.9, 2.9, 5, 9] : [1.6, 4.5, 15]
  markets.push({
    kind: 'players',
    id: `${id}-players`,
    name: propName,
    groups: ['popular', 'players'],
    teams: [
      { code: home.code, name: home.name, logo: home.logo },
      { code: away.code, name: away.name, logo: away.logo },
    ],
    players: [
      ...homePlayers.map((p, i) => ({
        id: `${id}-pp-h-${i}`,
        name: p.name,
        number: p.number,
        teamCode: home.code,
        cells: ladder.map((l, j) =>
          cell(`${id}-pp-h-${i}-${j}`, american(baseProb[j] * (1 + i * 0.18)), l)
        ),
      })),
      ...awayPlayers.map((p, i) => ({
        id: `${id}-pp-a-${i}`,
        name: p.name,
        number: p.number,
        teamCode: away.code,
        cells: ladder.map((l, j) =>
          cell(`${id}-pp-a-${i}-${j}`, american(baseProb[j] * (1 + i * 0.22)), l)
        ),
      })),
    ],
  })

  // Exact count — Over / Exactly / Under
  const exactName = isBasketball ? 'Total 3-Pointers' : 'Total Touchdowns'
  const exactRows = isBasketball ? [20, 21, 22, 23, 24] : [4, 5, 6, 7, 8]
  markets.push({
    kind: 'table',
    id: `${id}-exact`,
    name: exactName,
    groups: ['specials', 'team'],
    columns: [{ label: 'Over' }, { label: 'Exactly' }, { label: 'Under' }],
    rows: exactRows.map((n, i) => ({
      id: `${id}-exact-${i}`,
      label: `${n} ${isBasketball ? 'threes' : 'TDs'}`,
      cells: [
        cell(`${id}-exact-${i}-o`, ['-165', '+105', '+230', '+400', '+700'][i]),
        cell(`${id}-exact-${i}-e`, ['+450', '+400', '+450', '+550', '+700'][i]),
        cell(`${id}-exact-${i}-u`, ['+500', '+220', '+105', '-150', '-260'][i]),
      ],
    })),
  })

  // Quarter / half spreads from the row markets (already modelled on the home rows)
  for (const m of event.markets) {
    if (/spread|moneyline/i.test(m.name) && /half|quarter/i.test(m.name)) {
      markets.push({
        kind: 'two-way',
        id: m.id,
        name: m.name,
        groups: [/half/i.test(m.name) ? 'halves' : 'quarters'],
        rows: m.cells.map((c, i) => {
          const team = i === 0 ? home : away
          return { id: c.id, label: team.name, logo: team.logo, cell: c }
        }),
      })
    }
  }

  return markets
}
