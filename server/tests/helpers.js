process.env.NODE_ENV = 'test';
require('dotenv').config({ quiet: true });

// Run tests against a dedicated database so they never touch real data.
const baseUri = (process.env.MONGODB_URI || '').replace(/\/$/, '');
process.env.MONGODB_URI = `${baseUri}/smarthealth_test`;

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
