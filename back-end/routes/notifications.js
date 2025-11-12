
const express = require('express');
const router = express.Router();


const prefsStore = new Map([
  ['usr_001', {
    email: true,
    sms: false,
    inApp: true,
    reminder: { startDaysBefore: 5, frequency: 'daily' },
  }]
]);


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


router.get('/preferences', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }
  const prefs = prefsStore.get(userId) || getDefaults();
  return res.status(200).json({ userId, ...prefs });
});


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
