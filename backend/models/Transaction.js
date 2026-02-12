const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit', 'withdraw', 'commission', 'mining', 'investment'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USDT' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  address: String,
  txHash: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
