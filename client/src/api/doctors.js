import client from './client';

export const listDoctors = (specialty) =>
  client.get('/doctors', { params: specialty ? { specialty } : {} }).then((r) => r.data);

export const getDoctor = (id) => client.get(`/doctors/${id}`).then((r) => r.data);

export const updateMyProfile = (data) => client.patch('/doctors/me/profile', data).then((r) => r.data);

export const updateMyAvailability = (availability) =>
  client.patch('/doctors/me/availability', { availability }).then((r) => r.data);
