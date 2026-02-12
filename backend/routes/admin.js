const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Mining = require('../models/Mining');
const router = express.Router();

function parseNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  };
}

function signAdminToken(username) {
  return jwt.sign(
    { role: 'admin', username },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
}

function requireAdmin(req, res, next) {
  const authHeader = req.header('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res.status(401).json({ message: 'Admin token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access denied' });
    }
    req.admin = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired admin token' });
  }
}

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = getAdminCredentials();

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret is not configured' });
    }

    if (username !== admin.username || password !== admin.password) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = signAdminToken(admin.username);
    return res.json({ token, expiresIn: 8 * 60 * 60 });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.use(requireAdmin);

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const users = await User.find().select('balance');
    const totalBalance = users.reduce((sum, u) => sum + (u.balance || 0), 0);
    const totalTransactions = await Transaction.countDocuments();
    const totalMining = await Mining.countDocuments();

    res.json({ totalUsers, totalBalance, totalTransactions, totalMining });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);

    const query = q
      ? {
          $or: [
            { userId: { $regex: q, $options: 'i' } },
            { phone: { $regex: q, $options: 'i' } },
            { inviteCode: { $regex: q, $options: 'i' } }
          ]
        }
      : {};

    const total = await User.countDocuments(query);
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const skip = (Math.min(page, totalPages) - 1) * limit;

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');

    res.json({
      items: users.map((u) => ({
        id: u._id,
        userId: u.userId,
        phone: u.phone,
        balance: u.balance,
        inviteCode: u.inviteCode,
        referredBy: u.referredBy,
        createdAt: u.createdAt
      })),
      pagination: {
        page: Math.min(page, totalPages),
        limit,
        total,
        totalPages
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions.map((t) => ({
      id: t._id,
      userId: t.userId,
      type: t.type,
      amount: t.amount,
      status: t.status,
      address: t.address,
      note: t.note,
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

router.post('/balance-adjust', async (req, res) => {
  try {
    const { userId, operation, amount, reason } = req.body;
    const normalizedOp = String(operation || '').toLowerCase();
    const parsedAmount = parseNumber(amount);

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    if (!['credit', 'debit'].includes(normalizedOp)) {
      return res.status(400).json({ message: 'Operation must be credit or debit' });
    }
    if (parsedAmount === null || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }
    if (!reason || String(reason).trim().length < 3) {
      return res.status(400).json({ message: 'Reason is required (min 3 characters)' });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldBalance = Number(user.balance || 0);

    if (normalizedOp === 'debit' && oldBalance < parsedAmount) {
      return res.status(400).json({ message: 'Insufficient balance for debit operation' });
    }

    const newBalance = normalizedOp === 'credit'
      ? oldBalance + parsedAmount
      : oldBalance - parsedAmount;

    user.balance = newBalance;
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'admin_adjustment',
      amount: parsedAmount,
      status: 'completed',
      note: `${normalizedOp}: ${String(reason).trim()}`
    });

    return res.json({
      success: true,
      userId,
      operation: normalizedOp,
      amount: parsedAmount,
      reason: String(reason).trim(),
      oldBalance,
      newBalance
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/update-balance', async (req, res) => {
  try {
    const { userId, balance } = req.body;
    const parsedBalance = parseNumber(balance);

    if (!userId || parsedBalance === null || parsedBalance < 0) {
      return res.status(400).json({ message: 'Invalid user ID or balance' });
    }

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.balance = parsedBalance;
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
