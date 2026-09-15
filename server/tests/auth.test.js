const test = require('node:test');
const assert = require('node:assert/strict');
const { startTestServer, stopTestServer, clearDatabase, getCookie } = require('./helpers');

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

test('patient can sign up, gets a session cookie, and /me returns the account without a password field', async () => {
  const res = await fetch(`${baseUrl}/api/auth/patient/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Patient',
      email: 'patient1@test.com',
      password: 'Passw0rd1',
      phone: '1234567890',
      dob: '1995-05-05',
      gender: 'Male',
    }),
  });
  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.role, 'patient');
  assert.equal(body.user.password, undefined);

  const cookie = getCookie(res);
  assert.ok(cookie, 'expected a session cookie to be set');

  const meRes = await fetch(`${baseUrl}/api/auth/me`, { headers: { Cookie: cookie } });
  assert.equal(meRes.status, 200);
  const me = await meRes.json();
  assert.equal(me.user.email, 'patient1@test.com');
  assert.equal(me.user.password, undefined);
});

test('duplicate patient signup email is rejected with 409', async () => {
  const payload = {
    name: 'Test Patient',
    email: 'dup@test.com',
    password: 'Passw0rd1',
    phone: '123',
    dob: '1995-05-05',
    gender: 'Male',
  };
  const first = await fetch(`${baseUrl}/api/auth/patient/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  assert.equal(first.status, 201);

  const second = await fetch(`${baseUrl}/api/auth/patient/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  assert.equal(second.status, 409);
});

test('weak password is rejected at signup', async () => {
  const res = await fetch(`${baseUrl}/api/auth/patient/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Weak',
      email: 'weak@test.com',
      password: 'weak',
      phone: '123',
      dob: '1995-05-05',
      gender: 'Male',
    }),
  });
  assert.equal(res.status, 400);
});

test('wrong password and unknown email both return the same generic 401 (no user enumeration)', async () => {
  await fetch(`${baseUrl}/api/auth/doctor/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Dr Test',
      email: 'doctest@test.com',
      password: 'Passw0rd1',
      specialty: 'Cardiology',
      qualifications: 'MD',
      experience: 5,
      hospital: 'Test Hospital',
      phone: '555',
      licenseNumber: 'LIC-1',
    }),
  });

  const wrongPassword = await fetch(`${baseUrl}/api/auth/doctor/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'doctest@test.com', password: 'WrongPass1' }),
  });
  const unknownEmail = await fetch(`${baseUrl}/api/auth/doctor/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nobody@test.com', password: 'WrongPass1' }),
  });

  assert.equal(wrongPassword.status, 401);
  assert.equal(unknownEmail.status, 401);
  assert.deepEqual(await wrongPassword.json(), await unknownEmail.json());
});

test('new doctor signup defaults to pending and is excluded from the public doctor list', async () => {
  await fetch(`${baseUrl}/api/auth/doctor/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Dr Pending',
      email: 'pending@test.com',
      password: 'Passw0rd1',
      specialty: 'Neurology',
      qualifications: 'MD',
      experience: 3,
      hospital: 'Test Hospital',
      phone: '555',
      licenseNumber: 'LIC-2',
    }),
  });

  const list = await fetch(`${baseUrl}/api/doctors`);
  const doctors = await list.json();
  assert.equal(doctors.some((d) => d.email === 'pending@test.com'), false);
});
