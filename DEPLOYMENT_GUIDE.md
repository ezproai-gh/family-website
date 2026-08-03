# Deployment Guide

This guide covers how to run, test, and deploy the Family Website preview.

## Local Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- 2 terminal windows/tabs

### Setup (One Time)

1. **Clone/Extract Project**
   ```bash
   cd /path/to/ChrisJonesFamily
   ```

2. **Install Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend**
   ```bash
   cd frontend
   npm install
   ```

### Running Locally

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Expected output:
```
✓ Backend running on http://localhost:5000
✓ CORS enabled
✓ Mock database initialized
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Expected output:
```
  ➜  Local:   http://localhost:3000/
  ➜  press h + enter to show help
```

### Access the Site
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

### Demo Credentials
- Admin: `chris@ezproai.com` / `demo123`
- Member: `family@example.com` / `demo123`

---

## Building for Production

### Build Backend

```bash
cd backend
npm run build
```

Creates compiled JavaScript in `backend/dist/` directory.

### Build Frontend

```bash
cd frontend
npm run build
```

Creates optimized build in `frontend/dist/` directory.

### Production Environment Variables

**Backend (.env):**
```
PORT=5000
NODE_ENV=production
JWT_SECRET=use-a-secure-random-string-in-production
```

Generate secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Deployment Options

### Option 1: Heroku (Backend Only)

**Prerequisites:**
- Heroku account
- Heroku CLI installed

**Steps:**

1. **Create Heroku App**
   ```bash
   cd backend
   heroku login
   heroku create your-app-name
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-secure-secret
   heroku config:set NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

4. **View Logs**
   ```bash
   heroku logs --tail
   ```

Backend will be available at: `https://your-app-name.herokuapp.com`

### Option 2: Vercel (Frontend Only)

**Prerequisites:**
- Vercel account
- Vercel CLI installed

**Steps:**

1. **Configure API Endpoint**
   Update `frontend/src/api.ts`:
   ```typescript
   const API_BASE = 'https://your-heroku-app.herokuapp.com/api';
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure Environment**
   - Add `API_BASE` to Vercel env variables
   - Set to production backend URL

Frontend will be available at: `https://your-site.vercel.app`

### Option 3: Railway (Full Stack)

**Prerequisites:**
- Railway account
- Railway CLI installed

**Steps:**

1. **Backend Service**
   - New Project
   - GitHub (select backend folder)
   - Configure environment variables
   - Deploy

2. **Frontend Service**
   - Same project
   - GitHub (select frontend folder)
   - Set `VITE_API_BASE` to backend URL
   - Deploy

### Option 4: AWS (Full Stack)

**Backend (EC2):**
1. Launch EC2 instance (Node.js AMI)
2. SSH into instance
3. Clone repository
4. Install dependencies: `npm install`
5. Build: `npm run build`
6. Start: `npm start` (or use PM2)
7. Configure security groups for port 5000

**Frontend (S3 + CloudFront):**
1. Build frontend: `npm run build`
2. Upload `dist/` to S3 bucket
3. Configure CloudFront distribution
4. Set API endpoint in build
5. Configure Route 53 DNS

---

## Docker Deployment

### Backend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=your-secure-secret

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_BASE=http://backend:5000/api
```

Run with: `docker-compose up`

---

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install backend
        run: cd backend && npm ci
      
      - name: Build backend
        run: cd backend && npm run build
      
      - name: Install frontend
        run: cd frontend && npm ci
      
      - name: Build frontend
        run: cd frontend && npm run build

  deploy:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Heroku
        run: |
          git push https://heroku:${{ secrets.HEROKU_API_KEY }}@git.heroku.com/${{ secrets.HEROKU_APP_NAME }}.git HEAD:main
```

---

## Database Migration (When Ready)

### From Mock to PostgreSQL

1. **Install Dependencies**
   ```bash
   npm install pg sequelize
   ```

2. **Create Models**
   - User model
   - Event model
   - Photo model
   - Reminder model

3. **Update Database Layer**
   - Replace `database.ts` with real DB connections
   - Update migrations

4. **Run Migrations**
   ```bash
   npm run migrate
   ```

5. **Update API Routes**
   - Replace in-memory calls with DB queries
   - Add proper error handling

---

## Email Integration (When Ready)

### Setup SendGrid

1. **Get API Key**
   - Sign up at SendGrid
   - Generate API key

2. **Install Library**
   ```bash
   npm install @sendgrid/mail
   ```

3. **Configure in Backend**
   ```typescript
   import sgMail from '@sendgrid/mail';
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   
   // Send reminder email
   await sgMail.send({
     to: user.email,
     from: 'noreply@familysite.com',
     subject: `Reminder: ${event.title}`,
     html: `<p>${event.description}</p>`
   });
   ```

4. **Add to Reminder Job**
   - Implement cron job for reminders
   - Send emails 24 hours before event

---

## Monitoring & Maintenance

### Health Checks

```bash
# Check backend health
curl https://your-backend.herokuapp.com/api/health

# Monitor uptime
# Use services like UptimeRobot, Pingdom
```

### Logging

1. **Backend Logs**
   - Heroku: `heroku logs --tail`
   - AWS: CloudWatch logs
   - Local: Check terminal output

2. **Frontend Errors**
   - Use Sentry.io for error tracking
   - Monitor browser console errors
   - Track analytics with Google Analytics

### Backups

1. **Database Backups**
   - PostgreSQL automatic backups
   - AWS RDS automated snapshots
   - Daily manual backups

2. **Photo Backups**
   - S3 cross-region replication
   - Regular S3 snapshots

---

## Performance Optimization

### Frontend
- Enable gzip compression
- Use CloudFront CDN
- Optimize images
- Code splitting with React.lazy()
- Service Worker for offline support

### Backend
- Add Redis caching
- Implement query optimization
- Use database indexes
- Rate limiting on endpoints
- Request compression

### Database
- Add indexes on frequently queried columns
- Archive old photos
- Optimize event queries with date ranges

---

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Generate secure JWT secret
- [ ] Enable CORS only for your domain
- [ ] Implement rate limiting
- [ ] Validate all inputs server-side
- [ ] Sanitize database queries
- [ ] Use environment variables for secrets
- [ ] Enable CSRF protection
- [ ] Implement Content Security Policy
- [ ] Regular security audits
- [ ] Update dependencies regularly
- [ ] Enable database encryption
- [ ] Use strong passwords
- [ ] Implement MFA for admin accounts

---

## Troubleshooting Deployment

### Build Fails

Check:
- Node version compatibility
- Dependencies installed
- Environment variables set
- No TypeScript errors

### Site Not Loading

Check:
- Backend is running
- CORS configured correctly
- API endpoint URL correct
- No firewall blocking ports

### Images Not Showing

Check:
- S3 bucket configured
- CloudFront distribution active
- CORS headers on S3
- Image URLs valid

### Performance Issues

Check:
- Database query optimization
- Cache implementation
- CDN configuration
- Image optimization

---

## Support & Documentation

- README.md - Quick start guide
- TECHNICAL_ARCHITECTURE.md - Design documentation
- QUICK_START.md - Getting started
- TESTING_CHECKLIST.md - Testing guide
- API endpoints documented in README

---

**Deployment ready! 🚀**
