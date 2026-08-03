export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'member' | 'admin';
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'birthday' | 'anniversary' | 'event' | 'reminder';
  createdBy: string;
  createdAt: Date;
}

export interface Photo {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  uploadedBy: string;
  createdAt: Date;
}

export interface EventReminder {
  id: string;
  eventId: string;
  userId: string;
  reminderSent: boolean;
  reminderDate: Date;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
