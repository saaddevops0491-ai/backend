const express = require('express');
const { body, validationResult } = require('express-validator');
const Company = require('../models/Company');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all companies
// @route   GET /api/company/all
// @access  Private/Admin
router.get('/all', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const companies = await Company.find()
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Company.countDocuments();

    res.json({
      success: true,
      data: {
        companies,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting companies'
    });
  }
});

// @desc    Add new company
// @route   POST /api/company/add
// @access  Private/Admin
router.post('/add', protect, admin, [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('domain')
    .trim()
    .matches(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)
    .withMessage('Please enter a valid domain'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('industry')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Industry cannot exceed 100 characters'),
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country cannot exceed 100 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, domain, description, industry, country } = req.body;

    // Check if domain already exists
    const existingCompany = await Company.findOne({ domain: domain.toLowerCase() });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Company with this domain already exists'
      });
    }

    const company = await Company.create({
      name,
      domain: domain.toLowerCase(),
      description,
      industry,
      country
    });

    res.status(201).json({
      success: true,
      message: 'Company added successfully',
      data: {
        company
      }
    });
  } catch (error) {
    console.error('Add company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding company'
    });
  }
});

// @desc    Update company
// @route   PUT /api/company/:id
// @access  Private/Admin
router.put('/:id', protect, admin, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('domain')
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)
    .withMessage('Please enter a valid domain'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('industry')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Industry cannot exceed 100 characters'),
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country cannot exceed 100 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, domain, description, industry, country, isActive } = req.body;

    // Check if domain already exists (excluding current company)
    if (domain) {
      const existingCompany = await Company.findOne({ 
        domain: domain.toLowerCase(),
        _id: { $ne: req.params.id }
      });
      if (existingCompany) {
        return res.status(400).json({
          success: false,
          message: 'Another company with this domain already exists'
        });
      }
    }

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(domain && { domain: domain.toLowerCase() }),
        ...(description !== undefined && { description }),
        ...(industry !== undefined && { industry }),
        ...(country !== undefined && { country }),
        ...(isActive !== undefined && { isActive })
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: {
        company
      }
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating company'
    });
  }
});

// @desc    Delete company
// @route   DELETE /api/company/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      message: 'Company deactivated successfully'
    });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting company'
    });
  }
});

module.exports = router;