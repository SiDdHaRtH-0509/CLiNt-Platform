const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL ERROR: JWT_SECRET env variable is not defined.');
}

const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '24h' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Please fill all required fields' });

    // String coercion and validation to prevent NoSQL injection
    const nameStr = typeof name === 'string' ? name.trim() : '';
    const emailStr = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const passwordStr = typeof password === 'string' ? password : '';
    const collegeStr = typeof college === 'string' ? college.trim() : '';
    const phoneStr = typeof phone === 'string' ? phone.trim() : '';

    if (!nameStr || !emailStr || !passwordStr) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Enforce email and password limits
    if (emailStr.length < 5 || emailStr.length > 254) {
      return res.status(400).json({ message: 'Email must be between 5 and 254 characters' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (passwordStr.length < 6 || passwordStr.length > 128) {
      return res.status(400).json({ message: 'Password must be between 6 and 128 characters' });
    }

    if (nameStr.length > 100) {
      return res.status(400).json({ message: 'Name must not exceed 100 characters' });
    }

    const exists = await User.findOne({ email: emailStr });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({
      name: nameStr,
      email: emailStr,
      password: passwordStr,
      college: collegeStr || undefined,
      phone: phoneStr || undefined
    });
    const token = generateToken(user._id);

    // Send welcome email
    try {
      const { sendWelcomeEmail } = require('../utils/index');
      await sendWelcomeEmail(user.email, user.name);
      console.log('✅ Welcome email sent to:', user.email);
    } catch (emailErr) {
      console.log('❌ Email error:', emailErr.message);
    }

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    // String coercion to prevent NoSQL injection
    const emailStr = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const passwordStr = typeof password === 'string' ? password : '';

    if (!emailStr || !passwordStr) return res.status(400).json({ message: 'Email and password required' });

    if (emailStr.length > 254 || passwordStr.length > 128) {
      return res.status(400).json({ message: 'Credentials exceed maximum length limit' });
    }

    const user = await User.findOne({ email: emailStr });
    if (!user || !(await user.comparePassword(passwordStr))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { router, authMiddleware, adminMiddleware };