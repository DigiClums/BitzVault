const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const router = express.Router();

router.post('/deposit', auth, async (req, res) => {
  try {
    const { amount, address } = req.body;
    const user = await User.findById(req.userId);
    
    user.balance += parseFloat(amount);
    await user.save();
    
    const transaction = new Transaction({
      userId: req.userId,
      type: 'deposit',
      amount: parseFloat(amount),
      address,
      status: 'completed'
    });
    
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount, address } = req.body;
    const user = await User.findById(req.userId);
    
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    user.balance -= parseFloat(amount);
    await user.save();
    
    const transaction = new Transaction({
      userId: req.userId,
      type: 'withdraw',
      amount: parseFloat(amount),
      address,
      status: 'completed'
    });
    
    await transaction.save();
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
