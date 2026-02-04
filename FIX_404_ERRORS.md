# 🔴 FIX: 404 Errors for CSS/JS Files

## The Problem
You're seeing 404 errors like:
- `Failed to load resource: layout.css (404)`
- `Failed to load resource: app-pages-internals.js (404)`
- `Failed to load resource: main-app.js (404)`

This means the Next.js dev server is **not running** or **not responding correctly**.

## Fix (Do This Now)

### Step 1: Kill any existing servers
```bash
pkill -f "next dev"
```

### Step 2: Clear the build cache
```bash
cd /Users/christopherhunt/AIagency
rm -rf .next
```

### Step 3: Start the dev server
```bash
npm run dev
```

### Step 4: Wait for "Ready"
You MUST see this before using the app:
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
✓ Ready in Xms
```

### Step 5: Refresh browser
- Close DevTools if open
- Refresh the page (`Cmd+R` or `F5`)
- Make sure you're viewing on **desktop mode**, not mobile emulation

## Important Notes

1. **Keep terminal open** - The server must keep running
2. **Use desktop view** - The app requires desktop width (mobile emulation may cause issues)
3. **Check URL** - Make sure you're on `http://localhost:3000` (not a cached page)

## After Server Starts

The chat and character should appear correctly!
