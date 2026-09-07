const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  timeTakenSeconds: { type: Number },
  mistakes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Attempt', attemptSchema);