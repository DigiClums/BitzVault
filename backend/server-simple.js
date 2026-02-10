const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage
const users = [];
const transactions = [];
const mining = [];
const investments = [];

const JWT_SECRET = 'your_jwt_secret_key';

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Register
app.post('/api/auth/register', async (req, res) => {
  const { phone, password, inviteCode } = req.body;
  
  if (users.find(u => u.phone === phone)) {
    return res.status(400).json({ message: 'User exists' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = 'a' + Math.floor(Math.random() * 10000000000);
  const userInviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const user = {
    id: Date.now(),
    userId,
    phone,
    password: hashedPassword,
    inviteCode: userInviteCode,
    referredBy: inviteCode,
    balance: 0
  };
  
  users.push(user);
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ token, userId: user.userId });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { phone, password } = req.body;
  const user = users.find(u => u.phone === phone);
  
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ token, userId: user.userId });
});

// Get profile
app.get('/api/users/profile', auth, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Get balance
app.get('/api/users/balance', auth, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  res.json({ balance: user.balance });
});

// Deposit
app.post('/api/transactions/deposit', auth, (req, res) => {
  const { amount, address } = req.body;
  const user = users.find(u => u.id === req.userId);
  user.balance += parseFloat(amount);
  const transaction = {
    id: Date.now(),
    userId: req.userId,
    type: 'deposit',
    amount: parseFloat(amount),
    address,
    status: 'completed',
    createdAt: new Date()
  };
  transactions.push(transaction);
  res.json(transaction);
});

// Withdraw
app.post('/api/transactions/withdraw', auth, (req, res) => {
  const { amount, address } = req.body;
  const user = users.find(u => u.id === req.userId);
  
  if (user.balance < amount) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }
  
  user.balance -= parseFloat(amount);
  const transaction = {
    id: Date.now(),
    userId: req.userId,
    type: 'withdraw',
    amount: parseFloat(amount),
    address,
    status: 'completed',
    createdAt: new Date()
  };
  transactions.push(transaction);
  res.json(transaction);
});

// Get transactions
app.get('/api/transactions', auth, (req, res) => {
  const userTransactions = transactions.filter(t => t.userId === req.userId);
  res.json(userTransactions);
});

// Get mining machines
app.get('/api/mining', auth, (req, res) => {
  const userMining = mining.filter(m => m.userId === req.userId);
  res.json(userMining);
});

// Get investments
app.get('/api/investments', auth, (req, res) => {
  const userInvestments = investments.filter(i => i.userId === req.userId);
  res.json(userInvestments);
});

// Get team members
app.get('/api/users/team/:inviteCode', auth, (req, res) => {
  const { inviteCode } = req.params;
  const teamMembers = users.filter(u => u.referredBy === inviteCode).map(u => ({
    userId: u.userId,
    phone: u.phone,
    joinedAt: u.id
  }));
  res.json(teamMembers);
});

// Admin endpoints
app.get('/api/admin/stats', (req, res) => {
  const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
  res.json({
    totalUsers: users.length,
    totalBalance,
    totalTransactions: transactions.length,
    totalMining: mining.length
  });
});

app.get('/api/admin/users', (req, res) => {
  res.json(users.map(u => ({ ...u, password: undefined })));
});

app.get('/api/admin/transactions', (req, res) => {
  res.json(transactions);
});

app.get('/api/admin/mining', (req, res) => {
  res.json(mining);
});

app.post('/api/admin/update-balance', (req, res) => {
  const { userId, balance } = req.body;
  const user = users.find(u => u.userId === userId);
  if (user) {
    user.balance = balance;
    res.json({ success: true });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/api/admin/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index !== -1) {
    users.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/api/admin/transactions/:id', (req, res) => {
  const index = transactions.findIndex(t => t.id === parseInt(req.params.id));
  if (index !== -1) {
    transactions.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ message: 'Transaction not found' });
  }
});

// Purchase mining
app.post('/api/mining/purchase', auth, (req, res) => {
  const { machineName, price, periodIncome, period } = req.body;
  const user = users.find(u => u.id === req.userId);
  
  if (user.balance < price) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }
  
  user.balance -= price;
  const machine = {
    id: Date.now(),
    userId: req.userId,
    machineName,
    price,
    periodIncome,
    period,
    startDate: new Date()
  };
  mining.push(machine);
  res.json(machine);
});

// Purchase investment
app.post('/api/investments/purchase', auth, (req, res) => {
  const { planName, amount, yieldRate, earningsType, duration } = req.body;
  const user = users.find(u => u.id === req.userId);
  
  if (user.balance < amount) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }
  
  user.balance -= amount;
  const investment = {
    id: Date.now(),
    userId: req.userId,
    planName,
    amount,
    yieldRate,
    earningsType,
    startDate: new Date()
  };
  investments.push(investment);
  res.json(investment);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
