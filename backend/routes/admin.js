const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Mining = require('../models/Mining');
const Investment = require('../models/Investment');
const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const users = await User.find();
    const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
    const totalTransactions = await Transaction.countDocuments();
    const totalMining = await Mining.countDocuments();
    
    res.json({ totalUsers, totalBalance, totalTransactions, totalMining });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users.map(u => ({
      id: u._id,
      userId: u.userId,
      phone: u.phone,
      balance: u.balance,
      inviteCode: u.inviteCode,
      referredBy: u.referredBy,
      createdAt: u.createdAt
    })));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions.map(t => ({
      id: t._id,
      userId: t.userId,
      type: t.type,
      amount: t.amount,
      status: t.status,
      address: t.address,
      createdAt: t.createdAt
    })));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/mining', async (req, res) => {
  try {
    const mining = await Mining.find();
    res.json(mining);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/update-balance', async (req, res) => {
  try {
    const { userId, balance } = req.body;
    const user = await User.findOne({ userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.balance = balance;
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/transactions/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
