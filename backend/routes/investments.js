const express = require('express');
const auth = require('../middleware/auth');
const Investment = require('../models/Investment');
const User = require('../models/User');
const router = express.Router();

router.post('/purchase', auth, async (req, res) => {
  try {
    const { planName, amount, yieldRate, earningsType, duration } = req.body;
    const user = await User.findById(req.userId);
    
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    user.balance -= amount;
    await user.save();
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);
    
    const investment = new Investment({
      userId: req.userId,
      planName,
      amount,
      yieldRate,
      earningsType,
      endDate
    });
    
    await investment.save();
    res.json(investment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.userId });
    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
