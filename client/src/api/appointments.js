import client from './client';

export const getSlots = (doctorId, date) =>
  client.get('/appointments/slots', { params: { doctorId, date } }).then((r) => r.data);

export const bookAppointment = (data) => client.post('/appointments', data).then((r) => r.data);

export const getMyPatientAppointments = () => client.get('/appointments/me').then((r) => r.data);

export const cancelMyAppointment = (id) => client.patch(`/appointments/${id}/cancel`).then((r) => r.data);

export const getMyDoctorAppointments = (status) =>
  client.get('/appointments/doctor/me', { params: status ? { status } : {} }).then((r) => r.data);

export const updateAppointmentStatus = (id, data) =>
  client.patch(`/appointments/${id}/status`, data).then((r) => r.data);
