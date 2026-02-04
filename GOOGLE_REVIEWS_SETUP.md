# Google Reviews Crawler Setup

## Overview

The Design Request App can now crawl Google for user reviews and feedback about websites, analyze them as UX insights, and display them visually in the chat interface.

## Features

1. **Google Reviews Crawling**: Automatically searches Google for reviews about your website
2. **AI-Powered Analysis**: Uses OpenAI to extract UX insights from review data
3. **Visual Display**: Findings are displayed in beautiful cards with severity badges, not just text
4. **Knowledge Base Integration**: All findings are added to CH's knowledge base

## How to Use

### Crawl Google Reviews for a Website

```bash
POST /api/ux-report
Content-Type: application/json

{
  "url": "https://betonline.ag",
  "crawlGoogleReviews": true
}
```

### Analyze Website AND Crawl Reviews

```bash
POST /api/ux-report
Content-Type: application/json

{
  "url": "https://betonline.ag",
  "analyzeWebsite": true,
  "crawlGoogleReviews": true
}
```

## What Gets Analyzed

The crawler:
1. Searches Google for reviews about your website
2. Extracts review content from search results
3. Uses AI to identify:
   - Common complaints
   - Common praises
   - Recurring UX issues
   - Overall sentiment
   - Affected areas (Navigation, Payment, Support, etc.)
4. Assigns severity levels (critical, high, medium, low)
5. Provides actionable recommendations

## Visual Display in Chat

When you ask CH about reviews or findings, they're displayed as:

- **UX Findings Cards**: Beautiful cards with:
  - Severity badges (🔴 Critical, 🟠 High, 🟡 Medium, 🔵 Low)
  - Affected area tags
  - Issue descriptions
  - Recommendations
  
- **Review Summary Cards**: Summary cards with:
  - Overall rating with stars
  - Total review count
  - Common themes as badges
  - Strengths list

## Example Queries

Ask CH:
- "what did jurnii find?"
- "what are the user reviews saying?"
- "what issues did users report?"
- "what did the competitor analysis find?"

CH will automatically format the findings visually in cards!

## Requirements

- `OPENAI_API_KEY` must be set (already configured for chat)
- Server must be running

## Current Status

✅ Google reviews crawler implemented
✅ Visual UX findings cards created
✅ Review summary cards created
✅ Chat UI enhanced to display findings visually
✅ Knowledge base integration working
