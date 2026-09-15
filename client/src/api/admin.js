import client from './client';

export const listDoctorsByStatus = (status) =>
  client.get('/admin/doctors', { params: status ? { status } : {} }).then((r) => r.data);

export const updateDoctorStatus = (id, data) =>
  client.patch(`/admin/doctors/${id}/status`, data).then((r) => r.data);
