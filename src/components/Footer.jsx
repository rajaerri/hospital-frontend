import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

/**
 * Reusable Footer Component
 * Provides:
 * - Hospital mission statement
 * - Quick links for navigation
 * - Emergency contact information
 * - Academic project disclaimer
 */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Hospital Info */}
        <div className="footer-col">
          <div className="footer-brand">
            <div className="brand-icon">+</div>
            <span>Life Care Hospital</span>
          </div>
          <p>
            Dedicated to providing patient-centered, compassionate, and reliable healthcare services. 
            Schedule appointments easily from anywhere.
          </p>
          <div className="emergency-card">
            <div className="emergency-title">24/7 Emergency Helpline</div>
            <div className="emergency-number">+1 (800) 555-CARE</div>
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/doctors">Find Doctors</Link></li>
            <li><Link to="/appointments">Book Appointment</Link></li>
            <li><Link to="/dashboard">Patient Portal</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
          </ul>
        </div>

        {/* Hospital Departments */}
        <div className="footer-col">
          <h4>Departments</h4>
          <ul className="footer-links">
            <li><Link to="/doctors?specialty=Cardiology">Cardiology</Link></li>
            <li><Link to="/doctors?specialty=Neurology">Neurology</Link></li>
            <li><Link to="/doctors?specialty=Pediatrics">Pediatrics</Link></li>
            <li><Link to="/doctors?specialty=Orthopedics">Orthopedics</Link></li>
            <li><Link to="/doctors?specialty=General Medicine">General Medicine</Link></li>
            <li><Link to="/doctors?specialty=Dermatology">Dermatology</Link></li>
          </ul>
        </div>

        {/* Operating Hours & Academic Note */}
        <div className="footer-col">
          <h4>OPD Timings</h4>
          <p>Monday - Friday: 08:00 AM - 08:00 PM</p>
          <p>Saturday: 09:00 AM - 05:00 PM</p>
          <p>Sunday: Emergency & Trauma Only</p>
          <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            Location: 100 Medical Center Blvd, Health City
          </p>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div>&copy; {new Date().getFullYear()} Life Care Hospital Appointment Management System. Academic Project.</div>
        <div>Built with React, Vite, Spring Boot & MySQL</div>
      </div>
    </footer>
  );
}

export default Footer;
