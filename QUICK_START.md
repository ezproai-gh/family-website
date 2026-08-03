# Quick Start Guide

Get the Family Website running in 5 minutes!

## Step 1: Install Dependencies (2 min)

**Terminal Tab 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal Tab 2 - Frontend:**
```bash
cd frontend
npm install
```

## Step 2: Start Backend (30 sec)

```bash
cd backend
npm run dev
```

Wait for message: `✓ Backend running on http://localhost:5000`

## Step 3: Start Frontend (30 sec)

```bash
cd frontend
npm run dev
```

Wait for message: `✓ local: http://localhost:3000/`

## Step 4: Open in Browser

Visit: **http://localhost:3000**

## Step 5: Try It Out (2 min)

### Option A: Login as Admin
1. Click **Login**
2. Email: `chris@ezproai.com`
3. Password: `demo123`
4. You'll see ⚙️ Admin link in navbar

### Option B: Create New Account
1. Click **Sign Up**
2. Fill in details
3. You're automatically logged in

## Quick Feature Demo

1. **Landing Page** (Home)
   - See family photos
   - View upcoming events
   - Click photos to preview

2. **Calendar** (📅 Calendar)
   - View events for the month
   - Click "+" to create event
   - Subscribe to reminders (🔕 Subscribe button)

3. **Gallery** (📸 Gallery)
   - Browse family photos
   - Click photo for full view
   - Upload new photos (+ Upload Photo)

4. **Admin** (⚙️ Admin) - Admin only
   - See statistics
   - View all family members
   - Manage users

## Test the Features

### Authentication
```
Demo Account:
Email: chris@ezproai.com
Password: demo123
Role: Admin (can see admin dashboard)
```

### Create Event
1. Go to Calendar
2. Click "+ Add Event"
3. Fill form
4. Click "Create Event"
5. Event appears on calendar

### Subscribe to Reminder
1. Find an event
2. Click "🔕 Subscribe to Reminder"
3. Button changes to "🔔 Subscribed"
4. Confirmation message shows

### Upload Photo
1. Go to Gallery
2. Click "+ Upload Photo"
3. Enter title, caption, image URL
4. Photo preview appears
5. Click "Upload Photo"
6. Photo added to gallery

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### Port 5000 Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### Photos Not Loading
- Check if `/frontend/public/photos/` folder exists
- Contains image files (.jpeg, .png, etc.)
- Browser console for 404 errors

### Cannot Login
1. Clear browser storage: `localStorage.clear()`
2. Restart backend: `npm run dev`
3. Refresh browser

### TypeScript Errors
Make sure you're in the correct directory:
```bash
cd backend  # Run: npm run dev
cd frontend # Run: npm run dev
```

## Next Steps

✅ **Explore the code:**
- Backend API: `backend/src/index.ts`
- Frontend components: `frontend/src/pages/`
- Database mock: `backend/src/database.ts`

✅ **Customize:**
- Change site title in `frontend/index.html`
- Update colors in `frontend/src/styles/App.css`
- Add more demo events in `backend/src/database.ts`

✅ **Read full documentation:**
- See `README.md` for complete API docs
- See `TECHNICAL_ARCHITECTURE.md` for design details

## Common URLs

| Component | URL |
|-----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Health Check | http://localhost:5000/api/health |

---

**That's it! You're ready to explore the family website! 🎉**
