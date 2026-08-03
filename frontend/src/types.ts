export interface User {
  id: string;
  email: string;
  name: string;
  role: 'member' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
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
