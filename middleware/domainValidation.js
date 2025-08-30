// Allowed company domains for registration
const allowedDomains = [
  'aramco.com',
  'adnoc.ae', 
  'qtm.com.qa',
  'pdo.co.om',
  'dnv.com',
  'saherflow.com'
];

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

    // Check if domain is in allowed list
    const isAllowedDomain = allowedDomains.some(domain => 
      emailDomain === domain || emailDomain.endsWith('.' + domain)
    );

    if (!isAllowedDomain) {
      return res.status(403).json({
        success: false,
        message: `Registration is restricted to employees of approved companies only. Allowed domains: ${allowedDomains.join(', ')}`,
        allowedDomains: allowedDomains
      });
    }

    next();
  } catch (error) {
    console.error('Domain validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error validating email domain'
    });
  }
};

module.exports = { validateCompanyDomain, allowedDomains };