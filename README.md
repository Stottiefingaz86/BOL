# Brand Book Studio

A game-like creative agency interface for building comprehensive brand books. Minimalist black & white design with a white pixel-art character.

## Features

- **6-Phase Workflow** - Briefing → Researching → Synthesizing → Presenting → Generating → Delivering
- **Agency-Style Cards** - Rationale-driven approvals with "Why this works" explanations
- **State Machine** - Clean phase transitions with approval checkpoints
- **Research Board** - Competitor analysis, positioning map, whitespace opportunities
- **Animated Thinking States** - White outline loader with phase-specific microcopy
- **Structured Outputs** - JSON-based brand book data ready for PDF generation
- **Minimalist Design** - Strict black (#000) background with white elements only

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000/studio](http://localhost:3000/studio) in your browser

## Workflow

1. **Briefing** - Enter brand name (or "help me name it"), industry, target audience, 3 adjectives, competitors (optional), mood preference
2. **Researching** - View category definition, competitor analysis (8-12), messaging patterns, positioning map, whitespace opportunities
3. **Synthesizing** - Review and approve brand pillars, positioning statement, tagline options
4. **Presenting** - Choose from 3 creative directions (each with strategic intent, mood keywords, visual/copy direction)
5. **Generating** - Approve logo direction, color palette, typography, tone of voice, messaging examples
6. **Delivering** - Download Brand Book PDF + asset pack

## Project Structure

```
app/
  (studio)/
    layout.tsx
    page.tsx
    components/
      Sidebar.tsx              # Agency HQ (monospace, text-only)
      ChatPanel.tsx             # Brief intake form
      OutputPanel.tsx           # Phase-specific content rendering
      ThinkingBubble.tsx        # White outline bubble with loader
      PixelMan.tsx              # White pixel silhouette (Rive placeholder)
      AgencyCard.tsx            # Card with rationale + approve button
      ResearchBoard.tsx         # Research output display
      CompetitorCards.tsx       # Competitor analysis cards
      PositioningMap.tsx        # 2-axis positioning visualization
      DeliverablesVault.tsx     # Final download screen
  api/
    research/
      route.ts                  # Mocked research data
    creative/
      route.ts                  # Mocked strategy + brand system
lib/
  store/
    studioStore.ts              # Zustand state machine (6 phases)
  agent/
    schemas.ts                  # TypeScript types
    prompts.ts                  # Phase-specific thinking steps
  motion/
    transitions.ts              # Framer Motion variants
```

## API Endpoints

### POST /api/research
Returns:
- `categoryDefinition`
- `competitors[]` (name, url, headline, valueProps, toneTags, visualTags)
- `messagingPatterns` (commonClaims, overusedWords)
- `whitespaceOpportunities[]` (title, insight, recommendedAngle, visualDirection)
- `positioningMap` (axisX, axisY, points[])

### POST /api/creative
Returns:
- `brandPillars[]`
- `positioning`
- `taglineOptions[]`
- `creativeDirections[]`

### GET /api/creative?directionId=...
Returns:
- `brandSystem` (palette, typography, toneOfVoice, messagingExamples, logoDirection, visualSystemNotes)

## Design Principles

- **Black & White Only** - No colors in UI (color introduced only as creative output)
- **Monospace Feel** - Agency HQ uses Courier/Monaco font
- **Game-Like Pacing** - Intentional animations, staggered reveals
- **Agency Credibility** - Always present options with rationale
- **Approval Checkpoints** - Decisions are locked once approved

## Next Steps

1. **Add Rive animations**: Replace PixelMan placeholder with white pixel-art `.riv` file
2. **Connect real AI agent**: Update API routes to call your AI service
3. **PDF Generation**: Implement Brand Book PDF (e.g., `@react-pdf/renderer`)
4. **Asset Pack**: Add logo files, color swatches, typography files
5. **Celebration**: Add unlock animation when deliverables are ready

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- Rive (for Pixel Man animations)
