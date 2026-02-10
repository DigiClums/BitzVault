const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/team/:inviteCode', auth, async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const teamMembers = await User.find({ referredBy: inviteCode }).select('userId phone createdAt');
    res.json(teamMembers.map(u => ({
      userId: u.userId,
      phone: u.phone,
      joinedAt: u.createdAt
    })));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
