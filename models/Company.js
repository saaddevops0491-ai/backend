// models/Company.js
const mongoose = require('mongoose');
const validator = require('validator');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  domains: [{
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    set: v => typeof v === 'string' ? v.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '') : v,
    validate: {
      validator: function(domain) {
        if (!domain) return false;
        // domain has been lowercased/trimmed/set above, but double-sanitize just in case
        const d = String(domain).trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
        // isFQDN handles multi-label domains and country-code TLDs (e.g. qtm.com.qa)
        return validator.isFQDN(d, { require_tld: true, allow_underscores: false, allow_trailing_dot: false });
      },
      message: props => `${props.value} is not a valid domain`
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid contact email'
    ]
  }
}, {
  timestamps: true
});

companySchema.index({ domains: 1 });
companySchema.index({ isActive: 1 });

companySchema.methods.hasDomain = function(domain) {
  const normalizedDomain = String(domain).trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
  return this.domains.some(companyDomain => 
    normalizedDomain === companyDomain || normalizedDomain.endsWith('.' + companyDomain)
  );
};

companySchema.statics.findByDomain = async function(domain) {
  const normalizedDomain = String(domain).trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
  const companies = await this.find({ 
    isActive: true,
    domains: { $exists: true, $ne: [] }
  });
  return companies.find(company => company.hasDomain(normalizedDomain));
};

module.exports = mongoose.model('Company', companySchema);
