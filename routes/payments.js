const express = require('express');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Check balance (protected)
router.get('/balance', auth, async (req, res) => {
  res.json({ balance: req.user.balance });
});

// Manual deposit crediting (admin will use this or script)
router.post('/credit', async (req, res) => {
  const { email, amount } = req.body;

  if (!email || !amount) return res.status(400).json({ message: 'Missing fields' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.balance += parseFloat(amount);
    await user.save();

    res.json({ message: `Credited $${amount} to ${email}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
