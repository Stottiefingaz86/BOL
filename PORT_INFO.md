# Server Port Information

## Default Port
**Next.js will use port 3000 by default**

## How to Start the Server

### Option 1: Using npm (Recommended)
```bash
cd /Users/christopherhunt/AIagency
npm run dev
```

The server will start on: **http://localhost:3000**

### Option 2: If port 3000 is busy
```bash
npm run dev:3001
```
This will use port 3001: **http://localhost:3001**

### Option 3: If port 3001 is also busy
```bash
npm run dev:3002
```
This will use port 3002: **http://localhost:3002**

## Check Which Port is Being Used

After starting the server, look for this output:
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
```

The port number will be shown in the "Local:" line.

## If You See "Connection Failed"

1. **Make sure the server is actually running** - You should see "Ready" in the terminal
2. **Check the terminal output** - It will show which port it's using
3. **Try the exact URL shown** - Use the exact URL from the terminal output (e.g., http://localhost:3000)

## Common Issues

- **"Port already in use"** - Next.js will automatically try the next port (3001, 3002, etc.)
- **"Connection refused"** - The server isn't running. Start it with `npm run dev`
- **Blank page** - Check browser console (F12) for errors

## Quick Check

To see if the server is running:
```bash
lsof -ti:3000 && echo "Port 3000 is in use" || echo "Port 3000 is free"
```
