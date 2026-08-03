import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Calendar } from './pages/Calendar';
import { Gallery } from './pages/Gallery';
import { Admin } from './pages/Admin';
import './styles/App.css';

function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="/" className="nav-logo">
          🏠 Jones Family
        </a>

        <div className="nav-menu">
          <a href="/" className="nav-link">
            Home
          </a>
          {user && (
            <>
              <a href="/calendar" className="nav-link">
                📅 Calendar
              </a>
              <a href="/gallery" className="nav-link">
                📸 Gallery
              </a>
              {user.role === 'admin' && (
                <a href="/admin" className="nav-link">
                  ⚙️ Admin
                </a>
              )}
            </>
          )}
        </div>

        <div className="nav-auth">
          {user ? (
            <>
              <span className="user-name">Hi, {user.name}!</span>
              <button onClick={logout} className="btn btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="btn btn-secondary">
                Login
              </a>
              <a href="/signup" className="btn btn-primary">
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user && user.role === 'admin' ? <>{children}</> : <Navigate to="/" />;
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gallery"
                element={
                  <ProtectedRoute>
                    <Gallery />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
