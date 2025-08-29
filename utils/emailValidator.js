const dns = require('dns').promises;

// Enhanced email validation
const validateEmailDomain = async (email) => {
  try {
    const domain = email.split('@')[1];
    
    // Check if domain has MX records
    const mxRecords = await dns.resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch (error) {
    return false;
  }
};

// List of common disposable email domains to block
const disposableEmailDomains = [
  '10minutemail.com',
  'tempmail.org',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
  'temp-mail.org'
];

const isDisposableEmail = (email) => {
  const domain = email.split('@')[1].toLowerCase();
  return disposableEmailDomains.includes(domain);
};

module.exports = {
  validateEmailDomain,
  isDisposableEmail
};