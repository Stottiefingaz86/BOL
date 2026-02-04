# Quick Start Guide

## If NO ports are working, follow these steps:

### Step 1: Open Terminal
Open Terminal.app (or your terminal application)

### Step 2: Run Diagnostics
```bash
cd /Users/christopherhunt/AIagency
./check-server.sh
```

This will tell you:
- If Node.js is installed
- If dependencies are installed
- Which ports are available
- If the server is running

### Step 3: Start the Server
```bash
npm run dev
```

### Step 4: Watch the Output
You should see something like:
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
- Ready in 2.3s
```

**IMPORTANT**: Use the EXACT URL shown in your terminal!

### Step 5: Open Browser
Copy the URL from Step 4 and paste it in your browser.

## Common Issues

### "npm: command not found"
- Node.js is not installed
- Download from: https://nodejs.org/
- Or install via Homebrew: `brew install node`

### "Cannot find module"
- Run: `npm install`
- Wait for it to finish
- Then run: `npm run dev`

### "Port already in use"
- The server will automatically use the next port (3001, 3002, etc.)
- **Check your terminal** - it will show the actual port
- Use the port shown in the terminal output

### Connection Refused / Nothing Loading
- The server isn't running
- Make sure you see "Ready" in the terminal
- Check the terminal for error messages

## Test Page

Once the server is running, test with:
- Main page: http://localhost:3000
- Test page: http://localhost:3000/test-page

If the test page works but main page doesn't, there's a code error.
Check browser console (F12) for errors.
