import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { db } from './database';
import { authenticateToken, requireAdmin, generateToken } from './middleware';
import { User } from './types';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// ============= AUTH ROUTES =============

app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = db.createUser({
      email,
      name,
      passwordHash,
      role: 'member',
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      data: { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Signup failed' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      data: { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email required' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return res.json({
        success: true,
        message: 'If email exists, reset link sent to inbox',
      });
    }

    // Simulate sending reset email
    res.json({
      success: true,
      message: 'Password reset link sent to email',
      // In real app, would send actual email
      debug: { resetToken: jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' }) },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to process request' });
  }
});

app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, error: 'Token and password required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = db.findUserById(decoded.userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Invalid or expired token' });
  }
});

// ============= EVENT ROUTES =============

app.get('/api/events', (req: Request, res: Response) => {
  try {
    const events = db.getAllEvents();
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch events' });
  }
});

app.get('/api/events/:id', (req: Request, res: Response) => {
  try {
    const event = db.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch event' });
  }
});

app.post('/api/events', authenticateToken, (req: Request, res: Response) => {
  try {
    const { title, description, date, type } = req.body;

    if (!title || !date || !type) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const event = db.createEvent({
      title,
      description: description || '',
      date: new Date(date),
      type,
      createdBy: req.user!.userId,
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create event' });
  }
});

app.put('/api/events/:id', authenticateToken, (req: Request, res: Response) => {
  try {
    const event = db.getEventById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (event.createdBy !== req.user!.userId && req.user!.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const updated = db.updateEvent(req.params.id, {
      title: req.body.title || event.title,
      description: req.body.description !== undefined ? req.body.description : event.description,
      date: req.body.date ? new Date(req.body.date) : event.date,
      type: req.body.type || event.type,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update event' });
  }
});

app.delete('/api/events/:id', authenticateToken, (req: Request, res: Response) => {
  try {
    const event = db.getEventById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (event.createdBy !== req.user!.userId && req.user!.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    db.deleteEvent(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete event' });
  }
});

// ============= PHOTO ROUTES =============

app.get('/api/photos', (req: Request, res: Response) => {
  try {
    const photos = db.getAllPhotos();
    res.json({ success: true, data: photos });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch photos' });
  }
});

app.post('/api/photos', authenticateToken, (req: Request, res: Response) => {
  try {
    const { title, caption, imageUrl } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const photo = db.createPhoto({
      title,
      caption: caption || '',
      imageUrl,
      uploadedBy: req.user!.userId,
    });

    res.status(201).json({ success: true, data: photo });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to upload photo' });
  }
});

app.delete('/api/photos/:id', authenticateToken, (req: Request, res: Response) => {
  try {
    const photo = db.photos.find((p) => p.id === req.params.id);

    if (!photo) {
      return res.status(404).json({ success: false, error: 'Photo not found' });
    }

    if (photo.uploadedBy !== req.user!.userId && req.user!.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    db.deletePhoto(req.params.id);
    res.json({ success: true, message: 'Photo deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete photo' });
  }
});

// ============= REMINDER ROUTES =============

app.post('/api/reminders/subscribe', authenticateToken, (req: Request, res: Response) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ success: false, error: 'Event ID required' });
    }

    const event = db.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const reminder = db.subscribeToReminder(eventId, req.user!.userId);
    res.status(201).json({
      success: true,
      message: 'Subscribed to event reminders',
      data: reminder,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to subscribe' });
  }
});

app.post('/api/reminders/unsubscribe', authenticateToken, (req: Request, res: Response) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ success: false, error: 'Event ID required' });
    }

    const success = db.unsubscribeFromReminder(eventId, req.user!.userId);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Reminder not found' });
    }

    res.json({ success: true, message: 'Unsubscribed from event reminders' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to unsubscribe' });
  }
});

app.get('/api/reminders/my-subscriptions', authenticateToken, (req: Request, res: Response) => {
  try {
    const reminders = db.getUserReminders(req.user!.userId);
    res.json({ success: true, data: reminders });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch reminders' });
  }
});

// ============= ADMIN ROUTES =============

app.get('/api/admin/users', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  try {
    const users = db.getAllUsers().map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt,
    }));
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

app.get('/api/admin/stats', authenticateToken, requireAdmin, (req: Request, res: Response) => {
  try {
    const stats = {
      totalUsers: db.users.length,
      totalEvents: db.events.length,
      totalPhotos: db.photos.length,
      totalReminders: db.reminders.length,
      upcomingEvents: db.events.filter((e) => new Date(e.date) > new Date()).length,
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

// ============= HEALTH CHECK =============

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Backend running on http://localhost:${PORT}`);
  console.log(`✓ CORS enabled`);
  console.log(`✓ Mock database initialized`);
});
