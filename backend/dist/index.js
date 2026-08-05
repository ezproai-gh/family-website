"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("./database");
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ============= AUTH ROUTES =============
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        const existing = database_1.db.findUserByEmail(email);
        if (existing) {
            return res.status(409).json({ success: false, error: 'Email already exists' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = database_1.db.createUser({
            email,
            name,
            passwordHash,
            role: 'member',
        });
        const token = (0, middleware_1.generateToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        res.status(201).json({
            success: true,
            data: { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Signup failed' });
    }
});
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password required' });
        }
        const user = database_1.db.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        const validPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        const token = (0, middleware_1.generateToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        res.json({
            success: true,
            data: { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Login failed' });
    }
});
app.post('/api/auth/forgot-password', (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email required' });
        }
        const user = database_1.db.findUserByEmail(email);
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
            debug: { resetToken: jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' }) },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to process request' });
    }
});
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ success: false, error: 'Token and password required' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = database_1.db.findUserById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        user.passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
        res.json({ success: true, message: 'Password reset successful' });
    }
    catch (error) {
        res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }
});
// ============= EVENT ROUTES =============
app.get('/api/events', (req, res) => {
    try {
        const events = database_1.db.getAllEvents();
        res.json({ success: true, data: events });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch events' });
    }
});
app.get('/api/events/:id', (req, res) => {
    try {
        const event = database_1.db.getEventById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }
        res.json({ success: true, data: event });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch event' });
    }
});
app.post('/api/events', middleware_1.authenticateToken, (req, res) => {
    try {
        const { title, description, date, type } = req.body;
        if (!title || !date || !type) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        const event = database_1.db.createEvent({
            title,
            description: description || '',
            date: new Date(date),
            type,
            createdBy: req.user.userId,
        });
        res.status(201).json({ success: true, data: event });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create event' });
    }
});
app.put('/api/events/:id', middleware_1.authenticateToken, (req, res) => {
    try {
        const event = database_1.db.getEventById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }
        if (event.createdBy !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }
        const updated = database_1.db.updateEvent(req.params.id, {
            title: req.body.title || event.title,
            description: req.body.description !== undefined ? req.body.description : event.description,
            date: req.body.date ? new Date(req.body.date) : event.date,
            type: req.body.type || event.type,
        });
        res.json({ success: true, data: updated });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update event' });
    }
});
app.delete('/api/events/:id', middleware_1.authenticateToken, (req, res) => {
    try {
        const event = database_1.db.getEventById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }
        if (event.createdBy !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }
        database_1.db.deleteEvent(req.params.id);
        res.json({ success: true, message: 'Event deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete event' });
    }
});
// ============= PHOTO ROUTES =============
app.get('/api/photos', (req, res) => {
    try {
        const photos = database_1.db.getAllPhotos();
        res.json({ success: true, data: photos });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch photos' });
    }
});
app.post('/api/photos', middleware_1.authenticateToken, (req, res) => {
    try {
        const { title, caption, imageUrl } = req.body;
        if (!title || !imageUrl) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        const photo = database_1.db.createPhoto({
            title,
            caption: caption || '',
            imageUrl,
            uploadedBy: req.user.userId,
        });
        res.status(201).json({ success: true, data: photo });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to upload photo' });
    }
});
app.delete('/api/photos/:id', middleware_1.authenticateToken, (req, res) => {
    try {
        const photo = database_1.db.photos.find((p) => p.id === req.params.id);
        if (!photo) {
            return res.status(404).json({ success: false, error: 'Photo not found' });
        }
        if (photo.uploadedBy !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }
        database_1.db.deletePhoto(req.params.id);
        res.json({ success: true, message: 'Photo deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete photo' });
    }
});
// ============= REMINDER ROUTES =============
app.post('/api/reminders/subscribe', middleware_1.authenticateToken, (req, res) => {
    try {
        const { eventId } = req.body;
        if (!eventId) {
            return res.status(400).json({ success: false, error: 'Event ID required' });
        }
        const event = database_1.db.getEventById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }
        const reminder = database_1.db.subscribeToReminder(eventId, req.user.userId);
        res.status(201).json({
            success: true,
            message: 'Subscribed to event reminders',
            data: reminder,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to subscribe' });
    }
});
app.post('/api/reminders/unsubscribe', middleware_1.authenticateToken, (req, res) => {
    try {
        const { eventId } = req.body;
        if (!eventId) {
            return res.status(400).json({ success: false, error: 'Event ID required' });
        }
        const success = database_1.db.unsubscribeFromReminder(eventId, req.user.userId);
        if (!success) {
            return res.status(404).json({ success: false, error: 'Reminder not found' });
        }
        res.json({ success: true, message: 'Unsubscribed from event reminders' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to unsubscribe' });
    }
});
app.get('/api/reminders/my-subscriptions', middleware_1.authenticateToken, (req, res) => {
    try {
        const reminders = database_1.db.getUserReminders(req.user.userId);
        res.json({ success: true, data: reminders });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch reminders' });
    }
});
// ============= ADMIN ROUTES =============
app.get('/api/admin/users', middleware_1.authenticateToken, middleware_1.requireAdmin, (req, res) => {
    try {
        const users = database_1.db.getAllUsers().map((u) => ({
            id: u.id,
            email: u.email,
            name: u.name,
            role: u.role,
            createdAt: u.createdAt,
        }));
        res.json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
});
app.get('/api/admin/stats', middleware_1.authenticateToken, middleware_1.requireAdmin, (req, res) => {
    try {
        const stats = {
            totalUsers: database_1.db.users.length,
            totalEvents: database_1.db.events.length,
            totalPhotos: database_1.db.photos.length,
            totalReminders: database_1.db.reminders.length,
            upcomingEvents: database_1.db.events.filter((e) => new Date(e.date) > new Date()).length,
        };
        res.json({ success: true, data: stats });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch stats' });
    }
});
// ============= HEALTH CHECK =============
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});
// Start server
app.listen(PORT, () => {
    console.log(`✓ Backend running on http://localhost:${PORT}`);
    console.log(`✓ CORS enabled`);
    console.log(`✓ Mock database initialized`);
});
//# sourceMappingURL=index.js.map