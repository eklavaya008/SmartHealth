import client from './client';

export const patientSignup = (data) => client.post('/auth/patient/signup', data).then((r) => r.data);
export const patientLogin = (data) => client.post('/auth/patient/login', data).then((r) => r.data);
export const doctorSignup = (data) => client.post('/auth/doctor/signup', data).then((r) => r.data);
export const doctorLogin = (data) => client.post('/auth/doctor/login', data).then((r) => r.data);
export const adminLogin = (data) => client.post('/auth/admin/login', data).then((r) => r.data);
export const fetchMe = () => client.get('/auth/me').then((r) => r.data);
export const logout = () => client.post('/auth/logout').then((r) => r.data);
