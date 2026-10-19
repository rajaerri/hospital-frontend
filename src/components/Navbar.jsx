import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

/**
 * Reusable Navbar Component
 * Features:
 * - Hospital branding logo
 * - Navigation links with active page highlighting
 * - Dynamic session state: shows logged-in patient name and Logout button
 * - Mobile responsive menu toggle
 */
function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    closeMobileMenu();
    logout();
    navigate('/login');
  };

  const displayName = user?.fullName || user?.name || 'Patient';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="brand-icon">+</div>
          <div>
            <div>Life Care</div>
            <span className="brand-subtitle">Hospital Portal</span>
          </div>
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? '✕' : '☰'}
        </button>

        {/* Primary Page Links */}
        <ul className={`navbar-links ${isMobileOpen ? 'open' : ''}`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMobileMenu}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/doctors"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={closeMobileMenu}
            >
              Find Doctors
            </NavLink>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <NavLink
                  to="/appointments"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  onClick={closeMobileMenu}
                >
                  My Appointments
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  onClick={closeMobileMenu}
                >
                  Profile
                </NavLink>
              </li>
            </>
          )}

          {/* Mobile auth buttons inside menu */}
          {isMobileOpen && (
            <li className="navbar-auth open">
              {isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--primary-dark)', padding: '0.5rem 0' }}>
                    👤 {displayName}
                  </div>
                  <Button variant="outline" size="sm" fullWidth onClick={handleLogout}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login" onClick={closeMobileMenu}>
                    <Button variant="outline" size="sm" fullWidth>
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={closeMobileMenu}>
                    <Button variant="primary" size="sm" fullWidth>
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </li>
          )}
        </ul>

        {/* Desktop Auth Controls */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem' }}>
                <span style={{ fontSize: '1.1rem' }}>👤</span> {displayName}
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
