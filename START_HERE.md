# ⚠️ SERVER NOT RUNNING

## The Problem
**The Next.js development server is NOT running**, which is why links/URLs don't work.

## The Solution

### Step 1: Open Terminal
Open Terminal.app (or your terminal)

### Step 2: Navigate to Project
```bash
cd /Users/christopherhunt/AIagency
```

### Step 3: Start the Server
```bash
npm run dev
```

### Step 4: Wait for This Output
You MUST see this before trying to access any URLs:
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
- Ready in 2.3s
```

### Step 5: Use the URL from Step 4
Copy the EXACT URL shown (usually `http://localhost:3000`) and paste it in your browser.

## ⚠️ IMPORTANT

- **DO NOT** try to access URLs until you see "Ready" in the terminal
- **DO NOT** close the terminal window - the server must keep running
- **The server must be running** for ANY URL to work

## Quick Check

Run this to see if server is running:
```bash
./check-server.sh
```

## If npm Command Not Found

1. Install Node.js from: https://nodejs.org/
2. Or use Homebrew: `brew install node`
3. Then try `npm run dev` again

## Test URLs (ONLY after server is running!)

- Main page: http://localhost:3000
- Test page: http://localhost:3000/test-page

**Remember**: Server must be running first!
