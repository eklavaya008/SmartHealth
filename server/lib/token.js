const jwt = require('jsonwebtoken');
const { JWT_SECRET, NODE_ENV } = require('../config/env');

const COOKIE_NAME = 'token';
const EXPIRES_IN = '7d';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const signToken = ({ id, role }) => jwt.sign({ id, role }, JWT_SECRET, { expiresIn: EXPIRES_IN });

const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE_MS,
    path: '/',
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: NODE_ENV === 'production', sameSite: 'lax', path: '/' });
};

module.exports = { COOKIE_NAME, signToken, setAuthCookie, clearAuthCookie };
