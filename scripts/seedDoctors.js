require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Doctor = require('../server/models/Doctor');

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
        bio: 'Expert in cardiovascular diseases with 15 years of experience'
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
        bio: 'Specialized in respiratory and lung diseases'
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
        bio: 'Expert in digestive system disorders'
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
        bio: 'Specialized in neurological disorders and brain conditions'
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
        bio: 'Expert in skin conditions and dermatological treatments'
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
        bio: 'Primary care physician with extensive experience in general medicine'
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
        bio: 'Specialized in autoimmune and joint disorders'
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
        bio: 'Expert in musculoskeletal conditions and orthopedic surgery'
    }
];

async function seedDoctors() {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare-app';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // Clear existing doctors
        await Doctor.deleteMany({});
        console.log('Cleared existing doctors');

        // Hash passwords before inserting
        const salt = await bcrypt.genSalt(10);
        const doctorsWithHashedPasswords = await Promise.all(
            doctors.map(async (doctor) => {
                const hashedPassword = await bcrypt.hash(doctor.password, salt);
                return {
                    ...doctor,
                    password: hashedPassword
                };
            })
        );

        // Insert new doctors (using insertMany with hashed passwords)
        // Note: insertMany bypasses middleware, so we hash manually above
        const createdDoctors = await Doctor.insertMany(doctorsWithHashedPasswords);
        console.log(`Successfully seeded ${createdDoctors.length} doctors`);

        // Display created doctors
        console.log('\nCreated Doctors:');
        createdDoctors.forEach(doctor => {
            console.log(`- ${doctor.name} (${doctor.specialty}) - ${doctor.email}`);
        });

        console.log('\n✅ All doctors can login with password: doctor123');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding doctors:', error);
        process.exit(1);
    }
}

seedDoctors();

