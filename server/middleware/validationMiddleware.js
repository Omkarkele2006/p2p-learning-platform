const { validationResult, body } = require('express-validator');

// Reusable middleware runner
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array()
    });
  };
};

// Validation rules

const registerRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8, max: 64 })
    .withMessage('Password must be between 8 and 64 characters')
];

const loginRules = [
  body('email')
    .isEmail()
    .withMessage('Valid email required')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const forgotPasswordRules = [
  body('email')
    .isEmail()
    .withMessage('Valid email required')
    .normalizeEmail()
];

const resetPasswordRules = [
  body('email')
    .isEmail()
    .withMessage('Valid email required')
    .normalizeEmail(),
  body('otp')
    .isNumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits'),
  body('password')
    .isLength({ min: 8, max: 64 })
    .withMessage('Password must be between 8 and 64 characters')
];

const updateProfileRules = [
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array')
    .customSanitizer((array) => {
      if (Array.isArray(array)) {
        return array.map(val => (typeof val === 'string' ? val.trim() : val));
      }
      return array;
    }),
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array')
    .customSanitizer((array) => {
      if (Array.isArray(array)) {
        return array.map(val => (typeof val === 'string' ? val.trim() : val));
      }
      return array;
    }),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters')
];

const createResourceRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('link')
    .trim()
    .isURL({ protocols: ['http', 'https'], require_tld: true, require_protocol: true })
    .withMessage('Must be a valid http/https URL')
    .custom((value) => {
      if (typeof value === 'string' && value.toLowerCase().startsWith('javascript:')) {
        throw new Error('JavaScript URLs are not allowed');
      }
      return true;
    }),
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Type is required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters')
];

const createDiscussionRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be between 3 and 150 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 5000 })
    .withMessage('Content must not exceed 5000 characters')
];

const createReplyRules = [
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 2000 })
    .withMessage('Content must not exceed 2000 characters')
];

const contactRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  updateProfileRules,
  createResourceRules,
  createDiscussionRules,
  createReplyRules,
  contactRules
};

