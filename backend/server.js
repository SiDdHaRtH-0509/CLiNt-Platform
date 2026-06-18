const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Headers Middleware (combats Clipboard Attack, clickjacking, XSS, MIME sniffing)
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Permissions-Policy', 'clipboard-write=(self), clipboard-read=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Safe Content Security Policy (CSP)
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.groq.com https://api.brevo.com;");
  next();
});

// Replay Attack Protection Middleware
const processedNonces = new Set();
setInterval(() => processedNonces.clear(), 10 * 60 * 1000); // clear every 10 mins

app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const timestamp = req.headers['x-request-timestamp'];
    const nonce = req.headers['x-request-nonce'];

    if (!timestamp || !nonce) {
      return res.status(400).json({ success: false, message: 'Missing security headers (potential replay attack).' });
    }

    const clientTime = parseInt(timestamp, 10);
    const serverTime = Date.now();
    
    // Check if the request is within 5 minutes window
    if (isNaN(clientTime) || Math.abs(serverTime - clientTime) > 5 * 60 * 1000) {
      return res.status(400).json({ success: false, message: 'Request expired (potential replay attack).' });
    }

    // Check if the nonce was already used
    if (processedNonces.has(nonce)) {
      return res.status(400).json({ success: false, message: 'Duplicate request detected (potential replay attack).' });
    }
    processedNonces.add(nonce);
  }
  next();
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

const { router: authRouter } = require('./routes/auth');
const { workshopRouter, requestRouter, adminRouter, chatRouter } = require('./routes/workshops');

app.use('/api/auth', authRouter);
app.use('/api/workshops', workshopRouter);
app.use('/api/requests', requestRouter);
app.use('/api/admin', adminRouter);
app.use('/api/chat', chatRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CLiNt API running' });
});

app.get('/', (req, res)  => {
  res.send('🚀CLiNt Backened is Running')
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 CLiNt API running on port ${PORT}`));
