import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import { getDoctors } from '../services/doctorService';
import { bookAppointment, getMyAppointments, cancelAppointment } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import { sampleDoctors } from '../data/mockData';

/**
 * AppointmentsPage Component
 * 
 * Connected to Spring Boot Backend:
 * - Books appointments with selected doctor (POST /api/appointments)
 * - Patient identity is derived directly from the authenticated JWT session on the server
 * - Enforces future/today date validation
 * - Prevents duplicate booking conflicts
 * - Fetches patient's appointments (GET /api/appointments)
 * - Cancels an appointment (PUT /api/appointments/:id/cancel)
 * - Displays loading, error, empty, and booking confirmation states
 */
function AppointmentsPage() {
  const location = useLocation();
  const { isAuthenticated, token } = useAuth();

  // State: Appointments list & loading
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // State: Doctors for booking select dropdown
  const [doctorsList, setDoctorsList] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  // State: Booking Form
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Notification banners
  const [successMsg, setSuccessMsg] = useState('');
  const [formError, setFormError] = useState('');

  // Form Fields
  const todayStr = new Date().toISOString().split('T')[0];
  const [newDoctorId, setNewDoctorId] = useState('');
  const [newDate, setNewDate] = useState(todayStr);
  const [newTime, setNewTime] = useState('09:00 AM');
  const [newReason, setNewReason] = useState('');

  // 1. Fetch patient's appointments from backend
  const loadAppointments = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      if (!isAuthenticated) {
        setAppointments([]);
        setIsLoading(false);
        return;
      }
      const data = await getMyAppointments();
      setAppointments(data || []);
    } catch (err) {
      setFetchError(err.message || 'Failed to load appointments from server.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fetch doctors for the dropdown
  const loadDoctors = async () => {
    setIsDoctorsLoading(true);
    try {
      const data = await getDoctors();
      if (data && data.length > 0) {
        setDoctorsList(data);
        setNewDoctorId((prev) => prev || data[0].id);
      } else {
        setDoctorsList(sampleDoctors);
        setNewDoctorId((prev) => prev || sampleDoctors[0].id);
      }
    } catch (err) {
      console.warn('Could not load live doctors, using fallback:', err);
      setDoctorsList(sampleDoctors);
      setNewDoctorId((prev) => prev || sampleDoctors[0].id);
    } finally {
      setIsDoctorsLoading(false);
    }
  };

  function setIsDoctorsLoading(val) {
    setIsLoadingDoctors(val);
  }

  useEffect(() => {
    loadAppointments();
    loadDoctors();
  }, []);

  // 3. Handle pre-selected doctor from Doctor Directory navigation
  useEffect(() => {
    if (location.state?.selectedDoctor) {
      const doc = location.state.selectedDoctor;
      setNewDoctorId(doc.id);
      setShowBookingForm(true);
      setSuccessMsg(`Pre-selected: ${doc.name} (${doc.specialty}) — Please choose your preferred date and time.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.state]);

  // 4. Action: Book appointment
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!token) {
      setFormError('Please log in as a patient first to book an appointment.');
      return;
    }

    // Client-side date check
    if (newDate < todayStr) {
      setFormError('Appointment date cannot be in the past. Please select today or a future date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newApt = await bookAppointment({
        doctorId: newDoctorId,
        appointmentDate: newDate,
        appointmentTime: newTime,
        reason: newReason
      });

      // Insert new appointment at beginning of list
      setAppointments((prev) => [newApt, ...prev]);
      setShowBookingForm(false);
      setNewReason('');
      setFormError('');
      setSuccessMsg(`✅ Booking Confirmed! Appointment #${newApt.id} with ${newApt.doctorName} on ${newApt.appointmentDate} at ${newApt.appointmentTime}.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setFormError(err.message || 'Failed to book appointment. Please verify details and slot availability.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Action: Cancel appointment
  const handleCancelAppointment = async (apt) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel your appointment with ${apt.doctorName} on ${apt.appointmentDate}?`
    );
    if (!confirmCancel) return;

    setCancellingId(apt.id);
    try {
      await cancelAppointment(apt.id);
      setAppointments((prev) =>
        prev.map((item) => (item.id === apt.id ? { ...item, status: 'CANCELLED' } : item))
      );
      setSuccessMsg(`Appointment #${apt.id} with ${apt.doctorName} has been cancelled.`);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      alert(`Error cancelling appointment: ${err.message}`);
    } finally {
      setCancellingId(null);
    }
  };

  // Filter list by status
  const filteredAppointments = appointments.filter((apt) => {
    if (filterStatus === 'ALL') return true;
    return apt.status === filterStatus;
  });

  return (
    <PageLayout
      title="My Appointments"
      subtitle="View your scheduled consultations, manage bookings, and book new doctor slots"
      action={
        <Button
          variant="primary"
          onClick={() => {
            setShowBookingForm((prev) => !prev);
            setFormError('');
          }}
        >
          {showBookingForm ? '✕ Close Form' : '+ Book Appointment'}
        </Button>
      }
    >
      {/* Success Notification Alert */}
      {successMsg && (
        <div className="alert alert-success" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>{successMsg}</div>
          <button
            onClick={() => setSuccessMsg('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', color: 'inherit' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Unauthenticated Alert Prompt */}
      {!token && (
        <div className="alert alert-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <strong>Guest Mode:</strong> You are currently not signed in. Log in as a patient to view and schedule real appointments.
          </div>
          <Link to="/login">
            <Button variant="primary" size="sm">
              Log In Now &rarr;
            </Button>
          </Link>
        </div>
      )}

      {/* Booking Form Modal / Card */}
      {showBookingForm && (
        <div className="card" style={{ marginBottom: '2.5rem', border: '2px solid var(--primary)', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, color: 'var(--primary-dark)', fontSize: '1.25rem' }}>
              📅 Schedule Consultation Slot
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Patient identity linked from active login
            </span>
          </div>

          {formError && (
            <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
              ⚠️ {formError}
            </div>
          )}

          <form onSubmit={handleCreateAppointment}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Select Medical Specialist *</label>
                <select
                  className="form-control"
                  value={newDoctorId}
                  onChange={(e) => setNewDoctorId(e.target.value)}
                  disabled={isLoadingDoctors || isSubmitting}
                  required
                >
                  {doctorsList.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.specialty} ({doc.fee || '$50'})
                    </option>
                  ))}
                </select>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem', display: 'block' }}>
                  Choose from certified hospital specialists
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Appointment Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={newDate}
                  min={todayStr}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem', display: 'block' }}>
                  Date cannot be in the past
                </small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Preferred Time Slot *</label>
                <select
                  className="form-control"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  required
                >
                  <option value="09:00 AM">09:00 AM (Morning Slot)</option>
                  <option value="10:30 AM">10:30 AM (Morning Slot)</option>
                  <option value="11:45 AM">11:45 AM (Late Morning)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon Slot)</option>
                  <option value="03:30 PM">03:30 PM (Afternoon Slot)</option>
                  <option value="04:30 PM">04:30 PM (Evening Slot)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Reason / Symptoms (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Follow-up consultation, chest discomfort, checkup"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBookingForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
                    Confirming Slot...
                  </>
                ) : (
                  'Confirm & Book Appointment'
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['ALL', 'BOOKED', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: '6px',
              border: '1px solid',
              borderColor: filterStatus === st ? 'var(--primary)' : 'var(--border-color)',
              backgroundColor: filterStatus === st ? 'var(--primary-light)' : '#ffffff',
              color: filterStatus === st ? 'var(--primary-dark)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {st === 'ALL' ? 'All Records' : st}
          </button>
        ))}
      </div>

      {/* 1. Loading State */}
      {isLoading && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <div
            className="spinner"
            style={{
              width: '2rem',
              height: '2rem',
              borderWidth: '3px',
              borderColor: 'rgba(2, 132, 199, 0.2)',
              borderTopColor: 'var(--primary)',
              margin: '0 auto 1rem'
            }}
          ></div>
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.15rem' }}>Loading Your Appointments...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Fetching verified records from Spring Boot backend
          </p>
        </div>
      )}

      {/* 2. Error State */}
      {!isLoading && fetchError && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h3 style={{ color: '#b91c1c' }}>Failed to Load Appointments</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0.5rem auto 1.5rem' }}>
            {fetchError}
          </p>
          <Button variant="primary" size="md" onClick={loadAppointments}>
            🔄 Retry
          </Button>
        </div>
      )}

      {/* 3. Empty State */}
      {!isLoading && !fetchError && filteredAppointments.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
          <h3 style={{ color: 'var(--text-main)' }}>No Appointments Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {filterStatus === 'ALL'
              ? 'You have not scheduled any appointments yet.'
              : `No appointments with status "${filterStatus}".`}
          </p>
          <div style={{ marginTop: '1.25rem' }}>
            <Button variant="primary" size="sm" onClick={() => setShowBookingForm(true)}>
              + Schedule Your First Consultation
            </Button>
          </div>
        </div>
      )}

      {/* 4. Appointments List */}
      {!isLoading && !fetchError && filteredAppointments.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredAppointments.map((apt) => {
            const isCancellable =
              apt.status === 'BOOKED' || apt.status === 'CONFIRMED' || apt.status === 'PENDING';

            return (
              <div
                key={apt.id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderLeft:
                    apt.status === 'CANCELLED'
                      ? '4px solid #ef4444'
                      : apt.status === 'BOOKED' || apt.status === 'CONFIRMED'
                      ? '4px solid #10b981'
                      : '4px solid var(--primary)'
                }}
              >
                {/* Appointment Info */}
                <div style={{ flex: '1', minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                      #{apt.id}
                    </span>
                    <span className={`badge badge-${apt.status.toLowerCase()}`}>
                      {apt.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', margin: '0.2rem 0', color: 'var(--text-main)' }}>
                    {apt.doctorName}
                  </h3>

                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <strong>Specialty:</strong> {apt.doctorSpecialty || apt.specialty} &bull;{' '}
                    <strong>Clinic:</strong> {apt.roomNo || 'Main Wing'}
                  </div>

                  {apt.reason && (
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.35rem', fontStyle: 'italic' }}>
                      &ldquo;{apt.reason}&rdquo;
                    </div>
                  )}
                </div>

                {/* Date, Time & Cancel Action */}
                <div style={{ textAlign: 'right', minWidth: '180px' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                    📅 {apt.appointmentDate || apt.date}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    ⏰ {apt.appointmentTime || apt.time}
                  </div>

                  {/* Cancel Button */}
                  {isCancellable && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={cancellingId === apt.id}
                        onClick={() => handleCancelAppointment(apt)}
                      >
                        {cancellingId === apt.id ? 'Cancelling...' : 'Cancel Appointment'}
                      </Button>
                    </div>
                  )}

                  {apt.status === 'CANCELLED' && (
                    <div style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: '0.5rem', fontWeight: 600 }}>
                      Slot Cancelled
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}

export default AppointmentsPage;
