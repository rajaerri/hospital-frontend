import axiosClient from '../api/axiosClient';

/**
 * Appointment API Service
 * 
 * Communicates with Spring Boot backend endpoints:
 * - POST /api/appointments            - Book appointment (authenticated patient)
 * - GET  /api/appointments            - Retrieve patient's appointments
 * - GET  /api/appointments/:id        - Retrieve single appointment details
 * - PUT  /api/appointments/:id/cancel - Cancel appointment
 */

/**
 * Book a new appointment
 * Patient identity is derived directly from the authenticated JWT session on the backend.
 * Frontend does NOT submit patientId.
 */
export const bookAppointment = async ({ doctorId, appointmentDate, appointmentTime, reason }) => {
  const payload = {
    doctorId: Number(doctorId),
    appointmentDate,
    appointmentTime,
    reason: reason || ''
  };

  const res = await axiosClient.post('/appointments', payload);
  return res && res.data !== undefined ? res.data : res;
};

/**
 * Retrieve current authenticated patient's appointments
 */
export const getMyAppointments = async () => {
  const res = await axiosClient.get('/appointments');
  if (res && Array.isArray(res.data)) {
    return res.data;
  }
  if (Array.isArray(res)) {
    return res;
  }
  return [];
};

/**
 * Cancel an appointment slot by ID
 */
export const cancelAppointment = async (appointmentId) => {
  const res = await axiosClient.put(`/appointments/${appointmentId}/cancel`);
  return res && res.data !== undefined ? res.data : res;
};
