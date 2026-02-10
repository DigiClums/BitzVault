const express = require('express');
const auth = require('../middleware/auth');
const Mining = require('../models/Mining');
const User = require('../models/User');
const router = express.Router();

router.post('/purchase', auth, async (req, res) => {
  try {
    const { machineName, price, periodIncome, period } = req.body;
    const user = await User.findById(req.userId);
    
    if (user.balance < price) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    user.balance -= price;
    await user.save();
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + period);
    
    const mining = new Mining({
      userId: req.userId,
      machineName,
      price,
      periodIncome,
      period,
      endDate
    });
    
    await mining.save();
    res.json(mining);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const machines = await Mining.find({ userId: req.userId });
    res.json(machines);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
