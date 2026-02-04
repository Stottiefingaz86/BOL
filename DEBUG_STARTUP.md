# Debug Server Startup

## Quick Check
Run this command in terminal to see if server starts:

```bash
cd /Users/christopherhunt/AIagency
npm run dev
```

## What to Look For

### ✅ Success Output:
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
✓ Ready in Xms
```

### ❌ Common Errors:

1. **"command not found: npm"**
   - Node.js is not installed
   - Install from: https://nodejs.org/

2. **"Cannot find module..."**
   - Dependencies not installed
   - Run: `npm install`

3. **"Port 3000 is already in use"**
   - Kill existing process: `lsof -ti:3000 | xargs kill`
   - Or use different port: `npm run dev:3001`

4. **TypeScript/Compilation Errors**
   - Check terminal output for specific errors
   - Fix the errors and restart

5. **Build Errors**
   - Delete `.next` folder: `rm -rf .next`
   - Restart: `npm run dev`

## Still Not Working?

1. Check if Node.js is installed:
   ```bash
   node --version
   npm --version
   ```

2. Check if dependencies are installed:
   ```bash
   ls node_modules | head -5
   ```

3. If node_modules is missing, install:
   ```bash
   npm install
   ```

4. Try starting on a different port:
   ```bash
   npm run dev:3001
   ```
   Then visit: `http://localhost:3001`
