require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes      = require('./routes/auth');
const userRoutes      = require('./routes/users');
const orgRoutes       = require('./routes/orgs');
const siteRoutes      = require('./routes/sites');
const adminRoutes     = require('./routes/admin');
const homepageRoutes  = require('./routes/homepage');
const billingRoutes   = require('./routes/billing');
const contactRoutes   = require('./routes/contact');
const { stripeWebhook } = require('./routes/billing');

const app = express();

// ── Middleware ──────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g. mobile apps, curl)
    // and any localhost port during development
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin) || allowedOrigins.includes(origin))
      return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
// ── Stripe webhook — must be BEFORE express.json() to receive raw body ──
app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json({ limit: '10mb' }));

// ── Routes ──────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/orgs',     orgRoutes);
app.use('/api/sites',    siteRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/billing',  billingRoutes);
app.use('/api/contact',  contactRoutes);

// ── Serve React in production ────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../client/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    res.sendFile(path.join(distPath, 'index.html'), err => {
      if (err) {
        console.error('❌ Error serving index.html:', err);
        res.status(500).send('Internal Server Error');
      }
    });
  });
}

// Error logging middleware (for static file errors and others)
app.use((err, req, res, next) => {
  console.error('❌ Express error:', err);
  res.status(500).send('Internal Server Error');
});
// ── Connect to MongoDB ───────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀  Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });
