# Free Hosting Guide - Deploy to Vercel (Recommended)

## Why Vercel?
- ✅ **100% Free** - No credit card required
- ✅ **Made by Next.js creators** - Perfect compatibility
- ✅ **Automatic deployments** from GitHub
- ✅ **Custom domain** on free tier
- ✅ **Fast global CDN**
- ✅ **Perfect for demos** - Share URL instantly

## Quick Deploy (5 minutes)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ai-ml-playground-fe.git
   git push -u origin main
   ```

2. **Go to Vercel**: https://vercel.com

3. **Sign up** with GitHub (free, no credit card)

4. **Click "Add New Project"**

5. **Import your GitHub repository**

6. **Configure**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto)
   - Output Directory: `.next` (auto)

7. **Click "Deploy"** - Takes 2-3 minutes

8. **Done!** You'll get a URL like: `https://your-project.vercel.app`

### Option 2: Deploy via CLI (Advanced)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name? ai-ml-playground-fe
# - Directory? ./
# - Override settings? N

# Production deploy
vercel --prod
```

## Alternative Free Hosting Options

### 1. Netlify (Also Great)
- **URL**: https://netlify.com
- **Free tier**: Yes, no credit card
- **Deploy**: Connect GitHub repo
- **Build command**: `npm run build`
- **Publish directory**: `.next`

### 2. Railway
- **URL**: https://railway.app
- **Free tier**: $5 credit/month (enough for demos)
- **Deploy**: Connect GitHub, auto-detects Next.js

### 3. Render
- **URL**: https://render.com
- **Free tier**: Yes (with limitations)
- **Deploy**: Connect GitHub repo

## Important Notes

### Environment Variables
If you have API keys or environment variables:
1. Go to Project Settings → Environment Variables
2. Add them in Vercel dashboard
3. Redeploy

### Custom Domain (Free on Vercel!)
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS instructions

### Performance
- Vercel automatically optimizes Next.js apps
- Images are optimized via Next.js Image component
- Static pages are pre-rendered
- API routes work automatically

## Troubleshooting

### Build Fails?
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors: `npm run build` locally

### API Routes Not Working?
- Make sure they're in `app/api/` directory
- Check Vercel function logs

### Images Not Loading?
- Ensure images are in `public/` folder
- Use Next.js `<Image>` component

## Share Your Demo

Once deployed, share the URL with your leadership team:
- **Production URL**: `https://your-project.vercel.app`
- **Preview URLs**: Created for every Git push (on free tier!)

## Cost: $0 Forever
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month (free tier)
- ✅ Perfect for demos and small projects

---

**Recommended**: Use **Vercel** - it's the easiest and most reliable for Next.js apps!

