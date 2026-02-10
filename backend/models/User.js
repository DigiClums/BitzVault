const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fundPassword: String,
  balance: { type: Number, default: 0 },
  inviteCode: { type: String, unique: true },
  referredBy: String,
  bankCard: {
    cardNumber: String,
    bankName: String,
    holderName: String
  },
  walletAddress: String,
  vipLevel: { type: Number, default: 0 },
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
