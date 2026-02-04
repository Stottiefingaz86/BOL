# How to Populate the Design System Knowledge Base

The design system knowledge base is now structured to support an **agnostic design system with multiple brands** (Casino, Sports, Loyalty, Authentication, Poker).

## Current Status

The structure is ready in `lib/agent/designSystem.ts`, but it needs to be populated with your actual design system data from Figma.

## Method 1: Figma Desktop (Recommended)

**To extract from Figma:**

1. **Open your Figma file** in the Figma Desktop app:
   - File: `🔒. Agnostic Design System | MUI v5.15.0 - v5.14.12`
   - URL: https://www.figma.com/design/8Nmyws2RW2VovSvCbTd3Oh/%F0%9F%94%98.-Agnostic-Design-System-%7C-MUI-v5.15.0---v5.14.12?m=auto&node-id=13-16690&t=eFhKgRAdAvEKJwwm-1

2. **Make sure it's the ACTIVE tab** in Figma Desktop (click on the tab to ensure it's selected)

3. **Tell me when it's active** and I'll extract:
   - All color tokens/variables (shared + brand-specific)
   - Typography tokens
   - Spacing tokens
   - Border radius tokens
   - Shadow tokens
   - Component information
   - Design patterns

## Method 2: Export Design Tokens

**If you have Figma Tokens plugin or similar:**

1. **Install Figma Tokens plugin** (if not already installed)
   - Go to: Plugins → Browse plugins → Search "Figma Tokens"

2. **Export your tokens:**
   - Select your design tokens/variables
   - Use the plugin to export as JSON
   - Copy the JSON output

3. **Share the JSON** with me and I'll convert it using `convertFigmaTokensToDesignSystem()`

## Method 3: Manual Input Guide

**I'll guide you through what to extract:**

### Shared/Base Colors
- Primary colors (shared across brands)
- Secondary colors (shared)
- Neutral/Gray scale (shared)
- Semantic colors (success, warning, error, info)

### Brand-Specific Colors
For each brand (Casino, Sports, Loyalty, Authentication, Poker):
- Primary brand colors
- Secondary brand colors
- Accent colors
- Brand-specific neutrals

### Typography
- Font families (primary, secondary, mono)
- Font sizes (heading scale, body scale)
- Font weights (light, regular, medium, semibold, bold)
- Line heights (tight, normal, relaxed)
- Letter spacing

### Spacing
- Spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, etc.)
- Grid system (columns, gutter, margin)

### Border Radius
- None, sm, md, lg, xl, full

### Shadows
- sm, md, lg, xl elevation levels

### Components
For each component (Button, Input, Card, etc.):
- Description
- Usage guidelines
- Variants
- Props
- Examples

### Patterns
For each design pattern:
- Description
- When to use
- Examples
- Brand-specific variations (if any)

### Areas
For each area (Sports, Casino, Loyalty, Authentication, Poker):
- Description
- Common components used
- Design patterns used
- Associated brand

### Principles, Goals, Vision
- Design principles
- System goals
- Vision statement

## Method 4: Direct Input

**You can directly tell me the information**, for example:

```
"Our shared primary colors are #FF5733 and #33FF57. 
Casino brand uses #FF0000 as primary. Sports uses #0000FF.
We use Inter as primary font, Roboto as secondary.
Font sizes: 48px, 36px, 24px, 18px, 16px, 14px, 12px.
Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px.
We have Button, Input, Card components.
Our design principles: consistency, accessibility, mobile-first."
```

I'll convert this into the structured format.

## What Gets Populated

Once extracted, the following will be populated in `lib/agent/designSystem.ts`:

```typescript
export const designSystem: DesignSystemInfo = {
  colors: { /* shared colors */ },
  typography: { /* typography tokens */ },
  spacing: { /* spacing scale */ },
  borderRadius: { /* radius tokens */ },
  shadows: { /* shadow tokens */ },
  components: { /* component library */ },
  patterns: { /* design patterns */ },
  brands: {
    Casino: { /* Casino brand colors */ },
    Sports: { /* Sports brand colors */ },
    Loyalty: { /* Loyalty brand colors */ },
    Authentication: { /* Auth brand colors */ },
    Poker: { /* Poker brand colors */ },
  },
  areas: { /* area configurations */ },
  principles: [ /* design principles */ ],
  goals: [ /* system goals */ ],
  vision: '...',
}
```

## Next Steps

1. **Choose a method above** that works for you
2. **Share the information** (via Figma Desktop, JSON export, or description)
3. **I'll extract and populate** everything into `lib/agent/designSystem.ts`
4. **CH will be ready** to answer questions about your design system!

## Quick Test

Once populated, you can test CH's knowledge by asking:
- "What colors does the Casino brand use?"
- "What's our typography system?"
- "What components do we have?"
- "How does the agnostic design system work?"
- "What patterns are used in the Sports area?"

---

**Note:** The Figma MCP tools require the file to be the **active tab** in Figma Desktop. If you're having issues, try:
1. Closing and reopening the Figma file
2. Clicking on the tab to ensure it's selected
3. Waiting a moment for the Figma plugin API to initialize
