require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');

const doctors = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    password: 'doctor123',
    specialty: 'Cardiology',
    qualifications: 'MD, FACC',
    experience: 15,
    hospital: 'City General Hospital',
    phone: '555-0101',
    licenseNumber: 'LIC-CARD-0101',
    bio: 'Expert in cardiovascular diseases with 15 years of experience',
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    password: 'doctor123',
    specialty: 'Pulmonology',
    qualifications: 'MD, FCCP',
    experience: 12,
    hospital: 'Metropolitan Medical Center',
    phone: '555-0102',
    licenseNumber: 'LIC-PULM-0102',
    bio: 'Specialized in respiratory and lung diseases',
  },
  {
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@hospital.com',
    password: 'doctor123',
    specialty: 'Gastroenterology',
    qualifications: 'MD, FACG',
    experience: 10,
    hospital: 'Regional Hospital',
    phone: '555-0103',
    licenseNumber: 'LIC-GAST-0103',
    bio: 'Expert in digestive system disorders',
  },
  {
    name: 'Dr. James Wilson',
    email: 'james.wilson@hospital.com',
    password: 'doctor123',
    specialty: 'Neurology',
    qualifications: 'MD, FAAN',
    experience: 18,
    hospital: 'University Medical Center',
    phone: '555-0104',
    licenseNumber: 'LIC-NEUR-0104',
    bio: 'Specialized in neurological disorders and brain conditions',
  },
  {
    name: 'Dr. Lisa Anderson',
    email: 'lisa.anderson@hospital.com',
    password: 'doctor123',
    specialty: 'Dermatology',
    qualifications: 'MD, FAAD',
    experience: 8,
    hospital: 'City General Hospital',
    phone: '555-0105',
    licenseNumber: 'LIC-DERM-0105',
    bio: 'Expert in skin conditions and dermatological treatments',
  },
  {
    name: 'Dr. Robert Taylor',
    email: 'robert.taylor@hospital.com',
    password: 'doctor123',
    specialty: 'General Medicine',
    qualifications: 'MD, FACP',
    experience: 20,
    hospital: 'Community Health Center',
    phone: '555-0106',
    licenseNumber: 'LIC-GENM-0106',
    bio: 'Primary care physician with extensive experience in general medicine',
  },
  {
    name: 'Dr. Jennifer Martinez',
    email: 'jennifer.martinez@hospital.com',
    password: 'doctor123',
    specialty: 'Rheumatology',
    qualifications: 'MD, FACR',
    experience: 14,
    hospital: 'Metropolitan Medical Center',
    phone: '555-0107',
    licenseNumber: 'LIC-RHEU-0107',
    bio: 'Specialized in autoimmune and joint disorders',
  },
  {
    name: 'Dr. David Brown',
    email: 'david.brown@hospital.com',
    password: 'doctor123',
    specialty: 'Orthopedics',
    qualifications: 'MD, FACS',
    experience: 16,
    hospital: 'Regional Hospital',
    phone: '555-0108',
    licenseNumber: 'LIC-ORTH-0108',
    bio: 'Expert in musculoskeletal conditions and orthopedic surgery',
  },
];

async function seedDoctors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    // status: 'approved' + a fixed weekly availability so these demo doctors are
    // immediately bookable end-to-end without going through the admin approval flow.
    const defaultAvailability = [1, 2, 3, 4, 5].map((dayOfWeek) => ({
      dayOfWeek,
      startTime: '09:00',
      endTime: '17:00',
      slotMinutes: 30,
    }));

    const createdDoctors = [];
    for (const doctor of doctors) {
      const created = await Doctor.create({ ...doctor, status: 'approved', availability: defaultAvailability });
      createdDoctors.push(created);
    }

    console.log(`Successfully seeded ${createdDoctors.length} doctors`);
    console.log('\nCreated Doctors:');
    createdDoctors.forEach((doctor) => {
      console.log(`- ${doctor.name} (${doctor.specialty}) - ${doctor.email}`);
    });

    console.log('\nAll doctors can log in with password: doctor123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding doctors:', error);
    process.exit(1);
  }
}

seedDoctors();
