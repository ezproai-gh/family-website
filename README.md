# Family Website - Preview Build

A full-stack family website with authentication, event calendar, photo gallery, and admin dashboard.

## Features

✅ **Authentication System**
- User signup/login with JWT tokens
- Password reset functionality
- Secure session management

✅ **Event Calendar**
- Monthly calendar view
- Create/edit/delete events
- Event types: Birthday, Anniversary, Event, Reminder
- Subscribe to event reminders

✅ **Photo Gallery**
- Upload and display family photos
- Photo titles and captions
- Modal view for full-size images
- Delete functionality (admin)

✅ **Admin Dashboard**
- View family member statistics
- Manage users
- Monitor reminders and events

✅ **Best Practices**
- TypeScript for type safety
- Secure password hashing (bcryptjs)
- JWT authentication tokens
- Input validation
- Error handling
- Responsive design

## Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- In-memory mock database
- JWT authentication

**Frontend:**
- React 18 + TypeScript
- React Router for navigation
- Context API for state management
- Vite for bundling

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Setup & Installation

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

## Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

You'll see:
```
✓ Backend running on http://localhost:5000
✓ CORS enabled
✓ Mock database initialized
```

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

Visit `http://localhost:3000` in your browser.

## Demo Credentials

### Admin Account
- **Email:** chris@ezproai.com
- **Password:** demo123

### Member Account  
- **Email:** family@example.com
- **Password:** demo123

## Project Structure

```
ChrisJonesFamily/
├── backend/
│   ├── src/
│   │   ├── index.ts          (Main server & routes)
│   │   ├── database.ts       (Mock data store)
│   │   ├── types.ts          (TypeScript interfaces)
│   │   └── middleware.ts     (Auth middleware)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx           (Main app component)
│   │   ├── main.tsx          (Entry point)
│   │   ├── api.ts            (API client)
│   │   ├── types.ts          (TypeScript interfaces)
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Calendar.tsx
│   │   │   ├── Gallery.tsx
│   │   │   └── Admin.tsx
│   │   └── styles/
│   │       ├── App.css
│   │       ├── Landing.css
│   │       ├── Auth.css
│   │       ├── Calendar.css
│   │       ├── Gallery.css
│   │       └── Admin.css
│   ├── public/photos/        (Family photos)
│   ├── package.json
│   └── tsconfig.json
│
├── pictures/                 (Original photo files)
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (auth required)
- `PUT /api/events/:id` - Update event (auth required)
- `DELETE /api/events/:id` - Delete event (auth required)

### Photos
- `GET /api/photos` - Get all photos
- `POST /api/photos` - Upload photo (auth required)
- `DELETE /api/photos/:id` - Delete photo (auth required)

### Reminders
- `POST /api/reminders/subscribe` - Subscribe to event reminders (auth required)
- `POST /api/reminders/unsubscribe` - Unsubscribe (auth required)
- `GET /api/reminders/my-subscriptions` - Get user's reminders (auth required)

### Admin
- `GET /api/admin/users` - List all users (admin required)
- `GET /api/admin/stats` - Get system statistics (admin required)

## Features Walkthrough

### Landing Page
- View featured photos
- See upcoming events
- Call-to-action buttons for login/signup

### Authentication
- Create new account with email, name, password
- Login with email and password
- Password reset via email simulation
- Demo credentials for testing

### Calendar
- Monthly calendar view with event dots
- Upcoming events list
- Create new events (members only)
- Subscribe/unsubscribe from event reminders
- Event types with color coding

### Photo Gallery
- Grid view of all family photos
- Upload new photos with titles and captions
- Modal view for full-size images
- Delete photos (admin)
- Hover overlay with photo info

### Admin Dashboard
- System statistics (users, events, photos, reminders)
- Family members list with roles and join dates
- User management interface

## Authentication Flow

1. User signs up or logs in
2. Backend validates credentials and returns JWT token
3. Token stored in localStorage
4. Token sent with all authenticated requests via Authorization header
5. Token verified server-side before access to protected routes
6. Logout clears token from localStorage

## Mock Data Features

The application includes pre-loaded mock data:
- 2 demo users (admin + member)
- 3 upcoming events
- 8 family photos from your pictures folder
- Event reminders system

All data is stored in memory and resets on server restart.

## Security Notes

**This is a preview/mockup build. For production:**
- Use real PostgreSQL database instead of in-memory storage
- Implement real email sending for password resets
- Add rate limiting on auth endpoints
- Use HTTPS in production
- Implement refresh token rotation
- Add CSRF protection
- Validate all inputs server-side
- Implement audit logging

## Development Commands

### Backend
- `npm run dev` - Start dev server with auto-reload
- `npm run build` - Build TypeScript
- `npm start` - Run compiled JavaScript

### Frontend  
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Troubleshooting

### CORS Errors
- Make sure backend is running on port 5000
- Frontend proxy is configured in `vite.config.ts`

### Photos Not Loading
- Ensure `/frontend/public/photos/` folder exists
- Photos should be in this folder for Vite to serve them
- Check browser console for 404 errors

### Cannot Login
- Use demo credentials: `chris@ezproai.com` / `demo123`
- Clear localStorage: `localStorage.clear()` in console
- Restart backend server

### Port Already in Use
- Backend: `lsof -i :5000` then `kill -9 <PID>`
- Frontend: `lsof -i :3000` then `kill -9 <PID>`

## Next Steps for Production

1. **Database:** Replace in-memory storage with PostgreSQL
2. **Authentication:** Implement OAuth (Google, Apple)
3. **File Storage:** Use S3 or Cloudinary for images
4. **Email:** Integrate SendGrid for reminder notifications
5. **Deployment:** Deploy to Vercel (frontend) + Heroku/AWS (backend)
6. **Testing:** Add unit and integration tests
7. **Monitoring:** Set up error tracking and analytics
8. **Documentation:** Create API documentation with Swagger

## Notes

- This is a functional preview with mock/simulated features
- Email reminders show confirmation in UI (no real emails sent)
- All data is in-memory and resets on server restart
- Password hashing uses bcryptjs for security
- JWT tokens expire after 7 days

## Support

For issues or questions, check the TECHNICAL_ARCHITECTURE.md file for detailed design documentation.

---

**Happy building! 🎉**
