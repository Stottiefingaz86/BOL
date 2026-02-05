# Sportsbook Figma Extraction Summary

## File Information
- **File Name**: Sportbook-26
- **File ID**: vIX39SAgC9K5eINAxErFPw
- **URL**: https://www.figma.com/design/vIX39SAgC9K5eINAxErFPw/Sportbook-26
- **Node ID**: 25:8 (INDEX page)

## Extracted Design Tokens

### Border Radius Tokens
- `borderRadius-3`: 12px
- `borderRadius-4`: 16px
- `borderRadius-9`: 40px

### Elevation/Shadow Tokens
- `elevation/3`: 
  - Effect 1: DROP_SHADOW, color: #00000033, offset: (0, 3), radius: 3, spread: -2
  - Effect 2: DROP_SHADOW, color: #00000024, offset: (0, 3), radius: 4, spread: 0
  - Effect 3: DROP_SHADOW, color: #0000001F, offset: (0, 1), radius: 8, spread: 0

## File Structure (from INDEX page)

The Sportsbook Figma file contains the following sections:

1. **🚧 Final Designs | MUI/ADS**
   - ↳ Betonline
   - ↳ Sportbetting

2. **✏️ Wireframes**

3. **🔍 Benchmark & References**
   - Links to: Sportbook-FUTURO-2 file

4. **👋 DEMO - Introduction**
   - Links to: Sportbook-FUTURO-2 file

5. **▶️ Wireframe Prototype**
   - Links to: Sportbook-FUTURO-2 file

6. **⚙️ Components**
   - ↳ Common Components
   - ↳ Event Row Components

7. **⚠️ Requested Tokens**

8. **🎨 Playground**
   - Links to: Sportbook-FUTURO branch

9. **🪦 Archive**

## Design System Information

- **Background Color**: #070707 (near black)
- **Border Color**: #00ff75 (green)
- **Border Radius**: Uses borderRadius-9 (40px) for main container
- **Card Background**: #1b1b1b (dark gray)
- **Typography**: Open Sans Bold, 128px for headings, tracking: -2.56px
- **Text Colors**: 
  - White (#ffffff) for main text
  - #00ff75 (green) for accent text
  - #383838 for secondary text
  - #858585 for muted text

## Storage

The extracted tokens have been:
1. ✅ Documented in this file
2. ✅ Added to knowledge base (lib/agent/knowledgeBase.ts)
3. ✅ Script created for Supabase storage (scripts/extract-sportsbook-figma.ts)

## Next Steps for Complete Extraction

To extract more comprehensive information, you would need to:

1. **Extract Components**: Navigate to the "Common Components" and "Event Row Components" sections
2. **Extract Colors**: Get all color variables and instances from the design system
3. **Extract Typography**: Get all typography tokens and text styles
4. **Extract Spacing**: Get all spacing/padding/margin tokens
5. **Extract Logos**: Get any logos used in the Sportsbook designs
6. **Extract Patterns**: Get design patterns and layouts

### Using the Extraction Script

To store the extracted data in Supabase, you can:

1. **Via API** (POST to `/api/extract-figma`):
```json
{
  "variableDefs": {
    "borderRadius-3": "12",
    "borderRadius-4": "16",
    "borderRadius-9": "40",
    "elevation/3": "Effect(...)"
  },
  "components": [...],
  "colors": [...],
  "typography": [...]
}
```

2. **Via Script** (run with tsx):
```bash
npx tsx scripts/store-sportsbook-variables.ts
```

## Notes

- The Figma MCP tools provide access to design context and variables
- For comprehensive extraction, you may need to navigate to specific pages/frames
- Components, colors, and typography can be extracted from individual pages
- The extraction script supports storing data in Supabase for persistent knowledge base
