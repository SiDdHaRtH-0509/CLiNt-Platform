const express = require('express');
const router = express.Router();
const requestRouter = express.Router();
const { Workshop, Participant, WorkshopRequest } = require('../models/index');
const { authMiddleware, adminMiddleware } = require('./auth');

// GET /api/workshops
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isActive: true };
    if (category && category !== 'All') query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };
    const workshops = await Workshop.find(query).sort({ createdAt: -1 });
    res.json({ success: true, workshops });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/workshops/:id
router.get('/:id', async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    res.json({ success: true, workshop });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/workshops/:id/enroll
router.post('/:id/enroll', authMiddleware, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    if (workshop.enrolledCount >= workshop.seats) return res.status(400).json({ message: 'Workshop is full' });
    const existing = await Participant.findOne({ user: req.user._id, workshop: req.params.id });
    if (existing) return res.status(400).json({ message: 'Already enrolled' });
    await Participant.create({ user: req.user._id, workshop: req.params.id });
    await Workshop.findByIdAndUpdate(req.params.id, { $inc: { enrolledCount: 1 } });
    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/workshops/my/enrolled
router.get('/my/enrolled', authMiddleware, async (req, res) => {
  try {
    const participations = await Participant.find({ user: req.user._id }).populate('workshop');
    res.json({ success: true, workshops: participations.map(p => p.workshop) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/requests
requestRouter.post('/', async (req, res) => {
  try {
    const { college, contactPerson, email, phone, topic, expectedStudents, location, message, preferredDate } = req.body;
    if (!college || !contactPerson || !email || !topic) return res.status(400).json({ message: 'Missing required fields' });
    const request = await WorkshopRequest.create({ college, contactPerson, email, phone, topic, expectedStudents, location, message, preferredDate });
    res.status(201).json({ success: true, request, message: "Request submitted! We'll contact you within 24 hours." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/requests (admin)
requestRouter.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;
    const requests = await WorkshopRequest.find(query).sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/requests/:id/status (admin)
requestRouter.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const request = await WorkshopRequest.findByIdAndUpdate(req.params.id,
      { status, adminNote, ...(status === 'approved' ? { approvedAt: new Date() } : {}) },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin routes
const adminRouter = express.Router();
const { User } = require('../models/index');

adminRouter.get('/students', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Chatbot route
const chatRouter = express.Router();

chatRouter.post('/', async (req, res) => {
  console.log('💬 Chat request received:', req.body?.message);
  try {
    const { message, history } = req.body;
    const SYSTEM_PROMPT = `You are CLiNt AI, a helpful assistant for CLiNt — a tech workshop platform for engineering students. CLiNt offers workshops in AI & Machine Learning, Full-Stack Web Development, Cybersecurity & Ethical Hacking, and Developer Tools. Workshop prices range from 2499 to 4999 rupees. Duration 2-5 days. Keep answers concise and friendly.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
  },
  body: JSON.stringify({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(history || []).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text
      })),
      { role: 'user', content: message }
    ],
    max_tokens: 500
  })
});
const data = await response.json();
console.log('Groq response:', JSON.stringify(data).slice(0, 300));
const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";
    res.json({ success: true, reply });
  } catch (err) {
    console.log('Chat error:', err.message);
    res.status(500).json({ success: false, reply: "Server error. Try again!" });
  }
});

module.exports = { workshopRouter: router, requestRouter, adminRouter, chatRouter };
