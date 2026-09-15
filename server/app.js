const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { NODE_ENV, CLIENT_URL } = require('./config/env');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const authenticate = require('./middleware/authenticate');
const authorize = require('./middleware/authorize');
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const adminRoutes = require('./routes/admin');
const predictRoutes = require('./routes/predict');
const appointmentRoutes = require('./routes/appointments');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

if (NODE_ENV !== 'test') {
  app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));
}

const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false });
app.use('/api', generalLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', env: NODE_ENV });
});

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admin', authenticate, authorize('admin'), adminRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/appointments', appointmentRoutes);

const clientDist = path.join(__dirname, '../client/dist');
if (NODE_ENV === 'production') {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
