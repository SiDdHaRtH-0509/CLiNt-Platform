const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Routes
const { router: authRouter } = require('./routes/auth');
const { workshopRouter, requestRouter } = require('./routes/workshops');

app.use('/api/auth', authRouter);
app.use('/api/workshops', workshopRouter);
app.use('/api/requests', requestRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CLiNt API running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 CLiNt API running on port ${PORT}`));
