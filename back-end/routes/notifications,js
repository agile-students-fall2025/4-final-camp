// routes/notifications.js
const express = require('express');
const router = express.Router();

/**
 * In-memory preference store keyed by userId.
 * Seed a sensible default for the demo user.
 */
const prefsStore = new Map([
  ['usr_001', {
    email: true,
    sms: false,
    inApp: true,
    reminder: { startDaysBefore: 5, frequency: 'daily' },
  }]
]);

/** Helper: get prefs with defaults if not set */
function getDefaults() {
  return {
    email: true,
    sms: false,
    inApp: true,
    reminder: { startDaysBefore: 5, frequency: 'daily' },
  };
}

function coercePrefs(input = {}) {
  const def = getDefaults();
  const out = { ...def };

  if (typeof input.email === 'boolean') out.email = input.email;
  if (typeof input.sms === 'boolean') out.sms = input.sms;
  if (typeof input.inApp === 'boolean') out.inApp = input.inApp;

  if (input.reminder && typeof input.reminder === 'object') {
    const r = { ...def.reminder };
    if (Number.isFinite(input.reminder.startDaysBefore)) {
      r.startDaysBefore = Number(input.reminder.startDaysBefore);
    }
    if (typeof input.reminder.frequency === 'string') {
      r.frequency = input.reminder.frequency;
    }
    out.reminder = r;
  }
  return out;
}

/**
 * GET /api/notifications/preferences?userId=...
 * Returns the user’s current notification preferences.
 */
router.get('/preferences', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }
  const prefs = prefsStore.get(userId) || getDefaults();
  return res.status(200).json({ userId, ...prefs });
});

/**
 * PUT /api/notifications/preferences
 * Body: { userId, email?:bool, sms?:bool, inApp?:bool, reminder?:{startDaysBefore?:number, frequency?:string} }
 * Upserts and returns the merged preferences.
 */
router.put('/preferences', (req, res) => {
  const { userId } = req.body || {};
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const current = prefsStore.get(userId) || getDefaults();
  const updates = coercePrefs(req.body);
  const merged = {
    email: updates.email ?? current.email,
    sms: updates.sms ?? current.sms,
    inApp: updates.inApp ?? current.inApp,
    reminder: {
      startDaysBefore: (updates.reminder?.startDaysBefore ?? current.reminder.startDaysBefore),
      frequency: (updates.reminder?.frequency ?? current.reminder.frequency),
    },
  };

  prefsStore.set(userId, merged);
  return res.status(200).json({ ok: true, userId, ...merged });
});

module.exports = router;
