const test = require('node:test');
const assert = require('node:assert/strict');
const { startTestServer, stopTestServer, clearDatabase, getCookie } = require('./helpers');
const Doctor = require('../models/Doctor');

let baseUrl;

test.before(async () => {
  baseUrl = await startTestServer();
});

test.after(async () => {
  await stopTestServer();
});

test.beforeEach(async () => {
  await clearDatabase();
});

// Covers every day of the week with a wide window so any future test date has open slots,
// independent of which weekday the test happens to run on.
const ALL_WEEK_AVAILABILITY = [0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
  dayOfWeek,
  startTime: '00:00',
  endTime: '23:30',
  slotMinutes: 30,
}));

const futureDateString = (daysAhead) => new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

async function createApprovedDoctor() {
  return Doctor.create({
    name: 'Dr Booking Test',
    email: 'bookingdoc@test.com',
    password: 'Passw0rd1',
    specialty: 'Cardiology',
    qualifications: 'MD',
    experience: 10,
    hospital: 'Test Hospital',
    phone: '555',
    licenseNumber: 'LIC-BOOK',
    status: 'approved',
    availability: ALL_WEEK_AVAILABILITY,
  });
}

async function signUpPatient(email) {
  const res = await fetch(`${baseUrl}/api/auth/patient/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Booking Patient',
      email,
      password: 'Passw0rd1',
      phone: '123',
      dob: '1990-01-01',
      gender: 'Female',
    }),
  });
  return getCookie(res);
}

test('full booking lifecycle: slots -> book -> double-book rejected -> doctor confirms -> patient cancels -> slot reopens', async () => {
  const doctor = await createApprovedDoctor();
  const patientCookie = await signUpPatient('bookingpatient@test.com');
  const date = futureDateString(10);

  const slotsRes = await fetch(`${baseUrl}/api/appointments/slots?doctorId=${doctor._id}&date=${date}`);
  const { slots } = await slotsRes.json();
  assert.ok(slots.length > 0, 'expected available slots');
  const { startTime } = slots[0];

  const bookRes = await fetch(`${baseUrl}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: patientCookie },
    body: JSON.stringify({ doctorId: doctor._id.toString(), date, startTime, symptoms: 'chest pain and shortness of breath' }),
  });
  assert.equal(bookRes.status, 201);
  const appointment = await bookRes.json();
  assert.equal(appointment.status, 'pending');
  assert.equal(appointment.predictedSpecialty, 'Cardiology');
  assert.ok(appointment.predictionConfidence > 0);

  // Re-requesting the exact same slot should now be rejected as a conflict.
  const conflictRes = await fetch(`${baseUrl}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: patientCookie },
    body: JSON.stringify({ doctorId: doctor._id.toString(), date, startTime, symptoms: 'test' }),
  });
  assert.equal(conflictRes.status, 409);

  // A different, unauthenticated caller cannot manage the appointment.
  const anonStatusRes = await fetch(`${baseUrl}/api/appointments/${appointment._id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'confirmed' }),
  });
  assert.equal(anonStatusRes.status, 401);

  // Doctor logs in and confirms.
  const doctorLoginRes = await fetch(`${baseUrl}/api/auth/doctor/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'bookingdoc@test.com', password: 'Passw0rd1' }),
  });
  const doctorCookie = getCookie(doctorLoginRes);

  const confirmRes = await fetch(`${baseUrl}/api/appointments/${appointment._id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: doctorCookie },
    body: JSON.stringify({ status: 'confirmed' }),
  });
  assert.equal(confirmRes.status, 200);

  // Invalid transition: confirmed -> pending is not a valid target status.
  const badTransitionRes = await fetch(`${baseUrl}/api/appointments/${appointment._id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: doctorCookie },
    body: JSON.stringify({ status: 'pending' }),
  });
  assert.equal(badTransitionRes.status, 400);

  // Patient cancels their own confirmed appointment.
  const cancelRes = await fetch(`${baseUrl}/api/appointments/${appointment._id}/cancel`, {
    method: 'PATCH',
    headers: { Cookie: patientCookie },
  });
  assert.equal(cancelRes.status, 200);
  assert.equal((await cancelRes.json()).status, 'cancelled');

  // The slot should be free again.
  const reopenedRes = await fetch(`${baseUrl}/api/appointments/slots?doctorId=${doctor._id}&date=${date}`);
  const reopened = (await reopenedRes.json()).slots;
  assert.ok(reopened.some((s) => s.startTime === startTime), 'expected cancelled slot to reopen');
});

test('a doctor cannot manage another doctor\'s appointment', async () => {
  const doctorA = await createApprovedDoctor();
  const doctorB = await Doctor.create({
    name: 'Dr Other',
    email: 'otherdoc@test.com',
    password: 'Passw0rd1',
    specialty: 'Neurology',
    qualifications: 'MD',
    experience: 4,
    hospital: 'Other Hospital',
    phone: '555',
    licenseNumber: 'LIC-OTHER',
    status: 'approved',
    availability: ALL_WEEK_AVAILABILITY,
  });

  const patientCookie = await signUpPatient('crosspatient@test.com');
  const date = futureDateString(11);
  const { slots } = await (await fetch(`${baseUrl}/api/appointments/slots?doctorId=${doctorA._id}&date=${date}`)).json();

  const bookRes = await fetch(`${baseUrl}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: patientCookie },
    body: JSON.stringify({ doctorId: doctorA._id.toString(), date, startTime: slots[0].startTime, symptoms: 'headache' }),
  });
  const appointment = await bookRes.json();

  const doctorBLogin = await fetch(`${baseUrl}/api/auth/doctor/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'otherdoc@test.com', password: 'Passw0rd1' }),
  });
  const doctorBCookie = getCookie(doctorBLogin);

  const res = await fetch(`${baseUrl}/api/appointments/${appointment._id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: doctorBCookie },
    body: JSON.stringify({ status: 'confirmed' }),
  });
  assert.equal(res.status, 403);
});
