# Quick Start Guide

## ✅ Server Starting

The Next.js dev server is now starting on port 3000.

## What to do:

1. **Wait 5-10 seconds** for the server to fully start
2. **Refresh your browser** at `http://localhost:3000`
3. You should see:
   - Logo in top-left
   - Character walking in from left (3 seconds)
   - Character stops at center and goes idle
   - Chat appears below character
   - Intro content appears in right sidebar after ~3.5 seconds

## If you still see "Connection Refused":

- Check the terminal where you ran `npm run dev` for errors
- Make sure port 3000 isn't being used by another app
- Try a different port: `npm run dev:3001`

## Visual Markups Ready:

Once the page loads, the chat will have enhanced markups:
- **Statistics** (75%, 3.8/5) → Yellow badges
- **Key Findings/Recommendations** → Labeled sections with borders
- **Bold/Italic** text formatting
- **Code blocks** with background
- **Lists** properly formatted
