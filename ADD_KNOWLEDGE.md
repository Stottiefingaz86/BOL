# How to Add Knowledge to CH's Knowledge Base

CH's knowledge base includes:
- **Agnostic Design System** (from Figma)
- **Stakeholders** (team members, roles, responsibilities)
- **Processes** (workflows, procedures)
- **Figma Files** (all design system files)

## File Location

All knowledge is stored in: `lib/agent/knowledgeBase.ts`

## Adding More Figma Files

When you share a new Figma file, add it to the `figmaFiles` array:

```typescript
figmaFiles: [
  {
    name: 'Your Figma File Name',
    url: 'https://figma.com/design/...',
    description: 'What this file contains',
    contains: ['Components', 'Colors', 'Patterns', 'etc.'],
    lastUpdated: '2024-01-15', // Optional
  },
]
```

Then extract the information from Figma and add it to:
- `colorTokenMap` in `lib/agent/designSystem.ts` (for colors)
- `designSystem.components` (for components)
- `designSystem.patterns` (for patterns)
- Or other relevant sections

## Adding Stakeholders

Add team members to the `stakeholders` array:

```typescript
stakeholders: [
  {
    name: 'CH',
    role: 'Head of Design',
    responsibilities: [
      'Design system oversight',
      'Design reviews',
      'Team leadership',
    ],
    areas: ['All'], // or ['Casino', 'Sports', etc.]
    contact: 'ch@example.com', // Optional
  },
  {
    name: 'Lilly',
    role: 'Designer',
    responsibilities: ['Casino designs', 'Loyalty designs'],
    areas: ['Casino', 'Loyalty'],
  },
  // Add more stakeholders...
]
```

## Adding Processes

Add workflows and procedures to the `processes` array:

```typescript
processes: [
  {
    name: 'Design Request Process',
    description: 'How design requests are submitted and processed',
    steps: [
      'Submit request via design request app',
      'Request assigned to designer based on area',
      'Designer creates Figma file',
      'Review and approval',
      'Delivery to stakeholders',
    ],
    stakeholders: ['CH', 'Lilly', 'Sam', 'Nek', 'Victor'],
    areas: ['All'], // or specific areas
    tools: ['Figma', 'Mattermost', 'Craft.io'],
  },
  {
    name: 'Design Review Process',
    description: 'How designs are reviewed and approved',
    steps: [
      'Designer shares Figma file',
      'CH reviews design',
      'Feedback provided',
      'Revisions made',
      'Final approval',
    ],
    stakeholders: ['CH', 'Designers'],
    tools: ['Figma', 'Mattermost'],
  },
  // Add more processes...
]
```

## Adding Additional Notes

Add any other important information:

```typescript
additionalNotes: [
  'Design system is built on MUI v5.15.0',
  'All components must be accessible (WCAG 2.1 AA)',
  'Brand colors can be customized per brand',
  // Add more notes...
]
```

## Extracting Information from Figma

### Method 1: Figma Desktop (Recommended)

1. Open your Figma file in Figma Desktop
2. Make sure it's the active tab
3. Tell me the file is open and I'll extract:
   - Color tokens/variables
   - Typography tokens
   - Component information
   - Design patterns
   - Any other design tokens

### Method 2: Manual Extraction

1. Open the Figma file
2. Note down:
   - Color tokens and hex codes
   - Typography styles
   - Component names and variants
   - Design patterns
3. Share the information and I'll add it to the knowledge base

### Method 3: Export from Figma

1. Use Figma Tokens plugin to export tokens as JSON
2. Share the JSON and I'll convert it to the knowledge base format

## Updating After Adding Knowledge

After adding new knowledge:

1. **Restart your dev server** (the knowledge base is loaded at startup)
2. **Test with CH** - Ask questions about the new information
3. **Verify accuracy** - Make sure CH's responses are correct

## What CH Can Answer

Once knowledge is added, CH can answer questions about:

- ✅ Colors (tokens, hex codes, usage)
- ✅ Typography (fonts, sizes, weights, styles)
- ✅ Components (variants, props, usage)
- ✅ Design patterns (when to use, examples)
- ✅ Brands (color palettes, configurations)
- ✅ Stakeholders (roles, responsibilities, areas)
- ✅ Processes (steps, tools, stakeholders involved)
- ✅ Figma files (what they contain, links)
- ✅ Mockup ideas (using only design system components)

## Example Questions

After adding knowledge, you can ask CH:

- "What colors does the Casino brand use?"
- "Who works on Casino designs?"
- "What's the design request process?"
- "Show me a mockup idea for a login page"
- "What components are available?"
- "What Figma files do we have?"

## Need Help?

If you need help adding knowledge:
1. Share the Figma file link
2. Describe what information you want to add
3. I'll extract and add it to the knowledge base
