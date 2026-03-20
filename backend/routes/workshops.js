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

module.exports = { workshopRouter: router, requestRouter };
