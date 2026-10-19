import React from 'react';
import Button from './Button';

/**
 * Reusable DoctorCard Component
 * Displays doctor profile information, specialty, availability schedule, fee, and booking CTA.
 * 
 * Props:
 * - doctor: DoctorResponseDto object from the backend
 * - onBook: callback function invoked when patient clicks "Book Appointment"
 */
function DoctorCard({ doctor, onBook }) {
  if (!doctor) return null;

  // Specialty color map for avatar backgrounds
  const getAvatarBg = (specialty) => {
    const colorMap = {
      Cardiology: '#0284c7',
      Neurology: '#0f766e',
      Pediatrics: '#d97706',
      Orthopedics: '#4f46e5',
      'General Medicine': '#059669',
      Dermatology: '#9333ea'
    };
    return colorMap[specialty] || '#0284c7';
  };

  const initials = doctor.name
    ? doctor.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('').slice(0, 2)
    : 'DR';

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {/* Doctor Header: Avatar, Name & Specialty */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            minWidth: '56px',
            borderRadius: '50%',
            backgroundColor: getAvatarBg(doctor.specialty),
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.15rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          {initials}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <h3
            style={{
              fontSize: '1.15rem',
              margin: 0,
              color: 'var(--text-main)',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
          >
            {doctor.name}
          </h3>
          <span className="badge badge-completed" style={{ marginTop: '0.35rem' }}>
            {doctor.specialty}
          </span>
        </div>
      </div>

      {/* Qualifications & Availability Details */}
      <div
        style={{
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          flex: 1
        }}
      >
        <div>
          🎓 <strong>Qualification:</strong> {doctor.qualification || 'MBBS, MD'}
        </div>
        <div>
          ⏳ <strong>Experience:</strong> {doctor.experience || '10+ years'}
        </div>
        <div>
          📍 <strong>Clinic:</strong> {doctor.roomNo || 'Main Hospital Wing'}
        </div>
        <div>
          📅 <strong>Available Days:</strong>{' '}
          <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
            {doctor.availableDays || 'Mon - Fri'}
          </span>
        </div>
        <div>
          ⏰ <strong>Consultation Hours:</strong>{' '}
          <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
            {doctor.availableHours || '09:00 AM - 01:00 PM'}
          </span>
        </div>
        <div>
          ⭐ <strong>Rating:</strong> {doctor.rating || 4.9} / 5.0
        </div>
      </div>

      {/* Card Footer: Consultation Fee & CTA */}
      <div
        style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1rem',
          marginTop: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
            Consultation Fee
          </span>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
            {doctor.fee || '$50'}
          </span>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onBook && onBook(doctor)}
        >
          Book Appointment &rarr;
        </Button>
      </div>
    </div>
  );
}

export default DoctorCard;
