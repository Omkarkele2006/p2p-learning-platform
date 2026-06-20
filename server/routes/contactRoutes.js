const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contactController');
const { validate, contactRules } = require('../middleware/validationMiddleware');

router.route('/')
  .post(validate(contactRules), submitContactForm);

module.exports = router;
