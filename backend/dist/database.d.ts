import { User, Event, Photo, EventReminder } from './types';
declare class Database {
    users: User[];
    events: Event[];
    photos: Photo[];
    reminders: EventReminder[];
    constructor();
    private initializeMockData;
    findUserByEmail(email: string): User | undefined;
    findUserById(id: string): User | undefined;
    createUser(user: Omit<User, 'id' | 'createdAt'>): User;
    getAllUsers(): User[];
    getAllEvents(): Event[];
    getEventById(id: string): Event | undefined;
    createEvent(event: Omit<Event, 'id' | 'createdAt'>): Event;
    updateEvent(id: string, updates: Partial<Event>): Event | undefined;
    deleteEvent(id: string): boolean;
    getAllPhotos(): Photo[];
    createPhoto(photo: Omit<Photo, 'id' | 'createdAt'>): Photo;
    deletePhoto(id: string): boolean;
    subscribeToReminder(eventId: string, userId: string): EventReminder;
    unsubscribeFromReminder(eventId: string, userId: string): boolean;
    getRemindersForEvent(eventId: string): EventReminder[];
    getUserReminders(userId: string): EventReminder[];
    sendReminder(reminderId: string): boolean;
}
export declare const db: Database;
export {};
//# sourceMappingURL=database.d.ts.map