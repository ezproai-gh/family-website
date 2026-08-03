# ChrisJonesFamily Website - Technical Architecture

## Tech Stack

**Frontend:**
- React or Vue.js (responsive, component-based)
- Tailwind CSS (styling)
- React Router (navigation)

**Backend:**
- Node.js + Express (or Python + Flask)
- RESTful API

**Database:**
- PostgreSQL (relational, handles user auth + events)
- AWS S3 or similar (image storage)

**Authentication & Email:**
- JWT tokens (login/session management)
- Nodemailer or SendGrid (reminder emails)

---

## Database Schema (Core Tables)

```
USERS
├── id (PK)
├── email (unique)
├── password_hash
├── name
├── role (member/admin)
├── created_at

EVENTS
├── id (PK)
├── title
├── description
├── date
├── event_type (birthday/reminder/other)
├── created_by (FK → users.id)
├── created_at

EVENT_REMINDERS
├── id (PK)
├── event_id (FK → events.id)
├── user_id (FK → users.id)
├── reminder_sent (boolean)
├── reminder_date

PHOTOS
├── id (PK)
├── title
├── caption
├── image_url (S3)
├── uploaded_by (FK → users.id)
├── created_at

REMINDER_SUBSCRIPTIONS
├── id (PK)
├── user_id (FK → users.id)
├── event_id (FK → events.id)
├── subscribed_at
```

---

## Core Features & Pages

### 1. **Landing Page**
- Hero section with featured family photos
- Upcoming events preview
- Birthday calendar widget
- Sign-up/Login buttons
- Gallery preview

### 2. **Authentication**
- Sign up form (name, email, password)
- Login form
- Forgot password (email reset link)
- Profile page (members only)

### 3. **Calendar Page** (Members Only)
- Interactive calendar view (month/week)
- Add event modal
- Edit/delete events (own events + admin)
- Click event for details
- Subscribe to reminders button

### 4. **Content Management Page** (Members Only)
- Upload photos with captions
- Create/edit text posts
- Manage events
- View submissions queue

### 5. **Photo Gallery**
- Grid/masonry layout
- Filter by date/category
- Full-screen view
- Caption + photographer info

### 6. **Admin Dashboard**
- User management
- Approve submissions (if moderation enabled)
- View reminder logs

---

## Key API Endpoints

```
Auth:
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

Events:
GET    /api/events (all upcoming)
POST   /api/events (create)
PUT    /api/events/:id (update)
DELETE /api/events/:id (delete)
GET    /api/events/:id/reminders (subscribers)

Reminders:
POST   /api/reminders/subscribe
DELETE /api/reminders/unsubscribe

Photos:
GET    /api/photos (gallery)
POST   /api/photos (upload)
DELETE /api/photos/:id

Users:
GET    /api/users/:id (profile)
PUT    /api/users/:id (update profile)
```

---

## Security Considerations

- ✓ Hash passwords (bcrypt)
- ✓ JWT for session management
- ✓ HTTPS only
- ✓ CORS configured for your domain
- ✓ Input validation & sanitization
- ✓ Rate limiting on auth endpoints
- ✓ S3 presigned URLs for image uploads
- ✓ Member-only routes protected by middleware

---

## Reminder System

1. **Background Job (Cron/Scheduler)**
   - Runs daily/every 6 hours
   - Checks REMINDER_SUBSCRIPTIONS table for upcoming events
   - Sends emails via Nodemailer/SendGrid
   - Updates `reminder_sent` flag

2. **Event Types**
   - Birthday (recurring annually)
   - Anniversary (recurring)
   - One-time events

---

## Deployment Options

- **Backend:** Heroku, AWS EC2, Railway, Vercel (serverless)
- **Frontend:** Vercel, Netlify
- **Database:** AWS RDS, Supabase, Railway
- **Images:** AWS S3, Cloudinary

---

## Development Phases

**Phase 1:** Core auth + landing page + basic calendar
**Phase 2:** Photo gallery + event management
**Phase 3:** Reminder system + email notifications
**Phase 4:** Admin dashboard + advanced features

---

## Next Steps

1. Choose final tech stack preferences
2. Set up database schema
3. Initialize project repos (frontend + backend)
4. Build authentication flows
5. Design database migrations

Questions? Any preferences on tech stack?
