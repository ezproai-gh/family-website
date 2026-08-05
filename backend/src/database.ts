import { v4 as uuidv4 } from 'uuid';
import { User, Event, Photo, EventReminder } from './types';

class Database {
  users: User[] = [];
  events: Event[] = [];
  photos: Photo[] = [];
  reminders: EventReminder[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create demo users
    this.users = [
      {
        id: 'user-1',
        email: 'chris@ezproai.com',
        name: 'Chris Jones',
        passwordHash: '$2a$10$XQvhPsKgzjH8e0eH0e0e0u0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e', // password: demo123
        role: 'admin',
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'user-2',
        email: 'family@example.com',
        name: 'Family Member',
        passwordHash: '$2a$10$XQvhPsKgzjH8e0eH0e0e0u0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e', // password: demo123
        role: 'member',
        createdAt: new Date('2024-01-15'),
      },
    ];

    // Create demo events
    const today = new Date();
    this.events = [
      {
        id: 'event-1',
        title: "Chris's Birthday",
        description: 'Happy Birthday!',
        date: new Date(today.getFullYear(), today.getMonth(), 15),
        type: 'birthday',
        createdBy: 'user-1',
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'event-2',
        title: 'Family Reunion',
        description: 'Annual family gathering at the park',
        date: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        type: 'event',
        createdBy: 'user-1',
        createdAt: new Date('2024-01-02'),
      },
      {
        id: 'event-3',
        title: "Sarah's Birthday",
        description: 'Happy Birthday!',
        date: new Date(today.getFullYear(), today.getMonth() + 2, 10),
        type: 'birthday',
        createdBy: 'user-1',
        createdAt: new Date('2024-01-03'),
      },
    ];

    // Create demo photos (loaded from public folder)
    this.photos = [
      {
        id: 'photo-1',
        title: 'Family Gathering',
        caption: 'A wonderful day with the whole family',
        imageUrl: '/photos/26E12E3D-7176-43B0-8067-085B6AB1146B_1_105_c.jpeg',
        uploadedBy: 'user-1',
        createdAt: new Date('2024-06-15'),
      },
      {
        id: 'photo-2',
        title: 'Summer Fun',
        caption: 'Beautiful summer day at the park',
        imageUrl: '/photos/7CF88B81-B7DB-4BF9-BD15-44609D0E5ECA_1_105_c.jpeg',
        uploadedBy: 'user-1',
        createdAt: new Date('2024-06-20'),
      },
      {
        id: 'photo-3',
        title: 'Holiday Memories',
        caption: 'Celebrating together',
        imageUrl: '/photos/92165743-A344-42DC-86D4-51CCA5D1E60C_1_105_c.jpeg',
        uploadedBy: 'user-2',
        createdAt: new Date('2024-07-01'),
      },
      {
        id: 'photo-4',
        title: 'Adventure Time',
        caption: 'Exploring new places',
        imageUrl: '/photos/B33748A5-0391-4A38-9E49-811B2248F171_1_105_c.jpeg',
        uploadedBy: 'user-2',
        createdAt: new Date('2024-07-10'),
      },
      {
        id: 'photo-5',
        title: 'Beautiful Sunset',
        caption: 'Golden hour moments',
        imageUrl: '/photos/C791D460-1CCA-4DA9-B610-102CAE535E80_1_102_o.jpeg',
        uploadedBy: 'user-1',
        createdAt: new Date('2024-07-15'),
      },
      {
        id: 'photo-6',
        title: 'Outdoor Fun',
        caption: 'Making memories outdoors',
        imageUrl: '/photos/CE6C6CEA-D0DD-42FE-8C33-6405DCCFDB71_1_105_c.jpeg',
        uploadedBy: 'user-2',
        createdAt: new Date('2024-07-20'),
      },
      {
        id: 'photo-7',
        title: 'Quality Time',
        caption: 'Enjoying each other\'s company',
        imageUrl: '/photos/DB503490-8066-4AC9-B099-1EEACA5DE3CC_1_105_c.jpeg',
        uploadedBy: 'user-1',
        createdAt: new Date('2024-07-25'),
      },
      {
        id: 'photo-8',
        title: 'Special Moments',
        caption: 'Cherishing our time together',
        imageUrl: '/photos/FAED38C2-72E6-4E3D-8292-202382959A33_1_105_c.jpeg',
        uploadedBy: 'user-2',
        createdAt: new Date('2024-08-01'),
      },
    ];
  }

  // User methods
  findUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  findUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: uuidv4(),
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  getAllUsers(): User[] {
    return this.users;
  }

  // Event methods
  getAllEvents(): Event[] {
    return this.events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getEventById(id: string): Event | undefined {
    return this.events.find((e) => e.id === id);
  }

  createEvent(event: Omit<Event, 'id' | 'createdAt'>): Event {
    const newEvent: Event = {
      ...event,
      id: uuidv4(),
      createdAt: new Date(),
    };
    this.events.push(newEvent);
    return newEvent;
  }

  updateEvent(id: string, updates: Partial<Event>): Event | undefined {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) return undefined;
    this.events[index] = { ...this.events[index], ...updates };
    return this.events[index];
  }

  deleteEvent(id: string): boolean {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) return false;
    this.events.splice(index, 1);
    this.reminders = this.reminders.filter((r) => r.eventId !== id);
    return true;
  }

  // Photo methods
  getAllPhotos(): Photo[] {
    return this.photos.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  createPhoto(photo: Omit<Photo, 'id' | 'createdAt'>): Photo {
    const newPhoto: Photo = {
      ...photo,
      id: uuidv4(),
      createdAt: new Date(),
    };
    this.photos.push(newPhoto);
    return newPhoto;
  }

  deletePhoto(id: string): boolean {
    const index = this.photos.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.photos.splice(index, 1);
    return true;
  }

  // Reminder methods
  subscribeToReminder(eventId: string, userId: string): EventReminder {
    const existing = this.reminders.find((r) => r.eventId === eventId && r.userId === userId);
    if (existing) return existing;

    const reminder: EventReminder = {
      id: uuidv4(),
      eventId,
      userId,
      reminderSent: false,
      reminderDate: new Date(),
    };
    this.reminders.push(reminder);
    return reminder;
  }

  unsubscribeFromReminder(eventId: string, userId: string): boolean {
    const index = this.reminders.findIndex((r) => r.eventId === eventId && r.userId === userId);
    if (index === -1) return false;
    this.reminders.splice(index, 1);
    return true;
  }

  getRemindersForEvent(eventId: string): EventReminder[] {
    return this.reminders.filter((r) => r.eventId === eventId);
  }

  getUserReminders(userId: string): EventReminder[] {
    return this.reminders.filter((r) => r.userId === userId);
  }

  sendReminder(reminderId: string): boolean {
    const reminder = this.reminders.find((r) => r.id === reminderId);
    if (!reminder) return false;
    reminder.reminderSent = true;
    return true;
  }
}

export const db = new Database();
