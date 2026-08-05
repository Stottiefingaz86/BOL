/**
 * Runtime animation extractor for the BOL reference site.
 * Pulls Framer Motion props (via React fiber), Tailwind/CSS animation
 * classes, computed styles, and matching @keyframes from stylesheets.
 */

export type FramerSnippet = {
  componentName: string
  props: Record<string, unknown>
  source: 'fiber'
}

export type CssAnimationHit = {
  className: string
  ruleCss: string | null
  keyframeNames: string[]
}

export type AnimationExtract = {
  tagName: string
  elementLabel: string
  classList: string[]
  animationClasses: string[]
  transitionClasses: string[]
  cssHits: CssAnimationHit[]
  keyframes: { name: string; css: string }[]
  computed: {
    animation: string
    transition: string
    transform: string
  }
  framer: FramerSnippet | null
  ancestors: string[]
}

const ANIM_CLASS_RE =
  /^(?:animate-|motion-|tile-shimmer|jackpot-|live-scan|chat-(?:panel|slide)|hero-(?:smoke|ember)|shimmer)/i

const TRANSITION_CLASS_RE =
  /^(?:transition|duration-|ease-|delay-|origin-|will-change)/i

const FRAMER_PROP_KEYS = [
  'initial',
  'animate',
  'exit',
  'transition',
  'variants',
  'whileHover',
  'whileTap',
  'whileFocus',
  'whileDrag',
  'whileInView',
  'layout',
  'layoutId',
  'layoutDependency',
  'drag',
  'dragConstraints',
  'dragElastic',
  'dragMomentum',
  'style',
] as const

type FiberNode = {
  type?: unknown
  elementType?: unknown
  memoizedProps?: Record<string, unknown> | null
  pendingProps?: Record<string, unknown> | null
  return?: FiberNode | null
  _debugSource?: { fileName?: string; lineNumber?: number }
}

function getFiber(el: Element): FiberNode | null {
  const key = Object.keys(el).find(
    (k) => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$')
  )
  if (!key) return null
  return (el as unknown as Record<string, FiberNode>)[key] ?? null
}

function componentDisplayName(type: unknown): string {
  if (!type) return 'Unknown'
  if (typeof type === 'string') return type
  if (typeof type === 'function') {
    const fn = type as { displayName?: string; name?: string }
    return fn.displayName || fn.name || 'Anonymous'
  }
  if (typeof type === 'object' && type !== null) {
    const obj = type as {
      displayName?: string
      name?: string
      render?: { displayName?: string; name?: string }
    }
    return (
      obj.displayName ||
      obj.name ||
      obj.render?.displayName ||
      obj.render?.name ||
      'Component'
    )
  }
  return 'Component'
}

function isMotionType(type: unknown): boolean {
  const name = componentDisplayName(type).toLowerCase()
  if (name.includes('motion') || name.startsWith('motion.')) return true
  if (typeof type === 'object' && type !== null) {
    const t = type as { $$typeof?: unknown; render?: unknown; _context?: unknown }
    // framer-motion custom components often expose render + motion metadata
    if (typeof (type as { isMotionComponent?: boolean }).isMotionComponent === 'boolean') {
      return Boolean((type as { isMotionComponent?: boolean }).isMotionComponent)
    }
    void t
  }
  return false
}

function pickFramerProps(props: Record<string, unknown> | null | undefined): Record<string, unknown> {
  if (!props) return {}
  const out: Record<string, unknown> = {}
  for (const key of FRAMER_PROP_KEYS) {
    if (key in props && props[key] !== undefined) {
      out[key] = props[key]
    }
  }
  return out
}

function serializeValue(value: unknown, depth = 0): unknown {
  if (depth > 4) return '[MaxDepth]'
  if (value == null) return value
  if (typeof value === 'function') return '[Function]'
  if (typeof value === 'symbol') return String(value)
  if (typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map((v) => serializeValue(v, depth + 1))
  const obj = value as Record<string, unknown>
  // DOM / React nodes
  if (typeof window !== 'undefined' && value instanceof Element) {
    return `[Element ${value.tagName.toLowerCase()}]`
  }
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'children' || k === 'ref') continue
    out[k] = serializeValue(v, depth + 1)
  }
  return out
}

function extractFramerFromFiber(fiber: FiberNode | null): FramerSnippet | null {
  let current: FiberNode | null = fiber
  let hops = 0
  while (current && hops < 40) {
    const type = current.type ?? current.elementType
    const props = current.memoizedProps ?? current.pendingProps ?? null
    const framerProps = pickFramerProps(props)
    const hasFramer = Object.keys(framerProps).length > 0
    const motionLike = isMotionType(type) || hasFramer

    if (motionLike && hasFramer) {
      return {
        componentName: componentDisplayName(type),
        props: serializeValue(framerProps) as Record<string, unknown>,
        source: 'fiber',
      }
    }

    current = current.return ?? null
    hops += 1
  }
  return null
}

function collectAncestorLabels(fiber: FiberNode | null, limit = 6): string[] {
  const labels: string[] = []
  let current = fiber
  let hops = 0
  while (current && hops < 50 && labels.length < limit) {
    const type = current.type ?? current.elementType
    if (typeof type === 'function' || (typeof type === 'object' && type !== null)) {
      const name = componentDisplayName(type)
      if (
        name &&
        name !== 'Anonymous' &&
        name !== 'Unknown' &&
        !name.startsWith('Motion') &&
        name !== 'Provider' &&
        !labels.includes(name)
      ) {
        labels.push(name)
      }
    }
    current = current.return ?? null
    hops += 1
  }
  return labels
}

function stylesheetRules(): CSSRule[] {
  const rules: CSSRule[] = []
  if (typeof document === 'undefined') return rules
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      rules.push(...Array.from(sheet.cssRules))
    } catch {
      // cross-origin stylesheets
    }
  }
  return rules
}

function findKeyframeCss(name: string, rules: CSSRule[]): string | null {
  for (const rule of rules) {
    if (rule instanceof CSSKeyframesRule && rule.name === name) {
      return rule.cssText
    }
  }
  return null
}

function findClassRuleCss(className: string, rules: CSSRule[]): string | null {
  const escaped =
    typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
      ? CSS.escape(className)
      : className.replace(/[^\w-]/g, '\\$&')
  const needle = `.${escaped}`
  const matches: string[] = []
  for (const rule of rules) {
    if (!(rule instanceof CSSStyleRule)) continue
    if (!rule.selectorText.split(',').some((s) => s.trim().includes(needle))) continue
    matches.push(rule.cssText)
  }
  return matches.length ? matches.join('\n\n') : null
}

function parseKeyframeNamesFromAnimation(animation: string): string[] {
  if (!animation || animation === 'none') return []
  // "name duration timing-function …" — name is first token, may be comma-separated lists
  return animation
    .split(',')
    .map((part) => part.trim().split(/\s+/)[0])
    .filter((n) => n && n !== 'none' && !/^\d/.test(n))
}

function isAnimationClass(cls: string): boolean {
  if (ANIM_CLASS_RE.test(cls)) return true
  if (cls.startsWith('animate-[') || cls.includes('animate-[')) return true
  return false
}

function isTransitionClass(cls: string): boolean {
  return TRANSITION_CLASS_RE.test(cls)
}

function elementLabel(el: Element): string {
  const id = el.id ? `#${el.id}` : ''
  const cls = Array.from(el.classList)
    .slice(0, 3)
    .map((c) => `.${c}`)
    .join('')
  return `${el.tagName.toLowerCase()}${id}${cls}`
}

export function extractAnimations(target: Element): AnimationExtract {
  const classList = Array.from(target.classList)
  const animationClasses = classList.filter(isAnimationClass)
  const transitionClasses = classList.filter(isTransitionClass)
  const rules = stylesheetRules()

  const style = window.getComputedStyle(target)
  const computed = {
    animation: style.animation || style.getPropertyValue('animation') || 'none',
    transition: style.transition || style.getPropertyValue('transition') || 'none',
    transform: style.transform || 'none',
  }

  const keyframeNameSet = new Set<string>()
  for (const name of parseKeyframeNamesFromAnimation(computed.animation)) {
    keyframeNameSet.add(name)
  }

  // Also scan class rules for animation-name references
  const cssHits: CssAnimationHit[] = []
  for (const cls of [...animationClasses, ...classList.filter((c) => /shimmer|jackpot|live-|chat-|hero-|tile-/.test(c))]) {
    const ruleCss = findClassRuleCss(cls, rules)
    const namesFromRule: string[] = []
    if (ruleCss) {
      const animMatch = ruleCss.match(/animation(?:-name)?\s*:\s*([^;}]+)/gi)
      if (animMatch) {
        for (const m of animMatch) {
          const value = m.split(':')[1]?.trim() ?? ''
          for (const name of parseKeyframeNamesFromAnimation(value)) {
            namesFromRule.push(name)
            keyframeNameSet.add(name)
          }
        }
      }
    }
    // arbitrary animate-[shimmer_2s_infinite] → shimmer
    const arbitrary = cls.match(/animate-\[([^\]]+)\]/)
    if (arbitrary?.[1]) {
      const first = arbitrary[1].split('_')[0]
      if (first && !/^\d/.test(first)) {
        namesFromRule.push(first)
        keyframeNameSet.add(first)
      }
    }
    if (animationClasses.includes(cls) || ruleCss || namesFromRule.length) {
      cssHits.push({ className: cls, ruleCss, keyframeNames: [...new Set(namesFromRule)] })
    }
  }

  const keyframes = [...keyframeNameSet]
    .map((name) => {
      const css = findKeyframeCss(name, rules)
      return css ? { name, css } : null
    })
    .filter((k): k is { name: string; css: string } => Boolean(k))

  const fiber = getFiber(target)
  const framer = extractFramerFromFiber(fiber)
  const ancestors = collectAncestorLabels(fiber)

  return {
    tagName: target.tagName.toLowerCase(),
    elementLabel: elementLabel(target),
    classList,
    animationClasses: [...new Set(animationClasses)],
    transitionClasses: [...new Set(transitionClasses)],
    cssHits,
    keyframes,
    computed,
    framer,
    ancestors,
  }
}

export function hasExtractableAnimation(extract: AnimationExtract): boolean {
  return Boolean(
    extract.framer ||
      extract.animationClasses.length ||
      extract.transitionClasses.length ||
      extract.keyframes.length ||
      (extract.computed.animation && extract.computed.animation !== 'none') ||
      (extract.computed.transition &&
        extract.computed.transition !== 'none' &&
        extract.computed.transition !== 'all 0s ease 0s')
  )
}

export function formatFramerSnippet(extract: AnimationExtract): string {
  if (!extract.framer) return '// No Framer Motion props found on this node or its parents.'
  const { componentName, props } = extract.framer
  const lines = Object.entries(props).map(([key, value]) => {
    const printed =
      typeof value === 'string'
        ? JSON.stringify(value)
        : JSON.stringify(value, null, 2)?.replace(/\n/g, '\n  ') ?? 'undefined'
    return `  ${key}={${printed}}`
  })
  return [
    `// Extracted from <${componentName}>`,
    extract.ancestors.length ? `// Ancestors: ${extract.ancestors.join(' → ')}` : null,
    `<motion.div`,
    ...lines,
    `>`,
    `  {/* … */}`,
    `</motion.div>`,
  ]
    .filter(Boolean)
    .join('\n')
}

export function formatCssSnippet(extract: AnimationExtract): string {
  const parts: string[] = []

  if (extract.animationClasses.length || extract.transitionClasses.length) {
    parts.push(
      `/* Classes */\nclassName="${[...extract.animationClasses, ...extract.transitionClasses].join(' ')}"`
    )
  }

  const uniqueRules = [
    ...new Set(extract.cssHits.map((h) => h.ruleCss).filter((r): r is string => Boolean(r))),
  ]
  if (uniqueRules.length) {
    parts.push(`/* Matched CSS rules */\n${uniqueRules.join('\n\n')}`)
  }

  if (extract.keyframes.length) {
    parts.push(
      `/* Keyframes */\n${extract.keyframes.map((k) => k.css).join('\n\n')}`
    )
  }

  if (
    extract.computed.animation !== 'none' ||
    (extract.computed.transition !== 'none' &&
      extract.computed.transition !== 'all 0s ease 0s')
  ) {
    parts.push(
      [
        `/* Computed */`,
        `animation: ${extract.computed.animation};`,
        `transition: ${extract.computed.transition};`,
        extract.computed.transform !== 'none'
          ? `transform: ${extract.computed.transform};`
          : null,
      ]
        .filter(Boolean)
        .join('\n')
    )
  }

  return parts.length
    ? parts.join('\n\n')
    : '/* No CSS animation classes or keyframes found on this element. */'
}

export function formatFullSnippet(extract: AnimationExtract): string {
  return [
    `/* BOL Animation Extract — ${extract.elementLabel} */`,
    extract.ancestors.length ? `/* React: ${extract.ancestors.join(' → ')} */` : null,
    '',
    '── Framer Motion ──',
    formatFramerSnippet(extract),
    '',
    '── CSS / Tailwind ──',
    formatCssSnippet(extract),
  ]
    .filter((line) => line !== null)
    .join('\n')
}
