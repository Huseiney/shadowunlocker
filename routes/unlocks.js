const express = require('express');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Submit unlock request (protected)
router.post('/', auth, async (req, res) => {
  const { imei } = req.body;

  if (!imei) return res.status(400).json({ message: 'IMEI is required' });

  if (req.user.balance < 20) {
    return res.status(400).json({ message: 'Insufficient balance. Deposit at least $20 USDT.' });
  }

  try {
    req.user.balance -= 20;
    req.user.unlockHistory.push({ imei, status: 'pending' });
    await req.user.save();

    // In a real setup, trigger external script here to process FRP unlock automatically

    res.json({ message: 'Unlock request submitted. You will be notified once complete.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unlock history (protected)
router.get('/', auth, async (req, res) => {
  try {
    res.json({ unlocks: req.user.unlockHistory });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
