# Cloudflare Pages + Railway Deployment Guide

Deploy your family website to production with free hosting on Cloudflare Pages (frontend) and Railway (backend).

## Prerequisites

- GitHub account (for repo hosting)
- Cloudflare account (already have domain there)
- Railway account (free at railway.app)
- Git installed locally
- Your domain already on Cloudflare

## Part 1: Prepare Your GitHub Repository

### Step 1: Create GitHub Repository

1. Go to **github.com/new**
2. Create new repository: `family-website`
3. Make it **Public** (required for free Railway deploys)
4. Click "Create repository"

### Step 2: Push Code to GitHub

```bash
# In your project root directory
git init
git add .
git commit -m "Initial commit: Family website preview"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/family-website.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 3: Create .gitignore

Create `/.gitignore` in project root:
```
node_modules/
dist/
.env
.DS_Store
*.log
backend/.env
frontend/.env
backend/dist
```

Commit it:
```bash
git add .gitignore
git commit -m "Add gitignore"
git push
```

---

## Part 2: Deploy Frontend to Cloudflare Pages

### Step 1: Build Frontend Locally (Verify It Works)

```bash
cd frontend
npm run build
```

You should see:
```
✓ built in 2.34s
```

This creates `frontend/dist/` folder.

### Step 2: Connect Cloudflare Pages to GitHub

1. **Go to Cloudflare Dashboard**
   - https://dash.cloudflare.com
   - Select your domain

2. **Navigate to Pages**
   - Left sidebar → Workers & Pages
   - Click "Pages"
   - Click "Create a project"

3. **Connect Git**
   - Select "Connect to Git"
   - Choose "GitHub"
   - Authorize Cloudflare
   - Select your `family-website` repo

### Step 3: Configure Build Settings

**Project name:** `family-website` (or your choice)

**Build command:**
```
npm install && npm --prefix frontend run build
```

**Build output directory:**
```
frontend/dist
```

**Environment variables:**
```
NODE_ENV = production
VITE_API_BASE = https://family-api-backend.up.railway.app/api
```

⚠️ **Note:** We'll update `VITE_API_BASE` after deploying the backend.

### Step 4: Deploy

1. Click "Save and Deploy"
2. Wait for build to complete (2-5 minutes)
3. Cloudflare shows: `✓ Deployment successful`
4. Your site is live at: `https://family-website.pages.dev`

### Step 5: Connect Custom Domain

1. In Pages project settings
2. Click "Custom domains"
3. Enter your domain: `yourfamilysite.com`
4. Cloudflare auto-configures DNS
5. Takes 1-2 minutes to activate

✅ **Frontend is now live!**

---

## Part 3: Deploy Backend to Railway

### Step 1: Sign Up for Railway

1. Go to **railway.app**
2. Click "Login"
3. Choose "Login with GitHub"
4. Authorize Railway
5. Click "Create new project"

### Step 2: Deploy from GitHub

1. Select "Deploy from GitHub repo"
2. Select your `family-website` repo
3. Railway auto-detects Node.js project

### Step 3: Configure Environment Variables

In Railway dashboard:

1. Go to "Variables" tab
2. Add these environment variables:

```
PORT = 5000
NODE_ENV = production
JWT_SECRET = (generate secure key below)
```

**Generate secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste into `JWT_SECRET`.

### Step 4: Set Build & Start Commands

In "Settings" tab:

**Build Command:**
```
npm install && npm --prefix backend run build
```

**Start Command:**
```
cd backend && npm start
```

**Root Directory:**
```
backend
```

### Step 5: Deploy

1. Railway auto-deploys after GitHub push
2. Watch the build logs
3. When complete, you'll see: `✓ Deployment successful`
4. Copy your Railway domain:
   - Example: `family-api-backend.up.railway.app`

✅ **Backend is now live!**

---

## Part 4: Connect Frontend & Backend

### Step 1: Get Backend URL

In Railway dashboard:
1. Go to your backend project
2. Click "Settings"
3. Copy "Public Domain"
4. Example: `family-api-backend.up.railway.app`

### Step 2: Update Frontend Environment Variable

In Cloudflare Pages:
1. Go to your Pages project
2. Click "Settings"
3. Click "Environment variables"
4. Update `VITE_API_BASE`:

```
VITE_API_BASE = https://family-api-backend.up.railway.app/api
```

### Step 3: Redeploy Frontend

Option A: Push new code to GitHub (auto-deploys)
```bash
git add .
git commit -m "Update API endpoint"
git push
```

Option B: Manual redeploy in Cloudflare
1. Go to Pages project
2. Click "Deployments"
3. Click three dots on latest deployment
4. Click "Retry deployment"

### Step 4: Verify Connection

In browser console (F12):
1. Visit your site
2. Open DevTools → Network tab
3. Login with demo credentials
4. Check if API calls go to Railway domain
5. Should see successful responses

✅ **Frontend and Backend connected!**

---

## Part 5: Final Testing

### Test Live Site

1. **Visit your domain:**
   ```
   https://yourfamilysite.com
   ```

2. **Test Login:**
   - Email: `chris@ezproai.com`
   - Password: `demo123`
   - Should redirect to calendar

3. **Test Features:**
   - [ ] Landing page loads
   - [ ] Login works
   - [ ] Calendar displays events
   - [ ] Photo gallery shows pictures
   - [ ] Can create new event
   - [ ] Can subscribe to reminder
   - [ ] Admin dashboard works

4. **Check Browser Console:**
   - No CORS errors
   - No 404 errors
   - No TypeScript errors

5. **Check Network Tab:**
   - API calls to Railway domain
   - All requests successful (200 status)

### Test Different Devices

- [ ] Desktop browser
- [ ] Mobile browser
- [ ] Tablet
- [ ] Different browsers (Chrome, Safari, Firefox)

---

## Part 6: Configure Custom Domain (Optional)

If you want a custom domain like `api.yoursite.com` for backend:

### Option 1: Railway Custom Domain

1. In Railway backend settings
2. Click "Custom Domain"
3. Enter: `api.yoursite.com`
4. Copy DNS record
5. Add to Cloudflare DNS

### Option 2: Using Subdomain

In Cloudflare DNS:
1. Add CNAME record:
   - Name: `api`
   - Content: `family-api-backend.up.railway.app`
2. Update frontend `VITE_API_BASE`:
   ```
   https://api.yoursite.com/api
   ```

---

## Part 7: Database Backup (Important!)

### Create Weekly Backups

Since we're using in-memory storage, data is lost on restart. Before going to production:

**Option A: Export Data Before Shutdown**
```bash
# Access Railway terminal
# Export data to JSON
node -e "const db = require('./dist/database.js').db; console.log(JSON.stringify(db, null, 2))"
```

**Option B: Upgrade to PostgreSQL**
1. Railway → Add Database
2. Select PostgreSQL
3. Connect to backend
4. Update database.ts to use Postgres

Recommended for production.

---

## Part 8: Monitoring & Maintenance

### Monitor Frontend (Cloudflare Pages)

1. **Analytics:**
   - Cloudflare Dashboard → Pages → Analytics
   - Track page views, errors, performance

2. **Deployments:**
   - Check deployment history
   - Rollback if needed (click deployment → Rollback)

3. **Logs:**
   - Click "Deployments" → "View logs"
   - Check for build/deploy errors

### Monitor Backend (Railway)

1. **Logs:**
   - Railway Dashboard → Logs tab
   - Real-time server logs
   - Error tracking

2. **Metrics:**
   - Railway Dashboard → Metrics tab
   - CPU, Memory, Network usage
   - Check for issues

3. **Uptime:**
   - Railway shows if service is running
   - Get alerts if it crashes

### Set Up Alerts

**Email Notifications:**
1. Railway Settings → Account → Email preferences
2. Enable deployment & error alerts
3. Get notified of issues

---

## Part 9: Updating Your Site

### Make Code Changes

1. **Edit code locally**
2. **Test locally:**
   ```bash
   # Terminal 1
   cd backend && npm run dev
   
   # Terminal 2
   cd frontend && npm run dev
   ```
3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

### Automatic Deployment

Both Cloudflare Pages and Railway auto-deploy when you push to GitHub:
- Cloudflare: 1-2 minutes to build
- Railway: 1-2 minutes to build

Check the dashboard to see deployment progress.

### Manual Redeploy if Needed

**Cloudflare Pages:**
1. Go to Deployments
2. Click "..." on latest deployment
3. Click "Retry deployment"

**Railway:**
1. Go to Deployments
2. Click "Deploy" button
3. Select branch to deploy

---

## Part 10: Troubleshooting

### Frontend Not Loading

**Check:**
1. Cloudflare Pages build logs
2. Browser console for errors
3. Network tab for failed requests

**Solution:**
- Check build command
- Verify frontend/dist exists
- Retry deployment

### API Not Responding

**Check:**
1. Railway logs for errors
2. Verify `VITE_API_BASE` is correct
3. Check CORS settings in backend

**Solution:**
```bash
# Restart backend in Railway
# Or redeploy
```

### CORS Errors in Console

**Error:** `Access to XMLHttpRequest... blocked by CORS`

**Fix in backend/src/index.ts:**
```typescript
app.use(cors({
  origin: 'https://yourfamilysite.com',
  credentials: true
}));
```

Redeploy backend.

### Images Not Loading

**Check:**
1. Photos in `/frontend/public/photos/`
2. Image URLs in API responses
3. Network tab for 404 errors

**Solution:**
- Ensure photos copied to public folder
- Rebuild and redeploy frontend

### Login Not Working

**Check:**
1. JWT_SECRET set in Railway
2. Backend logs for errors
3. Network request succeeds (200 status)

**Solution:**
- Verify JWT_SECRET is secure string
- Check user credentials (demo: `chris@ezproai.com` / `demo123`)
- Clear localStorage: `localStorage.clear()`

### Site Too Slow

**Check:**
1. Railway metrics (CPU, Memory)
2. Cloudflare analytics
3. Browser DevTools performance

**Optimize:**
- Add caching
- Optimize images
- Enable gzip compression
- Use CDN (Cloudflare already does this)

---

## Part 11: Environment Variables Reference

### Frontend (.env in Cloudflare Pages)

```
VITE_API_BASE = https://family-api-backend.up.railway.app/api
NODE_ENV = production
```

### Backend (.env in Railway)

```
PORT = 5000
NODE_ENV = production
JWT_SECRET = your-secure-random-key-here
```

---

## Part 12: Security Checklist

Before going public, verify:

- [ ] JWT_SECRET is strong random string
- [ ] CORS origin matches your domain
- [ ] Environment variables not in git
- [ ] .gitignore excludes .env files
- [ ] HTTPS enabled (Cloudflare/Railway default)
- [ ] No console errors in production
- [ ] Demo accounts changed or removed
- [ ] Sensitive data not logged
- [ ] Rate limiting considered
- [ ] Input validation working

---

## Part 13: Cost Summary

| Service | Component | Free Tier | Monthly Cost |
|---------|-----------|-----------|--------------|
| Cloudflare | Frontend hosting | ✅ Unlimited | **$0** |
| Railway | Backend hosting | ✅ Free tier | **$0** |
| Cloudflare | Domain DNS | ✅ Included | **$0** |
| **Total** | | | **$0/month** |

**No additional costs!** Cloudflare and Railway both offer generous free tiers.

---

## Part 14: Next Steps for Production

### Phase 1: Immediate
- [ ] Deploy frontend to Cloudflare Pages
- [ ] Deploy backend to Railway
- [ ] Test all features
- [ ] Custom domain configured

### Phase 2: Short Term (1-2 weeks)
- [ ] Set up PostgreSQL database
- [ ] Migrate from mock data
- [ ] Add real email integration
- [ ] Monitoring/alerts set up

### Phase 3: Medium Term (1-2 months)
- [ ] S3 for image storage
- [ ] Analytics integration
- [ ] Performance optimization
- [ ] Backup strategy

### Phase 4: Long Term (3+ months)
- [ ] Mobile app consideration
- [ ] Advanced features
- [ ] Family member invitations
- [ ] Private sharing controls

---

## Quick Reference Commands

```bash
# Test locally before deploying
cd backend && npm run dev
cd frontend && npm run dev

# Build for production
cd backend && npm run build
cd frontend && npm run build

# Push to GitHub (triggers auto-deploy)
git add .
git commit -m "Changes"
git push

# Generate secure JWT key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Check if sites are accessible
curl https://yourfamilysite.com
curl https://family-api-backend.up.railway.app/api/health
```

---

## Support Resources

**Cloudflare Pages Documentation:**
https://developers.cloudflare.com/pages/

**Railway Documentation:**
https://docs.railway.app/

**GitHub Actions (if you add CI/CD):**
https://docs.github.com/en/actions

---

## Success Checklist

- [ ] GitHub repo created and code pushed
- [ ] Cloudflare Pages deployment successful
- [ ] Railway backend deployment successful
- [ ] Frontend & backend connected
- [ ] All features tested on live site
- [ ] Custom domain working
- [ ] Monitoring enabled
- [ ] Security verified
- [ ] Documentation updated
- [ ] Team has access

---

**Your family website is now live! 🚀**

Share the link with your family:
```
https://yourfamilysite.com
```

Demo login credentials:
- Email: chris@ezproai.com
- Password: demo123

---

**Questions? Check the logs in Cloudflare and Railway dashboards for error details.**
