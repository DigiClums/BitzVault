const mongoose = require('mongoose');

const miningSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  machineName: { type: String, required: true },
  price: { type: Number, required: true },
  periodIncome: { type: Number, required: true },
  period: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
});

module.exports = mongoose.model('Mining', miningSchema);
