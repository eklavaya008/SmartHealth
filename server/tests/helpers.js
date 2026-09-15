process.env.NODE_ENV = 'test';
require('dotenv').config({ quiet: true });

// Run tests against a dedicated database so they never touch real data. Replaces whatever
// database name (or none) is already in MONGODB_URI, regardless of format, so this works
// whether the base URI ends in "/", "/smarthealth", or "/smarthealth?retryWrites=...".
const [pathPart, queryPart] = (process.env.MONGODB_URI || '').split('?');
const withoutDbName = pathPart.replace(/\/[^/]*$/, '');
process.env.MONGODB_URI = `${withoutDbName}/smarthealth_test${queryPart ? `?${queryPart}` : ''}`;

const http = require('http');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const app = require('../app');

let server;
let baseUrl;

async function startTestServer() {
  await connectDB();
  await mongoose.connection.dropDatabase();
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  baseUrl = `http://localhost:${server.address().port}`;
  return baseUrl;
}

async function stopTestServer() {
  await new Promise((resolve) => server.close(resolve));
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
}

async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}

const getCookie = (res) => res.headers.get('set-cookie');

module.exports = { startTestServer, stopTestServer, clearDatabase, getCookie };
