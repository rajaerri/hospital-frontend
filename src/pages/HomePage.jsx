import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import './HomePage.css';

/**
 * HomePage Component
 * Landing page of the hospital portal.
 * Introduces hospital services, key stats, specialties, and quick actions.
 */
function HomePage() {
  const departments = [
    { name: 'Cardiology', icon: '❤️' },
    { name: 'Neurology', icon: '🧠' },
    { name: 'Pediatrics', icon: '👶' },
    { name: 'Orthopedics', icon: '🦴' },
    { name: 'General Medicine', icon: '🩺' },
    { name: 'Dermatology', icon: '✨' }
  ];

  return (
    <PageLayout>
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">🏥 Trusted Medical Care</span>
          <h1 className="hero-title">Your Health, Our Highest Priority</h1>
          <p className="hero-subtitle">
            Skip long hospital waiting queues. Connect with certified specialist doctors, 
            schedule appointments online in real-time, and manage your health records effortlessly.
          </p>
          <div className="hero-actions">
            <Link to="/appointments">
              <Button variant="primary" size="lg">
                Book an Appointment
              </Button>
            </Link>
            <Link to="/doctors">
              <Button variant="outline" size="lg">
                View All Doctors
              </Button>
            </Link>
          </div>
        </div>

        <div className="hero-card-badge">
          <div className="badge-icon">⏱️</div>
          <h3>Fast & Easy Booking</h3>
          <p>Book with top specialists in under 60 seconds</p>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/register">
              <Button variant="secondary" size="sm" fullWidth>
                Join as Patient
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Hospital Stats Ribbon */}
      <div className="stats-ribbon">
        <div className="stat-item">
          <div className="stat-number">50+</div>
          <div className="stat-label">Specialist Doctors</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">12+</div>
          <div className="stat-label">Medical Departments</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">25k+</div>
          <div className="stat-label">Patients Treated</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Emergency Support</div>
        </div>
      </div>

      {/* Key System Features */}
      <div className="section-title-wrap">
        <h2 className="section-title">Why Choose Life Care Hospital?</h2>
        <p className="section-subtitle">
          Designed to provide seamless healthcare management for patients, doctors, and hospital administrators.
        </p>
      </div>

      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div className="card feature-card">
          <div className="feature-icon-box">👨‍⚕️</div>
          <h3>Verified Specialists</h3>
          <p>
            Choose from vetted, experienced doctors across Cardiology, Neurology, Pediatrics, Orthopedics, and more.
          </p>
        </div>

        <div className="card feature-card">
          <div className="feature-icon-box">📅</div>
          <h3>Instant Scheduling</h3>
          <p>
            Pick available time slots directly. Receive instant booking confirmation and real-time status updates.
          </p>
        </div>

        <div className="card feature-card">
          <div className="feature-icon-box">📋</div>
          <h3>Digital Health Record</h3>
          <p>
            Access your consultation history, appointment details, and doctor recommendations anytime from your dashboard.
          </p>
        </div>
      </div>

      {/* Featured Medical Departments */}
      <div className="section-title-wrap">
        <h2 className="section-title">Explore Departments</h2>
        <p className="section-subtitle">
          Comprehensive medical specialties offering state-of-the-art diagnostic and clinical care.
        </p>
      </div>

      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {departments.map((dept) => (
          <Link to={`/doctors?specialty=${encodeURIComponent(dept.name)}`} key={dept.name} style={{ textDecoration: 'none' }}>
            <div className="dept-card">
              <span className="dept-icon">{dept.icon}</span>
              <span className="dept-name">{dept.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
}

export default HomePage;
