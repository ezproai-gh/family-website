import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../api';
import '../styles/Admin.css';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalEvents: number;
  totalPhotos: number;
  totalReminders: number;
  upcomingEvents: number;
}

export function Admin() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!token) return;

    try {
      const [statsRes, usersRes] = await Promise.all([
        adminApi.getStats(token),
        adminApi.getUsers(token),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data as Stats);
      }

      if (usersRes.success && usersRes.data) {
        setUsers(usersRes.data as User[]);
      }
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-container"><p>Loading...</p></div>;

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Events</h3>
            <p className="stat-number">{stats.totalEvents}</p>
          </div>
          <div className="stat-card">
            <h3>Total Photos</h3>
            <p className="stat-number">{stats.totalPhotos}</p>
          </div>
          <div className="stat-card">
            <h3>Reminder Subscriptions</h3>
            <p className="stat-number">{stats.totalReminders}</p>
          </div>
          <div className="stat-card">
            <h3>Upcoming Events</h3>
            <p className="stat-number">{stats.upcomingEvents}</p>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="users-section">
        <h2>Family Members</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
