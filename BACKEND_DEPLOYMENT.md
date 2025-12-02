# Backend Deployment Guide - FastAPI + AI/ML

## Architecture Overview

Your setup:
- **Frontend**: Next.js on Vercel (free)
- **Backend**: FastAPI with AI/ML packages
- **Connection**: Frontend calls backend API endpoints

## ⚠️ Important: Localhost Won't Work in Production

**Problem**: When your frontend is on Vercel (public URL), it **cannot** access `localhost:5000` on your computer.

**Why**: 
- Vercel app runs on the internet
- `localhost` only works on your local machine
- Browsers block cross-origin requests to localhost from public sites

## ✅ Solution Options

### Option 1: Deploy Backend for Free (Recommended for Demo)

Deploy your FastAPI backend to a free hosting service:

#### **A. Railway (Best for FastAPI + AI/ML)**
- **URL**: https://railway.app
- **Free**: $5 credit/month (enough for demos)
- **Why**: Great for Python/FastAPI, supports ML packages
- **Deploy**: Connect GitHub, auto-detects FastAPI

**Steps**:
1. Push backend code to GitHub
2. Go to Railway.app, sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select your backend repo
5. Railway auto-detects FastAPI
6. Add environment variables if needed
7. Deploy! Get URL like: `https://your-backend.railway.app`

#### **B. Render (Also Great)**
- **URL**: https://render.com
- **Free tier**: Yes (with limitations)
- **Steps**: Similar to Railway

#### **C. Fly.io (Good for ML)**
- **URL**: https://fly.io
- **Free tier**: Yes
- **Why**: Good for Python apps with dependencies

### Option 2: Use ngrok for Quick Demo (Temporary)

**For quick demos only** - exposes your localhost to the internet:

```bash
# Install ngrok
npm install -g ngrok
# or
brew install ngrok

# Run your FastAPI backend locally
cd your-backend-project
uvicorn main:app --reload --port 5000

# In another terminal, expose it
ngrok http 5000

# You'll get a URL like: https://abc123.ngrok.io
# Use this URL in Vercel environment variables
```

**⚠️ Limitations**:
- Free tier: URL changes every time
- 40 connections/minute limit
- Not for production

### Option 3: Keep Backend Local (Development Only)

**Only works if**:
- Frontend is also running locally (`localhost:3000`)
- Not deployed to Vercel
- Just for development/testing

## 🔧 Configuration Steps

### Step 1: Fix Hardcoded URLs in Frontend

I'll update the hardcoded `localhost:5000` URLs to use the environment variable.

### Step 2: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app
   NEXT_PUBLIC_ASSET_BASE_URL=https://your-backend.railway.app
   ```
4. **Redeploy** your Vercel app

### Step 3: Configure CORS in FastAPI Backend

Your FastAPI backend needs to allow requests from Vercel:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow requests from Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",  # Your Vercel URL
        "http://localhost:3000",  # For local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 4: Update Backend for Production

If deploying backend:

1. **Update CORS** to allow your Vercel domain
2. **Set environment variables** in Railway/Render
3. **Update database connections** if using one
4. **Test endpoints** work from public URL

## 📋 Quick Setup Checklist

### For Production Demo:
- [ ] Deploy backend to Railway/Render
- [ ] Get backend URL (e.g., `https://backend.railway.app`)
- [ ] Update CORS in FastAPI to allow Vercel domain
- [ ] Set `NEXT_PUBLIC_API_BASE_URL` in Vercel
- [ ] Redeploy Vercel frontend
- [ ] Test API calls work

### For Quick Demo (ngrok):
- [ ] Start FastAPI locally
- [ ] Run `ngrok http 5000`
- [ ] Copy ngrok URL
- [ ] Set `NEXT_PUBLIC_API_BASE_URL` in Vercel to ngrok URL
- [ ] Redeploy Vercel
- [ ] ⚠️ Keep your computer running!

## 🎯 Recommended Setup for Leadership Demo

**Best approach**:
1. **Deploy backend to Railway** (free, stable URL)
2. **Deploy frontend to Vercel** (free, fast)
3. **Connect them** via environment variables
4. **Share Vercel URL** with leadership

**Why**: 
- Both are free
- Stable URLs (no changes)
- Professional setup
- Works 24/7 without your computer

## 🔍 Testing

After deployment, test:
```bash
# Test backend is accessible
curl https://your-backend.railway.app/health

# Test from frontend
# Open browser console on Vercel app
# Check network tab for API calls
```

## 💰 Cost: $0

- Railway: $5 free credit/month (enough for demos)
- Vercel: Free tier
- **Total: $0** ✅

---

**Next Steps**: I'll fix the hardcoded localhost URLs in your frontend code now!

