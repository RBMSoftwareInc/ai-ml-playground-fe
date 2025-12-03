# Using ngrok for Frontend & Backend Demo

## Overview

You can expose both your **frontend** (Next.js) and **backend** (FastAPI) using ngrok for quick demos without deploying to Vercel/Railway.

## Setup

### Step 1: Install ngrok

```bash
# Option 1: Using npm (global)
npm install -g ngrok

# Option 2: Using Homebrew (Mac/Linux)
brew install ngrok

# Option 3: Download from https://ngrok.com/download
```

### Step 2: Sign up for free ngrok account

1. Go to https://ngrok.com
2. Sign up (free)
3. Get your authtoken from dashboard
4. Run: `ngrok config add-authtoken YOUR_TOKEN`

## Running Frontend with ngrok

### Option A: Run Next.js locally + ngrok

```bash
# Terminal 1: Start Next.js dev server
cd /home/rbm/RBMProjects/RBM-AI-ML/ai-ml-playground-fe
npm run dev
# Frontend runs on http://localhost:3000

# Terminal 2: Expose frontend with ngrok
ngrok http 3000
# You'll get: https://abc123.ngrok.io
```

**Share the ngrok URL** with your leadership team!

### Option B: Run Next.js production build + ngrok

```bash
# Terminal 1: Build and run production
cd /home/rbm/RBMProjects/RBM-AI-ML/ai-ml-playground-fe
npm run build
npm run start
# Frontend runs on http://localhost:3000

# Terminal 2: Expose with ngrok
ngrok http 3000
```

## Running Backend with ngrok

```bash
# Terminal 3: Start FastAPI backend
cd your-backend-project
uvicorn main:app --reload --port 5000
# Backend runs on http://localhost:5000

# Terminal 4: Expose backend with ngrok
ngrok http 5000
# You'll get: https://xyz789.ngrok.io
```

## Configuration

### Update Frontend to Use ngrok Backend URL

1. **Get your backend ngrok URL** (e.g., `https://xyz789.ngrok.io`)

2. **Update environment variable**:
   ```bash
   # Create or update .env.local
   echo "NEXT_PUBLIC_API_BASE_URL=https://xyz789.ngrok.io" > .env.local
   ```

3. **Restart Next.js dev server**:
   ```bash
   # Stop and restart
   npm run dev
   ```

### Or use ngrok config file

Create `ngrok.yml` in your project root:

```yaml
version: "2"
authtoken: YOUR_AUTH_TOKEN

tunnels:
  frontend:
    addr: 3000
    proto: http
    bind_tls: true  # HTTPS only
    
  backend:
    addr: 5000
    proto: http
    bind_tls: true
```

Then run:
```bash
ngrok start --all
```

This starts both tunnels and gives you stable URLs.

## Using ngrok with Custom Domains (Free Tier)

ngrok free tier allows **one static domain**:

1. Go to ngrok dashboard → Domains
2. Reserve a free static domain (e.g., `your-demo.ngrok-free.app`)
3. Use it in your config:

```yaml
tunnels:
  frontend:
    addr: 3000
    proto: http
    domain: your-demo.ngrok-free.app
```

## Complete Demo Setup Script

Create `start-demo.sh`:

```bash
#!/bin/bash

# Start backend
echo "Starting FastAPI backend..."
cd ../your-backend-project
uvicorn main:app --reload --port 5000 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting Next.js frontend..."
cd ../ai-ml-playground-fe
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

# Start ngrok tunnels
echo "Starting ngrok tunnels..."
ngrok start --all

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
```

Make it executable:
```bash
chmod +x start-demo.sh
./start-demo.sh
```

## Important Notes

### ⚠️ Limitations of Free ngrok:

1. **URL changes** (unless using static domain)
   - Free tier: New URL each restart
   - Solution: Use static domain or ngrok config file

2. **Connection limits**
   - 40 connections/minute
   - Enough for demos, not for production

3. **Session timeout**
   - Free tier: 2 hours max
   - Restart ngrok to extend

4. **Keep your computer running**
   - ngrok tunnels only work while your machine is on
   - Close terminal = tunnel closes

### ✅ Advantages:

- **Instant setup** - No deployment needed
- **Free** - No credit card required
- **HTTPS** - Automatic SSL certificates
- **Perfect for demos** - Quick and easy

## Quick Commands

```bash
# Start frontend ngrok
ngrok http 3000

# Start backend ngrok  
ngrok http 5000

# View ngrok dashboard
# Open http://localhost:4040 in browser

# Check active tunnels
curl http://localhost:4040/api/tunnels
```

## Troubleshooting

### "ngrok: command not found"
```bash
# Add to PATH or use npx
npx ngrok http 3000
```

### "Tunnel session failed"
- Check if port is already in use
- Verify authtoken is set: `ngrok config check`

### Frontend can't connect to backend
- Make sure backend ngrok URL is in `.env.local`
- Restart Next.js after updating env vars
- Check CORS settings in FastAPI

### URL keeps changing
- Use static domain (free tier: 1 domain)
- Or use ngrok config file for consistent setup

## Comparison: ngrok vs Vercel

| Feature | ngrok | Vercel |
|---------|-------|--------|
| Setup time | 2 minutes | 5 minutes |
| URL stability | Changes (free) | Permanent |
| Cost | Free | Free |
| Requires computer | Yes | No |
| Best for | Quick demos | Production demos |

## Recommendation

**For quick demos**: Use ngrok (fastest setup)
**For leadership presentation**: Use Vercel + Railway (more professional, stable URLs)

---

**Quick Start**:
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: ngrok for frontend
ngrok http 3000

# Share the ngrok URL! 🚀
```

