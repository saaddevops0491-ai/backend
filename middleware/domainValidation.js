const Company = require('../models/Company');

// Check if email domain is allowed
const validateCompanyDomain = (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const emailDomain = email.split('@')[1]?.toLowerCase();
    
    if (!emailDomain) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if domain exists in database
    const company = await Company.findOne({ 
      domain: emailDomain,
      isActive: true 
    });

    if (!company) {
      return res.status(403).json({
        success: false,
        message: 'Registration is restricted to employees of approved companies only. Please contact support if your company should be added.',
        contactSupport: 'support@saherflow.com'
      });
    }

    // Add company info to request for later use
    req.companyInfo = company;
    next();
  } catch (error) {
    console.error('Domain validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error validating email domain'
    });
  }
};

module.exports = { validateCompanyDomain };