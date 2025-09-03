const User = require('../models/User');

// Middleware to check 2FA requirement
const requireTwoFactor = async (req, res, next) => {
  try {
    if (req.user.isTwoFactorEnabled && !req.twoFactorVerified) {
      return res.status(403).json({
        success: false,
        message: 'Two-factor authentication required',
        requiresTwoFactor: true
      });
    }
    next();
  } catch (error) {
    console.error('Two-factor middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking two-factor authentication'
    });
  }
};

module.exports = { requireTwoFactor };