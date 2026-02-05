# Extracting Game Tile Images from Figma

This guide explains how to extract game tile images from the Casino Figma design file.

## Figma File

- **URL**: https://www.figma.com/design/dsg9EC3QiVp7h80BNy47EA/Casino-26--LightMode-%7C-MUI-ADS
- **Main Node ID**: `3:23052` (Lobby | Logged Out)

## Extraction Methods

### Method 1: Using Figma MCP Tools (Recommended)

The Figma MCP server provides tools to extract images directly:

1. **Get Screenshot of Game Tiles**:
   ```typescript
   // Use mcp_Figma_get_screenshot with specific game tile node IDs
   // Each game tile component has its own node ID
   ```

2. **Identify Game Tile Node IDs**:
   - Open the Figma file
   - Select a game tile component
   - Copy the node ID from the URL or Figma's dev mode
   - Node IDs are in format: `frame-id:node-id` (e.g., `3:12345`)

3. **Extract via API**:
   ```bash
   curl -X POST http://localhost:3000/api/extract-game-tiles \
     -H "Content-Type: application/json" \
     -d '{
       "nodeIds": ["3:12345", "3:12346", "3:12347"],
       "outputDir": "public/games"
     }'
   ```

### Method 2: Manual Extraction

1. **In Figma**:
   - Select each game tile component
   - Right-click → "Copy/Paste as" → "Copy as PNG" (or SVG)
   - Or use Export → PNG/SVG

2. **Save to Project**:
   - Save images to `public/games/` directory
   - Name them descriptively: `megacrush.png`, `mr-mammoth.png`, etc.

3. **Update Component**:
   - Update `app/navtest/page.tsx` to use the new image paths

## Current Implementation

The casino lobby page (`app/navtest/page.tsx`) currently uses placeholder images from `/walk/` directory. To use actual game tile images:

1. Extract images from Figma (using methods above)
2. Save to `public/games/` directory
3. Update the game data arrays in `app/navtest/page.tsx`:

```typescript
const mostPlayedGames = [
  { 
    id: 1, 
    title: 'MEGACRUSH', 
    provider: 'BETSOFT', 
    tag: 'Early', 
    image: '/games/megacrush.png' // Update path
  },
  // ... more games
]
```

## Finding Game Tile Node IDs

To find specific game tile node IDs in Figma:

1. Open the Figma file
2. Navigate to the game section (Most Played, Popular, etc.)
3. Select a game tile
4. Check the URL or use Figma's dev mode to get the node ID
5. The node ID format is: `frame-id:node-id`

## Example Node IDs

Based on the Figma structure, game tiles are likely nested within:
- Main lobby frame: `3:23052`
- Game sections: Various child frames
- Individual game tiles: Further nested components

To get all game tile node IDs, you can:
1. Use Figma MCP `get_metadata` to traverse the tree
2. Look for components with names like "Game Tile", "Game Card", etc.
3. Extract their node IDs and pass to the extraction script

## API Endpoint

The extraction API is available at:
- **POST** `/api/extract-game-tiles`
- **Body**: `{ nodeIds: string[], outputDir?: string }`
- **Response**: `{ success: boolean, extracted: number, saved: number, savedFiles: string[] }`

## Notes

- The Figma MCP server must be running and configured
- Node IDs must be in the format `frame-id:node-id`
- Images are saved as PNG files by default
- The extraction script creates the output directory if it doesn't exist
