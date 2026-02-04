# Design System Setup for CH Chat

## Overview
CH (the character) can now answer questions about your design system! To enable this, add your design system information to the knowledge base.

## How to Add Your Design System

### Step 1: Open the Design System File
Edit: `lib/agent/designSystem.ts`

### Step 2: Fill in Your Design System Information

Replace the placeholder `designSystem` object with your actual design system data:

```typescript
export const designSystem: DesignSystemInfo = {
  colors: {
    primary: ['#FF5733', '#33FF57', '#3357FF'],
    secondary: ['#FF33F5', '#F5FF33'],
    neutral: ['#000000', '#FFFFFF', '#808080'],
    semantic: {
      success: '#00FF00',
      warning: '#FFAA00',
      error: '#FF0000',
      info: '#0066FF'
    }
  },
  
  typography: {
    fontFamilies: {
      primary: 'Inter, sans-serif',
      secondary: 'Georgia, serif',
      mono: 'Courier New, monospace'
    },
    scales: {
      heading: ['48px', '36px', '24px', '18px'],
      body: ['16px', '14px', '12px']
    }
  },
  
  spacing: {
    scale: [4, 8, 12, 16, 24, 32, 48, 64],
    unit: 'px'
  },
  
  components: {
    Button: {
      description: 'Primary action button component',
      usage: 'Use for main CTAs and important actions',
      variants: ['primary', 'secondary', 'outline', 'ghost'],
      props: ['size', 'variant', 'disabled', 'loading']
    },
    Input: {
      description: 'Text input field',
      usage: 'Use for user text input',
      variants: ['default', 'error', 'disabled'],
      props: ['placeholder', 'value', 'onChange', 'type']
    }
    // Add more components...
  },
  
  patterns: {
    'Card Layout': {
      description: 'Container for related content',
      whenToUse: 'When grouping related information',
      examples: ['Product cards', 'User profiles', 'Content blocks']
    }
    // Add more patterns...
  },
  
  principles: [
    'Consistency across all touchpoints',
    'Accessibility first',
    'Mobile-first responsive design'
  ],
  
  goals: [
    'Create a cohesive visual language',
    'Speed up development',
    'Ensure brand consistency'
  ],
  
  vision: 'To create a design system that empowers designers and developers to build beautiful, consistent experiences efficiently.'
}
```

### Step 3: Test the Chat

1. Refresh your browser
2. Click "Chat with CH" below the character
3. Ask questions like:
   - "What colors do we use?"
   - "Tell me about buttons"
   - "What's our spacing scale?"
   - "What are our design principles?"

## Figma Integration

You mentioned a Figma design system. To integrate it:

1. **Export from Figma**: Export your design tokens (colors, typography, spacing) from Figma
2. **Add to designSystem.ts**: Copy the exported values into the `designSystem` object
3. **Components**: Document your components and their usage
4. **Patterns**: Document common patterns and when to use them

## Example Questions CH Can Answer

Once you've added your design system, CH can answer:

- "What are our primary colors?"
- "What font do we use for headings?"
- "How do I use the Button component?"
- "What's our spacing scale?"
- "When should I use the Card pattern?"
- "What are our design principles?"
- "What's our design vision?"

## Next Steps

1. Add your design system information to `lib/agent/designSystem.ts`
2. Test with various questions
3. Refine responses as needed
4. Consider adding more detailed component documentation

The chat interface is ready - just add your design system knowledge!
