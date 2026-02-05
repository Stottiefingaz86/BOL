# 🔴 CRITICAL: npm Not Found

## The Problem
Your terminal shows: `zsh: command not found: npm`

This means **Node.js is not installed** or not in your PATH.

## Solution: Install Node.js

### Option 1: Download Installer (Easiest)

1. **Go to**: https://nodejs.org/
2. **Download** the LTS version (recommended)
3. **Run the installer** (double-click the .pkg file)
4. **Follow the installation wizard**
5. **Restart your terminal** (close and reopen it)
6. **Try again**: `npm run dev`

### Option 2: Using Homebrew (If you have it)

1. **Open Terminal**
2. **Run**:
   ```bash
   brew install node
   ```
3. **Wait for installation**
4. **Restart terminal**
5. **Try**: `npm run dev`

### Option 3: Check if Node.js is Already Installed

Sometimes Node.js is installed but not in PATH. Try:

```bash
# Check common locations
/usr/local/bin/node --version
# OR
/opt/homebrew/bin/node --version
```

If either works, you need to add it to your PATH.

## After Installing Node.js

1. **Close and reopen your terminal** (important!)
2. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```
   Both should show version numbers.

3. **Navigate to project**:
   ```bash
   cd /Users/christopherhunt/AIagency
   ```

4. **Start server**:
   ```bash
   npm run dev
   ```

## Quick Test

After installing, run this to verify:
```bash
node --version && npm --version && echo "✓ Node.js is ready!"
```

If you see version numbers, you're good to go!
