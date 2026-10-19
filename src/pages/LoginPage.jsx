import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

/**
 * LoginPage Component
 * 
 * Features:
 * 1. Connected to Spring Boot REST backend: POST /api/auth/login
 * 2. Controlled form inputs with useState (Email & Password)
 * 3. Client & Server field-level validation
 * 4. Loading spinner to prevent repeated clicks / duplicate submissions
 * 5. Password visibility toggle (Show/Hide)
 * 6. Academic Demo Helper with one-click credential auto-fill
 * 7. Redirects to previous protected page after login
 */
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Controlled form inputs
  const [formData, setFormData] = useState({
    email: 'alex.morgan@example.com',
    password: 'Patient@123'
  });

  // Individual field validation error messages
  const [errors, setErrors] = useState({});

  // UI state: loading, submission banners, and password toggle
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');
  const [infoBanner, setInfoBanner] = useState(() => location.state?.info || '');
  const [showPassword, setShowPassword] = useState(false);

  // Email format regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email format (e.g. name@example.com).';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
    setServerError('');
  };

  // Quick Demo Helper: Click a role to auto-populate test credentials
  const handleSelectDemoRole = (roleType) => {
    setServerError('');
    setServerSuccess('');
    setErrors({});

    if (roleType === 'PATIENT') {
      setFormData({
        email: 'alex.morgan@example.com',
        password: 'Patient@123'
      });
    } else if (roleType === 'ADMIN') {
      setFormData({
        email: 'admin@hospital.com',
        password: 'Admin@123'
      });
    }
  };

  // Handle Form Submission with Real Backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setServerError('Please provide a valid email and password.');
      return;
    }

    setErrors({});
    setServerError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);

      setServerSuccess('Authentication successful! Redirecting to patient dashboard...');

      // Redirect to previous requested page or default to /dashboard
      const destination = location.state?.from?.pathname || '/dashboard';
      const redirectState = location.state?.from?.state;
      setTimeout(() => {
        navigate(destination, { state: redirectState, replace: true });
      }, 700);
    } catch (err) {
      setServerError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout
      title="Patient Portal Sign In"
      subtitle="Access your medical consultations, schedule slots, and view treatment history"
    >
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        {/* Quick Academic Demo Helper Card */}
        <div
          className="card"
          style={{
            marginBottom: '1.5rem',
            backgroundColor: 'var(--primary-light)',
            borderColor: 'var(--border-focus)',
            padding: '1rem'
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.4rem' }}>
            🎓 Academic Evaluation Demo Accounts:
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '0.65rem' }}>
            Click an account below to auto-populate verified test credentials:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSelectDemoRole('PATIENT')}
            >
              👤 Patient (Alex Morgan)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSelectDemoRole('ADMIN')}
            >
              🛡️ Administrator
            </Button>
          </div>
        </div>

        {/* Main Sign In Form Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            Sign In to Life Care
          </h2>

          {/* Informational State Alert (e.g. Account Deleted, Logout) */}
          {infoBanner && (
            <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
              ℹ️ {infoBanner}
            </div>
          )}

          {/* Success Feedback Alert */}
          {serverSuccess && (
            <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
              ✓ {serverSuccess}
            </div>
          )}

          {/* Error Feedback Alert */}
          {serverError && (
            <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
              ⚠️ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className={`form-control ${errors.email ? 'input-error' : ''}`}
                placeholder="e.g. alex.morgan@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
              {errors.email && <span className="form-error-text">{errors.email}</span>}
            </div>

            {/* Password Field with Visibility Toggle */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password *
              </label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-control password-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter your account password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex="-1"
                >
                  {showPassword ? '👁️ Hide' : '👁️ Show'}
                </button>
              </div>
              {errors.password && <span className="form-error-text">{errors.password}</span>}
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '1.5rem' }}>
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" style={{ marginRight: '0.5rem' }}></span>
                    Authenticating with Backend...
                  </>
                ) : (
                  'Sign In &rarr;'
                )}
              </Button>
            </div>
          </form>

          {/* Footer Navigation Link */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.88rem',
              color: 'var(--text-muted)'
            }}
          >
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>
              Register as a New Patient
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default LoginPage;
