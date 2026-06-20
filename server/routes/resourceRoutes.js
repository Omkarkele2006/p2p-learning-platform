const express = require('express');
const router = express.Router();
const { createResource, getAllResources } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const { validate, createResourceRules } = require('../middleware/validationMiddleware');

router.route('/')
  .get(getAllResources)       // Anyone can see resources
  .post(protect, validate(createResourceRules), createResource); // Only logged-in users can upload

module.exports = router;