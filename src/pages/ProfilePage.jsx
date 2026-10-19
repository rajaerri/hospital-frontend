import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import { getProfile, updateProfile, deleteAccount } from '../services/patientService';
import { useAuth } from '../context/AuthContext';

/**
 * ProfilePage Component
 * 
 * Features:
 * - View patient profile (GET /api/patients/me)
 * - Update permitted fields with server-side Bean Validation feedback (PUT /api/patients/me)
 * - Prevent accidental account deletion with explicit confirmation dialog (DELETE /api/patients/me)
 * - Logout & expired token handling
 * - Clean display of HTTP 400 validation, 401 unauth, 403 forbidden, 404 not found, and 500 errors
 */
function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

  const [profile, setProfile] = useState({
    id: user?.id || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bloodGroup: user?.bloodGroup || 'O+',
    address: user?.address || ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Fetch patient profile from backend
  const loadProfile = async () => {
    setIsLoading(true);
    setErrorMsg('');
    setFieldErrors({});
    try {
      const data = await getProfile();
      if (data) {
        setProfile({
          id: data.id,
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          bloodGroup: data.bloodGroup || 'O+',
          address: data.address || ''
        });
        updateUser(data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load profile from backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field validation error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    setFieldErrors({});

    try {
      const updated = await updateProfile({
        fullName: profile.fullName,
        phone: profile.phone,
        bloodGroup: profile.bloodGroup,
        address: profile.address
      });

      setProfile(updated);
      updateUser(updated);
      setIsEditing(false);
      setSuccessMsg('Your profile has been successfully updated in the database!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Safe Account Deletion with Confirmation Check
  const handleDeleteAccount = async () => {
    if (deleteConfirmationInput.trim().toUpperCase() !== 'DELETE') {
      return;
    }

    setIsDeleting(true);
    setErrorMsg('');

    try {
      await deleteAccount();
      logout();
      navigate('/login', {
        state: { info: 'Your patient account and all associated appointment records have been permanently deleted.' },
        replace: true
      });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete account. Please try again.');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleManualLogout = () => {
    logout();
    navigate('/login', {
      state: { info: 'You have been safely logged out.' },
      replace: true
    });
  };

  const initials = profile.fullName
    ? profile.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'PT';

  return (
    <PageLayout
      title="Patient Profile & Medical Record"
      subtitle="Manage your personal information, contact numbers, and registered medical demographics"
      action={
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant={isEditing ? 'outline' : 'primary'}
            onClick={() => {
              setIsEditing((prev) => !prev);
              setErrorMsg('');
              setFieldErrors({});
            }}
            disabled={isLoading || isDeleting}
          >
            {isEditing ? 'Cancel Edit' : '✏️ Edit Profile'}
          </Button>
          <Button
            variant="outline"
            onClick={handleManualLogout}
            disabled={isLoading || isDeleting}
          >
            🔒 Sign Out
          </Button>
        </div>
      }
    >
      {/* Success Notification */}
      {successMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading ? (
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
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.15rem' }}>Loading Profile Records...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Fetching verified patient data from MySQL via Spring Boot
          </p>
        </div>
      ) : (
        <>
          <div className="grid-3" style={{ marginBottom: '2rem' }}>
            {/* Profile Card / Avatar Column */}
            <div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                    color: '#ffffff',
                    fontSize: '2rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)'
                  }}
                >
                  {initials}
                </div>
                <h2 style={{ fontSize: '1.3rem', margin: 0 }}>{profile.fullName}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                  Patient ID: #{profile.id || 'N/A'}
                </p>
                <div style={{ marginTop: '0.75rem' }}>
                  <span className="badge badge-confirmed">Active Patient</span>
                </div>

                <div
                  style={{
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-color)',
                    textAlign: 'left',
                    fontSize: '0.88rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div>🩸 <strong>Blood Group:</strong> {profile.bloodGroup || 'Not specified'}</div>
                  <div>📧 <strong>Email:</strong> {profile.email}</div>
                  <div>📞 <strong>Phone:</strong> {profile.phone || 'Not specified'}</div>
                </div>
              </div>
            </div>

            {/* Details & Edit Form (Spans 2 columns) */}
            <div style={{ gridColumn: 'span 2' }}>
              <div className="card">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--primary-dark)' }}>
                  {isEditing ? 'Edit Profile Information' : 'Personal & Demographic Information'}
                </h3>

                <form onSubmit={handleSave}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        className={`form-control ${fieldErrors.fullName ? 'input-error' : ''}`}
                        value={profile.fullName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                      />
                      {fieldErrors.fullName && (
                        <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                          ⚠️ {fieldErrors.fullName}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address (Registered)</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={profile.email}
                        disabled={true}
                        style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                      />
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        Primary login identifier cannot be edited
                      </small>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        className={`form-control ${fieldErrors.phone ? 'input-error' : ''}`}
                        value={profile.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                      />
                      {fieldErrors.phone && (
                        <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                          ⚠️ {fieldErrors.phone}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Blood Group</label>
                      <select
                        name="bloodGroup"
                        className={`form-control ${fieldErrors.bloodGroup ? 'input-error' : ''}`}
                        value={profile.bloodGroup}
                        onChange={handleChange}
                        disabled={!isEditing}
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                      {fieldErrors.bloodGroup && (
                        <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                          ⚠️ {fieldErrors.bloodGroup}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Residential Address</label>
                    <input
                      type="text"
                      name="address"
                      className={`form-control ${fieldErrors.address ? 'input-error' : ''}`}
                      placeholder="e.g. 742 Evergreen Terrace, Springfield"
                      value={profile.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                    {fieldErrors.address && (
                      <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                        ⚠️ {fieldErrors.address}
                      </span>
                    )}
                  </div>

                  {isEditing && (
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          loadProfile();
                        }}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
                            Saving Changes...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Danger Zone: Account Deletion */}
          <div
            className="card"
            style={{
              borderColor: '#fca5a5',
              backgroundColor: '#fff5f5',
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ color: '#b91c1c', fontSize: '1.1rem', margin: '0 0 0.35rem 0' }}>
                  ⚠️ Danger Zone: Delete Patient Account
                </h3>
                <p style={{ color: '#7f1d1d', fontSize: '0.88rem', margin: 0, maxWidth: '650px' }}>
                  Permanently delete your profile, consultation history, and all booked appointments from the Life Care system.
                  This action is irreversible and requires confirmation.
                </p>
              </div>
              <Button
                variant="danger"
                style={{ backgroundColor: '#dc2626', borderColor: '#b91c1c', color: '#ffffff' }}
                onClick={() => {
                  setDeleteConfirmationInput('');
                  setShowDeleteModal(true);
                }}
                disabled={isLoading || isSaving || isDeleting}
              >
                🗑️ Delete Account
              </Button>
            </div>
          </div>

          {/* Modal / Dialog Confirmation Step */}
          {showDeleteModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem'
              }}
            >
              <div
                className="card"
                style={{
                  maxWidth: '500px',
                  width: '100%',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
                  borderColor: '#ef4444'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem'
                    }}
                  >
                    ⚠️
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#991b1b' }}>
                    Confirm Permanent Account Deletion
                  </h3>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                  Are you absolutely sure you want to delete your Life Care account?
                </p>

                <div
                  style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 'var(--radius)',
                    padding: '0.75rem',
                    fontSize: '0.85rem',
                    color: '#991b1b',
                    marginBottom: '1rem'
                  }}
                >
                  <strong>What will be deleted:</strong>
                  <ul style={{ margin: '0.35rem 0 0 1.2rem', padding: 0 }}>
                    <li>Patient profile record and contact details</li>
                    <li>All currently scheduled and past appointment slots</li>
                    <li>Active authentication session tokens</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    To confirm, please type <strong>DELETE</strong> in the box below:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type DELETE to confirm"
                    value={deleteConfirmationInput}
                    onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                    disabled={isDeleting}
                    autoFocus
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    style={{
                      backgroundColor: deleteConfirmationInput.trim().toUpperCase() === 'DELETE' ? '#dc2626' : '#9ca3af',
                      borderColor: deleteConfirmationInput.trim().toUpperCase() === 'DELETE' ? '#b91c1c' : '#9ca3af',
                      color: '#ffffff',
                      cursor: deleteConfirmationInput.trim().toUpperCase() === 'DELETE' ? 'pointer' : 'not-allowed'
                    }}
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmationInput.trim().toUpperCase() !== 'DELETE' || isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
                        Deleting Account...
                      </>
                    ) : (
                      'Yes, Permanently Delete My Account'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}

export default ProfilePage;
