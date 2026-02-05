# Troubleshooting: Server Not Working

## Quick Diagnosis

If **NO ports are working** (3000, 3001, 3002, etc.), the issue is likely:

### 1. Server Not Actually Running
- **Check**: Look at your terminal where you ran `npm run dev`
- **Should see**: "Ready in X.Xs" and "Local: http://localhost:3000"
- **If you see errors**: Copy the error message

### 2. Node.js/npm Not Installed
Run these commands to check:
```bash
node --version
npm --version
```

If these fail, you need to install Node.js:
- Download from: https://nodejs.org/
- Or use Homebrew: `brew install node`

### 3. Dependencies Not Installed
```bash
cd /Users/christopherhunt/AIagency
npm install
```

### 4. Port Already in Use (but server shows different port)
- Check terminal output - it will show the actual port
- Example: "Port 3000 is in use, trying 3001"
- Use the port shown in the terminal

### 5. Browser Cache
- Try hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Or open in incognito/private window

### 6. Firewall/Antivirus Blocking
- Check if firewall is blocking port 3000
- Try a different port: `npm run dev:3001`

## Step-by-Step Fix

1. **Open Terminal** (Terminal.app on Mac)

2. **Navigate to project**:
   ```bash
   cd /Users/christopherhunt/AIagency
   ```

3. **Check if node_modules exists**:
   ```bash
   ls node_modules
   ```
   If it doesn't exist or is empty, run: `npm install`

4. **Start the server**:
   ```bash
   npm run dev
   ```

5. **Wait for this output**:
   ```
   ▲ Next.js 14.2.5
   - Local:        http://localhost:3000
   - Ready in 2.3s
   ```

6. **Copy the EXACT URL** from the terminal (it might be 3000, 3001, etc.)

7. **Open that URL in your browser**

## Test if Server is Running

Visit: http://localhost:3000/test-page

If this works, the server is running but the main page has an error.
If this doesn't work, the server isn't running.

## Common Error Messages

### "Cannot find module"
```bash
npm install
```

### "Port 3000 is already in use"
The server will automatically try 3001, 3002, etc. Check terminal for actual port.

### "npm: command not found"
Node.js is not installed or not in PATH. Install Node.js.

### Blank page / Connection refused
- Server isn't running - start it with `npm run dev`
- Check browser console (F12) for errors
- Check terminal for compilation errors

## Still Not Working?

1. **Check terminal output** - Copy any error messages
2. **Check browser console** (F12 → Console tab) - Look for red errors
3. **Try test page**: http://localhost:3000/test-page
4. **Verify Node.js**: `node --version` should show v18 or higher
