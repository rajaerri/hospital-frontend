import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

/**
 * RegisterPage Component
 * 
 * Connected to Spring Boot REST Backend:
 * - POST /api/auth/register
 * - Validates Full Name, Email, Phone, Password, and Password Confirmation
 * - Real-time error clearing on change
 * - Prevents duplicate form submissions with loading state
 * - Displays server success and duplicate email error messages
 */
function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Controlled form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bloodGroup: 'O+',
    address: '',
    password: '',
    confirmPassword: ''
  });

  // Validation error states
  const [errors, setErrors] = useState({});

  // UI state: loading, alerts, and password visibility
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation regular expressions
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+\-\s()]{10,20}$/;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format (e.g. user@example.com).';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must contain at least 10 valid digits.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setServerError('Please correct the highlighted validation errors before submitting.');
      return;
    }

    setErrors({});
    setServerError('');
    setIsLoading(true);

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        bloodGroup: formData.bloodGroup,
        address: formData.address
      });

      setServerSuccess('Registration successful! Redirecting you to the sign-in page...');

      // Redirect to login after 1.2s
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setServerError(err.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout
      title="Create Patient Account"
      subtitle="Register as a Life Care patient to book medical consultations and track your health records"
    >
      <div style={{ maxWidth: '580px', margin: '0 auto' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            Patient Registration Form
          </h2>

          {/* Success Banner */}
          {serverSuccess && (
            <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
              ✓ {serverSuccess}
            </div>
          )}

          {/* Error Banner */}
          {serverError && (
            <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
              ⚠️ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                className={`form-control ${errors.fullName ? 'input-error' : ''}`}
                placeholder="e.g. John Doe"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
              {errors.fullName && <span className="form-error-text">{errors.fullName}</span>}
            </div>

            {/* Email & Phone Two-Column Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? 'input-error' : ''}`}
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
                {errors.email && <span className="form-error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  className={`form-control ${errors.phone ? 'input-error' : ''}`}
                  placeholder="e.g. 555-123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
                {errors.phone && <span className="form-error-text">{errors.phone}</span>}
              </div>
            </div>

            {/* Blood Group & Address Two-Column Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="bloodGroup">
                  Blood Group (Optional)
                </label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  className="form-control"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  disabled={isLoading}
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
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="address">
                  City / Address (Optional)
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="e.g. Springfield"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password & Confirm Password Row */}
            <div className="form-row">
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
                    placeholder="Min 6 characters"
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

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Re-type password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
                {errors.confirmPassword && (
                  <span className="form-error-text">{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '1.25rem' }}>
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
                    Creating Account in Database...
                  </>
                ) : (
                  'Create Patient Account &rarr;'
                )}
              </Button>
            </div>
          </form>

          {/* Footer Link */}
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
            Already registered?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default RegisterPage;
