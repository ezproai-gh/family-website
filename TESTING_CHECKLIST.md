# Testing Checklist

Complete this checklist to verify all features are working correctly.

## ✅ Setup

- [ ] Backend running: `npm run dev` in `/backend`
- [ ] Frontend running: `npm run dev` in `/frontend`
- [ ] No console errors in browser
- [ ] No console errors in terminal

## Authentication Tests

### Signup
- [ ] Navigate to `/signup`
- [ ] Fill in: Name, Email, Password, Confirm Password
- [ ] Click "Sign Up"
- [ ] Redirected to Calendar
- [ ] User name appears in navbar
- [ ] Token stored in localStorage

### Login
- [ ] Click "Logout" (if logged in)
- [ ] Go to `/login`
- [ ] Enter: `chris@ezproai.com` / `demo123`
- [ ] Click "Login"
- [ ] Redirected to Calendar
- [ ] "Hi, Chris!" appears in navbar

### Password Reset
- [ ] On login page, click "Forgot password?"
- [ ] Enter email address
- [ ] Message: "Password reset link sent to email"
- [ ] (Note: Email sending is simulated in this preview)

### Protected Routes
- [ ] Logout
- [ ] Try to access `/calendar` directly
- [ ] Redirected to `/login`
- [ ] Try to access `/admin` (not admin user)
- [ ] Redirected to home

## Landing Page Tests

- [ ] Visit `/`
- [ ] See "Welcome to the Jones Family" heading
- [ ] Hero section displays with image
- [ ] Featured photos grid visible (should show 6 photos)
- [ ] Upcoming events list shows
- [ ] Event dates formatted correctly
- [ ] Event types (birthday, anniversary, etc.) displayed
- [ ] CTA section with Login/Sign Up buttons visible
- [ ] Buttons work when not logged in
- [ ] "View Calendar" button shows when logged in

## Calendar Tests

### View Calendar
- [ ] Navigate to `/calendar` (while logged in)
- [ ] Calendar displays current month
- [ ] Days of week headers visible
- [ ] Correct number of days in month
- [ ] Previous/next month buttons work
- [ ] Upcoming events list displays

### Create Event
- [ ] Click "+ Add Event" button
- [ ] Event form appears
- [ ] Fill in:
  - [ ] Title: "Test Birthday"
  - [ ] Description: "Testing"
  - [ ] Date: Pick a future date
  - [ ] Type: "Birthday"
- [ ] Click "Create Event"
- [ ] Success message appears
- [ ] Event appears in events list
- [ ] Event appears on calendar (colored dot)

### Subscribe to Reminder
- [ ] Click "🔕 Subscribe to Reminder" on an event
- [ ] Button changes to "🔔 Subscribed"
- [ ] Success message: "Subscribed to event reminders!"
- [ ] Click "🔔 Subscribed" again
- [ ] Button changes back to "🔕 Subscribe"
- [ ] Success message: "Unsubscribed from reminders"

### Event Type Colors
- [ ] Birthday events show orange dot (🎂)
- [ ] Anniversary events show pink dot (💕)
- [ ] Regular events show blue dot (📅)
- [ ] Reminder events show teal dot (🔔)

## Gallery Tests

### View Photos
- [ ] Navigate to `/gallery` (while logged in)
- [ ] Gallery grid displays all 8 photos
- [ ] Photos load correctly (no broken images)
- [ ] Photos are responsive (resize browser to test)
- [ ] Hover over photo shows title and caption
- [ ] Click photo to open modal

### Photo Modal
- [ ] Modal opens with full-size image
- [ ] Photo title displayed
- [ ] Photo caption displayed
- [ ] Date uploaded shown
- [ ] Close button (✕) visible and works
- [ ] Click outside modal closes it
- [ ] (Admin only) Delete button visible for admins

### Upload Photo
- [ ] Click "+ Upload Photo" button
- [ ] Form appears with fields:
  - [ ] Photo Title
  - [ ] Caption
  - [ ] Image URL
- [ ] Enter valid image URL
- [ ] Preview shows
- [ ] Submit form
- [ ] Success message
- [ ] New photo appears in gallery
- [ ] Refresh page - photo still there

## Admin Dashboard Tests

### Access Admin Panel
- [ ] Login as `chris@ezproai.com` / `demo123`
- [ ] ⚙️ Admin link visible in navbar
- [ ] Click Admin link
- [ ] Admin dashboard loads

### Admin Stats
- [ ] Total Users card shows count (should be ≥ 2)
- [ ] Total Events card shows count (should be ≥ 3)
- [ ] Total Photos card shows count (should be ≥ 8)
- [ ] Reminder Subscriptions shows count
- [ ] Upcoming Events shows count

### Users Table
- [ ] Table displays all users
- [ ] Columns: Name, Email, Role, Joined
- [ ] Admin users show "admin" badge
- [ ] Member users show "member" badge
- [ ] Join dates formatted correctly
- [ ] Table is sortable/scrollable

### Admin-Only Access
- [ ] Logout as admin
- [ ] Create/login as regular member
- [ ] Go to `/admin`
- [ ] Redirected to home page
- [ ] No ⚙️ Admin link in navbar

## Responsive Design Tests

### Mobile (max-width: 768px)
- [ ] Navbar stacks vertically
- [ ] Navigation menu collapses
- [ ] Calendar grid is readable
- [ ] Gallery grid adapts to smaller screens
- [ ] Forms are mobile-friendly
- [ ] Buttons are easily tappable

### Tablet (768px - 1024px)
- [ ] Calendar layout still works
- [ ] Gallery 2-3 columns
- [ ] Events section readable
- [ ] Stats cards stack

### Desktop (1024px+)
- [ ] Calendar and events side-by-side
- [ ] Photo grid 3-4 columns
- [ ] Stats grid horizontal
- [ ] All elements properly aligned

## Error Handling Tests

### Network Errors
- [ ] Submit form with invalid data
- [ ] Error message displays
- [ ] Can try again without page reload

### Authentication Errors
- [ ] Try login with wrong password
- [ ] Error message: "Invalid credentials"
- [ ] Try signup with existing email
- [ ] Error message: "Email already exists"

### Validation Errors
- [ ] Try submit form with missing fields
- [ ] Form validation prevents submission
- [ ] Password mismatch on signup
- [ ] Error message: "Passwords do not match"

## Browser Console Tests

- [ ] No 404 errors for images
- [ ] No CORS errors
- [ ] No TypeScript errors
- [ ] No console warnings (except normal React dev warnings)

## Performance Tests

- [ ] Pages load within 2 seconds
- [ ] No visible lag when typing
- [ ] Calendar transitions smooth
- [ ] Photo modal opens smoothly
- [ ] No memory leaks (check DevTools Memory tab)

## API Tests (Optional - Using Terminal)

### Health Check
```bash
curl http://localhost:5000/api/health
# Should return: {"success":true,"message":"Server is running"}
```

### Get Events
```bash
curl http://localhost:5000/api/events
# Should return JSON array of events
```

### Get Photos
```bash
curl http://localhost:5000/api/photos
# Should return JSON array of photos
```

## Sign-Out & Persistence Tests

- [ ] Close browser tab completely
- [ ] Open new tab to `http://localhost:3000`
- [ ] Still logged in (token in localStorage)
- [ ] Click logout
- [ ] Try to access calendar
- [ ] Redirected to login
- [ ] localStorage cleared

## Edge Cases

- [ ] Create event with future date 5+ years away - shows correctly
- [ ] Create event with past date - still appears in list
- [ ] Photo upload with very long title/caption - displays correctly
- [ ] Very long email on signup - validates properly
- [ ] Multiple reminders on same event - all track correctly
- [ ] Create 50+ events - calendar still responsive

## Final Checklist

- [ ] All above tests passed
- [ ] No critical bugs found
- [ ] UI matches design mockups
- [ ] All features documented in README
- [ ] Demo credentials work
- [ ] Code is clean and commented
- [ ] No console errors
- [ ] Ready for demo/presentation

---

## Test Summary

**Total Tests:** 80+
**Estimated Time:** 30-45 minutes

**After completion, mark date tested:**
- Date Tested: _______________
- Tester Name: _______________
- Any Issues: __________________
