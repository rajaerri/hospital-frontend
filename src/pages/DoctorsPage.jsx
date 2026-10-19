import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import DoctorCard from '../components/DoctorCard';
import { getDoctors } from '../services/doctorService';
import { sampleDepartments, sampleDoctors } from '../data/mockData';

/**
 * DoctorsPage Component
 * 
 * Connected to Spring Boot REST Backend via Axios:
 * - Fetches live doctors from: GET http://localhost:8080/api/doctors
 * - Supports real-time search by name or specialty
 * - Displays loading, empty, and error states
 * - Uses reusable DoctorCard component for clean responsive layout
 * - Navigates directly to the booking page with the chosen doctor pre-filled
 */
function DoctorsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialDept = searchParams.get('specialty') || 'All';
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDept, setSelectedDept] = useState(initialDept);
  const [searchQuery, setSearchQuery] = useState('');

  // Keep selectedDept in sync if URL query parameter changes
  useEffect(() => {
    const paramDept = searchParams.get('specialty');
    if (paramDept && paramDept !== selectedDept) {
      setSelectedDept(paramDept);
    }
  }, [searchParams]);

  // Fetch doctors from backend API
  const fetchDoctorDirectory = async (search, specialty) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDoctors(search, specialty);
      setDoctors(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch doctor directory from server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch when department pill or search query changes (debounced by 300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchDoctorDirectory(searchQuery, selectedDept);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, selectedDept]);

  // Navigate to Appointments booking page with pre-selected doctor
  const handleBookDoctor = (doc) => {
    navigate('/appointments', { state: { selectedDoctor: doc } });
  };

  return (
    <PageLayout
      title="Hospital Medical Specialists"
      subtitle="Find certified doctors, check real-time availability, and schedule your appointment"
    >
      {/* Search Bar & Department Filters */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ flex: '1', minWidth: '260px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search doctor by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          )}
        </div>

        {/* Department Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {sampleDepartments.map((dept) => (
            <button
              key={dept}
              onClick={() => {
                setSelectedDept(dept);
                setSearchParams(dept === 'All' ? {} : { specialty: dept });
              }}
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: selectedDept === dept ? 'var(--primary)' : 'var(--border-color)',
                backgroundColor: selectedDept === dept ? 'var(--primary-light)' : '#ffffff',
                color: selectedDept === dept ? 'var(--primary-dark)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Loading State */}
      {isLoading && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <div className="spinner" style={{ width: '2rem', height: '2rem', borderWidth: '3px', borderColor: 'rgba(2, 132, 199, 0.2)', borderTopColor: 'var(--primary)', margin: '0 auto 1rem' }}></div>
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.15rem' }}>Loading Medical Specialists...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Connecting to Spring Boot REST API at <code>http://localhost:8080/api/doctors</code>
          </p>
        </div>
      )}

      {/* 2. Error State */}
      {!isLoading && error && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h3 style={{ color: '#b91c1c' }}>Failed to Load Doctors</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0.5rem auto 1.5rem' }}>
            {error}
          </p>
          <Button variant="primary" size="md" onClick={() => fetchDoctorDirectory(searchQuery, selectedDept)}>
            🔄 Retry Connection
          </Button>
        </div>
      )}

      {/* 3. Empty State */}
      {!isLoading && !error && doctors.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
          <h3 style={{ color: 'var(--text-main)' }}>No Doctors Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            No medical specialists matched your search &ldquo;{searchQuery || selectedDept}&rdquo;.
          </p>
          <div style={{ marginTop: '1.25rem' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedDept('All');
                setSearchQuery('');
                setSearchParams({});
              }}
            >
              Reset Search & Filters
            </Button>
          </div>
        </div>
      )}

      {/* 4. Success State: Doctor Cards Grid */}
      {!isLoading && !error && doctors.length > 0 && (
        <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
          {doctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doctor={doc}
              onBook={handleBookDoctor}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default DoctorsPage;
