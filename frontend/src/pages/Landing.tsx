import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventsApi, photosApi } from '../api';
import { Event, Photo } from '../types';
import '../styles/Landing.css';

export function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [photosRes, eventsRes] = await Promise.all([photosApi.getAll(), eventsApi.getAll()]);

        if (photosRes.success && photosRes.data) {
          setPhotos((photosRes.data as Photo[]).slice(0, 6));
        }

        if (eventsRes.success && eventsRes.data) {
          const events = (eventsRes.data as Event[]).filter((e) => new Date(e.date) > new Date());
          setUpcomingEvents(events.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/calendar');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to the Jones Family</h1>
          <p>Share moments, celebrate milestones, stay connected</p>
          <button onClick={handleGetStarted} className="btn btn-primary">
            {user ? 'View Calendar' : 'Get Started'}
          </button>
        </div>
        {photos.length > 0 && (
          <div className="hero-image">
            <img src={photos[0].imageUrl} alt="Family" />
          </div>
        )}
      </section>

      {/* Photo Gallery Preview */}
      {photos.length > 0 && (
        <section className="gallery-preview">
          <h2>Family Photos</h2>
          <div className="photo-grid">
            {photos.map((photo) => (
              <div key={photo.id} className="photo-card">
                <img src={photo.imageUrl} alt={photo.title} />
                <h3>{photo.title}</h3>
                <p>{photo.caption}</p>
              </div>
            ))}
          </div>
          {!user && (
            <button onClick={() => navigate('/login')} className="btn btn-secondary">
              Sign In to View All Photos
            </button>
          )}
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="upcoming-events">
          <h2>Upcoming Events</h2>
          <div className="events-list">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="event-item">
                <div className="event-date">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <span className="event-type">{event.type}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      {!user && (
        <section className="cta">
          <h2>Join the Family</h2>
          <p>Create an account to share photos, manage events, and stay connected</p>
          <div className="cta-buttons">
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Login
            </button>
            <button onClick={() => navigate('/signup')} className="btn btn-secondary">
              Sign Up
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
