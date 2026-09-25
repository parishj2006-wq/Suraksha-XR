const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  attempt: { type: mongoose.Schema.Types.ObjectId, ref: 'Attempt', required: true },
  certificateId: { type: String, required: true, unique: true },
  issuedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Certificate', certificateSchema);