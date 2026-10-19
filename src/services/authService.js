import axiosClient from '../api/axiosClient';

/**
 * Authentication API Service
 * 
 * Communicates with Spring Boot backend endpoints:
 * - POST /api/auth/register - Patient registration
 * - POST /api/auth/login    - Patient/Admin login
 */

/**
 * Register a new patient
 */
export const registerUser = async (patientData) => {
  const payload = {
    fullName: patientData.fullName.trim(),
    email: patientData.email.trim().toLowerCase(),
    password: patientData.password,
    phone: patientData.phone.trim(),
    bloodGroup: patientData.bloodGroup || '',
    address: patientData.address || ''
  };

  const res = await axiosClient.post('/auth/register', payload);
  return res && res.data !== undefined ? res.data : res;
};

/**
 * Authenticate existing patient or administrator
 * Returns { token, tokenType, expiresInMs, user }
 */
export const loginUser = async ({ email, password }) => {
  const payload = {
    email: email.trim().toLowerCase(),
    password
  };

  const res = await axiosClient.post('/auth/login', payload);
  return res && res.data !== undefined ? res.data : res;
};
