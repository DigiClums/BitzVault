const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planName: { type: String, required: true },
  amount: { type: Number, required: true },
  yieldRate: { type: Number, required: true },
  earningsType: String,
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
});

module.exports = mongoose.model('Investment', investmentSchema);
