# 🔴 URGENT: Server Not Running

## The Error You're Seeing
**ERR_CONNECTION_REFUSED** on `localhost:3000`

This means: **The server is NOT running**

## Fix It Now (3 Steps)

### 1. Open Terminal
- Press `Cmd + Space` (Spotlight)
- Type "Terminal"
- Press Enter

### 2. Run These Commands
Copy and paste these EXACT commands one by one:

```bash
cd /Users/christopherhunt/AIagency
```

Then:

```bash
npm run dev
```

### 3. Wait for This Message
You MUST see this before closing the terminal:

```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
- Ready in 2.3s
```

### 4. Refresh Your Browser
Once you see "Ready", go back to Chrome and:
- Click the **Reload** button
- Or press `Cmd + R`

## ⚠️ CRITICAL

- **DO NOT close the terminal** - the server must keep running
- **Keep the terminal window open** while using the app
- The server must be running for the page to load

## If "npm: command not found"

Node.js is not installed. Install it:
1. Go to: https://nodejs.org/
2. Download and install
3. Then try `npm run dev` again

## After Server Starts

The page at `http://localhost:3000` will work!
