const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

/* ---------- core middleware ---------- */
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Apply rate limiting to all API routes
app.use('/api/', generalLimiter);

/* ---------- health & root ---------- */
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'camp-backend',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req, res) =>
  res.status(200).send('C.A.M.P. Backend API running successfully!')
);

/* ---------- feature routes ---------- */
// existing routes
const items = require('./routes/items');
const reservations = require('./routes/reservations');
const fines = require('./routes/fines');
const users = require('./routes/users');
const notifications = require('./routes/notifications');
const alerts = require('./routes/alerts');
const help = require('./routes/help');
const facilities = require('./routes/facilities');

// newly added routes to satisfy smoke.sh
const auth = require('./routes/auth');           // /api/auth/student/login
const waitlist = require('./routes/waitlist');   // /api/waitlist
const borrowals = require('./routes/borrowals'); // /api/borrowals
const payments = require('./routes/payments');   // /api/payments/..., /api/payments/history
const policies = require('./routes/policies');   // /api/policies
const staff = require('./routes/staff');         // /api/staff/...
const dashboard = require('./routes/dashboard'); // /api/dashboard

// mounts
app.use('/api/items', items);
app.use('/api/reservations', reservations);
app.use('/api/fines', fines);
app.use('/api/users', users);
app.use('/api/notifications', notifications);
app.use('/api/alerts', alerts);
app.use('/api/help', help);
app.use('/api/facilities', facilities);

app.use('/api/auth', auth);
app.use('/api/waitlist', waitlist);
app.use('/api/borrowals', borrowals);
app.use('/api/payments', payments);
app.use('/api/policies', policies);
app.use('/api/staff', staff);
app.use('/api/dashboard', dashboard);

/* ---------- 404 + error handlers ---------- */
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'Unexpected error',
  });
});

module.exports = app;
