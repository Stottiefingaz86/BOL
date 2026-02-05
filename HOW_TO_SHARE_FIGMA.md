# How to Share Your Figma Design System

There are several ways to share your Figma design system with me. Choose the method that works best for you:

## Method 1: Figma Desktop App (Recommended)

**This is the easiest way if you have Figma Desktop installed:**

1. **Open your Figma file** in the Figma Desktop app:
   - File: `BOL---1.-Design-System`
   - URL: https://www.figma.com/design/cmtw0hRKLBaydR1JhihYFk/BOL---1.-Design-System

2. **Keep the file open** in Figma Desktop (not browser)

3. **Tell me when it's open** and I'll extract:
   - All color tokens/variables
   - Typography tokens
   - Spacing tokens
   - Component information
   - Design patterns

## Method 2: Export Design Tokens from Figma

**If you have Figma Tokens plugin or similar:**

1. **Install Figma Tokens plugin** (if not already installed)
   - Go to: Plugins → Browse plugins → Search "Figma Tokens"

2. **Export your tokens:**
   - Select your design tokens/variables
   - Use the plugin to export as JSON
   - Copy the JSON output

3. **Share the JSON** with me and I'll convert it to the format CH needs

## Method 3: Manual Extraction Guide

**I'll guide you through what to extract:**

### Colors
- Primary colors
- Secondary colors  
- Neutral/Gray scale
- Semantic colors (success, warning, error, info)
- Brand colors

### Typography
- Font families (primary, secondary, mono)
- Font sizes (heading scale, body scale)
- Font weights
- Line heights
- Letter spacing

### Spacing
- Spacing scale (4px, 8px, 12px, etc.)
- Grid system
- Container widths

### Components
- Button variants
- Input styles
- Card patterns
- Navigation components
- Form elements

### Patterns
- Layout patterns
- Content patterns
- Interaction patterns

## Method 4: Screenshots + Description

**If other methods don't work:**

1. Take screenshots of key pages:
   - Color palette page
   - Typography page
   - Component library
   - Spacing/Grid system

2. Describe:
   - Your brand values
   - Design principles
   - Product features
   - Usage guidelines

3. Share the screenshots and I'll extract the information

## Method 5: Direct Input

**You can directly tell me:**

Just describe your design system in natural language, for example:

```
"Our primary colors are #FF5733 (orange) and #33FF57 (green). 
We use Inter as our primary font, with sizes 48px, 36px, 24px for headings.
Our spacing scale is 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px.
We have Button components with variants: primary, secondary, outline.
Our design principles are: consistency, accessibility, mobile-first."
```

I'll convert this into the structured format CH needs.

## What I Need to Know

To make CH's responses accurate, please share:

### ✅ Essential:
- [ ] Color palette (primary, secondary, neutrals)
- [ ] Typography (fonts, sizes, weights)
- [ ] Spacing scale
- [ ] Component library overview

### ✅ Helpful:
- [ ] Design tokens/variables
- [ ] Component variants and props
- [ ] Design patterns and when to use them
- [ ] Brand guidelines
- [ ] Design principles
- [ ] Product features/areas (Casino, Sports, Loyalty, etc.)

### ✅ Nice to Have:
- [ ] Animation guidelines
- [ ] Icon system
- [ ] Illustration style
- [ ] Photography style
- [ ] Voice and tone

## Next Steps

1. **Choose a method above** that works for you
2. **Share the information** (via Figma Desktop, JSON export, screenshots, or description)
3. **I'll extract and format** everything into `lib/agent/designSystem.ts`
4. **CH will be ready** to answer questions about your design system!

## Quick Start

**If you want to start quickly**, just tell me:
- Your main brand colors
- Your primary font
- Your spacing scale

I can set up a basic version and we can expand from there!
