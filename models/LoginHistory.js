const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  location: {
    country: String,
    city: String,
    region: String
  },
  loginTime: {
    type: Date,
    default: Date.now
  },
  loginStatus: {
    type: String,
    enum: ['success', 'failed', 'blocked'],
    default: 'success'
  },
  failureReason: String,
  deviceInfo: {
    browser: String,
    os: String,
    device: String
  }
}, {
  timestamps: true
});

// Index for faster queries
loginHistorySchema.index({ userId: 1, loginTime: -1 });
loginHistorySchema.index({ ipAddress: 1 });

module.exports = mongoose.model('LoginHistory', loginHistorySchema);