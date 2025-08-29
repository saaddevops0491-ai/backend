const User = require('../models/User');

// Middleware to check if email is verified for protected routes
const requireEmailVerification = async (req, res, next) => {
  try {
    if (!req.user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address before accessing this resource. Check your inbox for the verification email.'
      });
    }
    next();
  } catch (error) {
    console.error('Email verification middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking email verification'
    });
  }
};

// Check if email exists in our system before allowing registration
const checkEmailExists = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // For this implementation, we'll allow any valid email format
    // In production, you might want to verify against a whitelist or use an email verification service
    
    // Basic email format validation is already handled by express-validator
    // You can add additional checks here if needed
    
    next();
  } catch (error) {
    console.error('Email existence check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking email'
    });
  }
};

module.exports = { requireEmailVerification, checkEmailExists };