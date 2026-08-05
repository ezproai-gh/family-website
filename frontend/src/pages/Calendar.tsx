import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsApi, remindersApi } from '../api';
import { Event, EventReminder } from '../types';
import '../styles/Calendar.css';

export function Calendar() {
  const { user, token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [reminders, setReminders] = useState<EventReminder[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'event' as const,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsRes, remindersRes] = await Promise.all([
        eventsApi.getAll(),
        token ? remindersApi.getMySubscriptions(token) : Promise.resolve({ success: true, data: [] }),
      ]);

      if (eventsRes.success && eventsRes.data) {
        setEvents((eventsRes.data as Event[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      }

      if (remindersRes.success && remindersRes.data) {
        setReminders(remindersRes.data as EventReminder[]);
      }
    } catch (err) {
      setError('Failed to load calendar data');
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setError('');
      const result = await eventsApi.create(
        {
          ...formData,
          date: new Date(formData.date),
        },
        token
      );

      if (result.success) {
        setFormData({ title: '', description: '', date: new Date().toISOString().split('T')[0], type: 'event' });
        setShowCreateForm(false);
        setSuccess('Event created successfully!');
        await loadData();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    }
  };

  const handleSubscribeReminder = async (eventId: string) => {
    if (!token) return;

    try {
      const result = await remindersApi.subscribe(eventId, token);
      if (result.success) {
        setSuccess('Subscribed to reminders!');
        await loadData();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
    }
  };

  const handleUnsubscribeReminder = async (eventId: string) => {
    if (!token) return;

    try {
      const result = await remindersApi.unsubscribe(eventId, token);
      if (result.success) {
        setSuccess('Unsubscribed from reminders');
        await loadData();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unsubscribe');
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const eventsForMonth = events.filter((e) => {
    const eventDate = new Date(e.date);
    return eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear();
  });

  const isEventSubscribed = (eventId: string) => reminders.some((r) => r.eventId === eventId);

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="calendar-container">
      <h1>Family Calendar</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="calendar-layout">
        {/* Calendar View */}
        <div className="calendar-section">
          <div className="month-header">
            <button onClick={handlePrevMonth}>←</button>
            <h2>
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={handleNextMonth}>→</button>
          </div>

          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}

            {days.map((day, idx) => {
              const dayEvents = day
                ? eventsForMonth.filter((e) => {
                    const eventDate = new Date(e.date);
                    return eventDate.getDate() === day;
                  })
                : [];

              return (
                <div key={idx} className={`calendar-day ${day ? '' : 'empty'}`}>
                  {day && (
                    <>
                      <div className="day-number">{day}</div>
                      <div className="day-events">
                        {dayEvents.slice(0, 2).map((e) => (
                          <div key={e.id} className={`event-dot ${e.type}`} title={e.title} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Events List */}
        <div className="events-section">
          <div className="events-header">
            <h2>Upcoming Events</h2>
            {user && (
              <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn btn-primary">
                + Add Event
              </button>
            )}
          </div>

          {showCreateForm && user && (
            <form className="event-form" onSubmit={handleCreateEvent}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="event">Event</option>
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Create Event
                </button>
                <button type="button" onClick={() => setShowCreateForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="events-list">
            {events.slice(0, 10).map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <span className={`event-type-badge ${event.type}`}>{event.type}</span>
                </div>
                <p>{event.description}</p>
                <div className="event-date">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                {user && (
                  <button
                    onClick={() =>
                      isEventSubscribed(event.id)
                        ? handleUnsubscribeReminder(event.id)
                        : handleSubscribeReminder(event.id)
                    }
                    className={`btn ${isEventSubscribed(event.id) ? 'btn-subscribed' : 'btn-subscribe'}`}
                  >
                    {isEventSubscribed(event.id) ? '🔔 Subscribed' : '🔕 Subscribe to Reminder'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
