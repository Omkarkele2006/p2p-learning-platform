const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword, 
  githubLogin // <--- IMPORT THIS
} = require('../controllers/authController');
const {
  validate,
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules
} = require('../middleware/validationMiddleware');

router.post('/register', validate(registerRules), registerUser);
router.post('/login', validate(loginRules), loginUser);
router.post('/forgot-password', validate(forgotPasswordRules), forgotPassword);
router.post('/reset-password', validate(resetPasswordRules), resetPassword);

// --- NEW GITHUB ROUTE ---
router.post('/github', githubLogin); 

module.exports = router;