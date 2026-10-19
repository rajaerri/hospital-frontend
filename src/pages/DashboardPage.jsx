import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import { getMyAppointments } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';

/**
 * DashboardPage Component
 * Patient overview dashboard showing:
 * - Active session welcome header with logged-in patient's name
 * - Real-time metric cards from verified backend appointments
 * - Next scheduled appointment spotlight
 * - Recent appointment records table
 */
function DashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Fetch authenticated patient's live appointments from backend
  const loadAppointments = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await getMyAppointments();
      setAppointments(data || []);
    } catch (err) {
      setFetchError(err.message || 'Failed to fetch dashboard appointments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'BOOKED' || a.status === 'CONFIRMED' || a.status === 'PENDING'
  );
  const completedVisits = appointments.filter((a) => a.status === 'COMPLETED');
  const nextAppointment = upcomingAppointments[0];
  const patientName = user?.fullName || user?.name || 'Patient';

  return (
    <PageLayout
      title={`Welcome back, ${patientName}`}
      subtitle={`Patient Portal | Registered Blood Group: ${user?.bloodGroup || 'Not specified'}`}
      action={
        <Link to="/appointments">
          <Button variant="primary" size="md">
            + Book New Appointment
          </Button>
        </Link>
      }
    >
      {/* Metric Cards Row */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>UPCOMING APPOINTMENTS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '0.35rem' }}>
            {isLoading ? '...' : upcomingAppointments.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active consultations</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>COMPLETED VISITS</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#047857', marginTop: '0.35rem' }}>
            {isLoading ? '...' : completedVisits.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Past consultations</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>PRIMARY CLINIC</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#b45309', marginTop: '0.75rem' }}>
            {nextAppointment ? (nextAppointment.doctorSpecialty || nextAppointment.specialty) : 'General OPD'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hospital Block A</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>PATIENT STATUS</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#6d28d9', marginTop: '0.75rem' }}>
            Active
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>JWT Verified</div>
        </div>
      </div>

      {/* Error Alert */}
      {!isLoading && fetchError && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          ⚠️ {fetchError}
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem', marginBottom: '2rem' }}>
          <div className="spinner" style={{ width: '1.75rem', height: '1.75rem', borderWidth: '3px', borderColor: 'rgba(2, 132, 199, 0.2)', borderTopColor: 'var(--primary)', margin: '0 auto 0.75rem' }}></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading appointment dashboard...</p>
        </div>
      )}

      {/* Next Appointment Spotlight */}
      {!isLoading && nextAppointment && (
        <div className="card" style={{ marginBottom: '2.5rem', background: '#f0f9ff', borderColor: '#bae6fd' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-booked" style={{ marginBottom: '0.5rem' }}>
                Next Upcoming Consultation
              </span>
              <h2 style={{ fontSize: '1.35rem', color: '#0369a1', margin: '0.25rem 0' }}>
                {nextAppointment.doctorName}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                <strong>Specialty:</strong> {nextAppointment.doctorSpecialty || nextAppointment.specialty} &bull; <strong>Venue:</strong> {nextAppointment.roomNo || 'OPD Room'}
              </p>
              {nextAppointment.reason && (
                <p style={{ fontSize: '0.85rem', color: '#475569', fontStyle: 'italic', marginTop: '0.25rem' }}>
                  &ldquo;{nextAppointment.reason}&rdquo;
                </p>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                📅 {nextAppointment.appointmentDate || nextAppointment.date}
              </div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                ⏰ {nextAppointment.appointmentTime || nextAppointment.time}
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <Link to="/appointments">
                  <Button variant="primary" size="sm">
                    Manage Appointments &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Appointments & Quick Actions Section */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {/* Appointments Table (Spans 2 columns) */}
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Appointment Records</h3>
            <Link to="/appointments" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              View All &rarr;
            </Link>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((apt) => (
                  <tr key={apt.id}>
                    <td><strong>#{apt.id}</strong></td>
                    <td>
                      <div>{apt.doctorName}</div>
                      <small style={{ color: 'var(--text-muted)' }}>{apt.doctorSpecialty || apt.specialty}</small>
                    </td>
                    <td>
                      <div>{apt.appointmentDate || apt.date}</div>
                      <small style={{ color: 'var(--text-muted)' }}>{apt.appointmentTime || apt.time}</small>
                    </td>
                    <td>
                      <span className={`badge badge-${apt.status.toLowerCase()}`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!isLoading && appointments.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No appointments scheduled yet.{' '}
                      <Link to="/appointments" style={{ fontWeight: 600 }}>
                        Schedule one now &rarr;
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Portal Shortcuts */}
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Quick Actions</h3>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/doctors">
              <Button variant="outline" fullWidth style={{ justifyContent: 'flex-start' }}>
                🩺 Search & Browse Doctors
              </Button>
            </Link>
            <Link to="/appointments">
              <Button variant="outline" fullWidth style={{ justifyContent: 'flex-start' }}>
                📅 Schedule New Slot
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" fullWidth style={{ justifyContent: 'flex-start' }}>
                👤 View Patient Profile
              </Button>
            </Link>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <strong>Need Immediate Assistance?</strong>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 700, marginTop: '0.2rem' }}>
                Emergency: +1 (800) 555-CARE
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default DashboardPage;
