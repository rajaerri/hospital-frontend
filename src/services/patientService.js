import axiosClient from '../api/axiosClient';

/**
 * Patient API Service
 * 
 * Communicates with Spring Boot endpoints:
 * - GET /api/patients/me - View authenticated patient profile
 * - PUT /api/patients/me - Update authenticated patient profile
 */

/**
 * Retrieve the current authenticated patient's profile
 */
export const getProfile = async () => {
  const res = await axiosClient.get('/patients/me');
  return res && res.data !== undefined ? res.data : res;
};

/**
 * Update the current authenticated patient's profile
 */
export const updateProfile = async (profileData) => {
  const payload = {
    fullName: profileData.fullName?.trim(),
    phone: profileData.phone?.trim(),
    bloodGroup: profileData.bloodGroup || '',
    address: profileData.address || ''
  };

  const res = await axiosClient.put('/patients/me', payload);
  return res && res.data !== undefined ? res.data : res;
};

/**
 * Permanently delete the authenticated patient's account and appointments
 */
export const deleteAccount = async () => {
  const res = await axiosClient.delete('/patients/me');
  return res && res.data !== undefined ? res.data : res;
};
