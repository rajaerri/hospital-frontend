import axiosClient from '../api/axiosClient';

/**
 * Doctor API Service
 * 
 * Communicates with Spring Boot backend endpoints:
 * - GET /api/doctors?search=...&specialty=...
 * - GET /api/doctors/:id
 */
export const getDoctors = async (search = '', specialty = '') => {
  const params = {};
  if (search && search.trim()) {
    params.search = search.trim();
  }
  if (specialty && specialty.trim() && specialty !== 'All') {
    params.specialty = specialty.trim();
  }

  const res = await axiosClient.get('/doctors', { params });
  
  // Safely extract doctor array whether returned wrapped in ApiResponse.data or directly
  if (res && Array.isArray(res.data)) {
    return res.data;
  }
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};

export const getDoctorById = async (id) => {
  const res = await axiosClient.get(`/doctors/${id}`);
  
  // Safely extract single doctor object
  if (res && res.data !== undefined && res.data !== null) {
    return res.data;
  }
  return res;
};
