require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'SmartHealth Admin';

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables before running this script.');
    console.error('Example: ADMIN_EMAIL=admin@smarthealth.com ADMIN_PASSWORD=ChangeMe123 npm run seed:admin');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log(`Admin with email ${email} already exists. Nothing to do.`);
      process.exit(0);
    }

    const admin = await Admin.create({ name, email, password });
    console.log(`Admin account created: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
}

seedAdmin();
