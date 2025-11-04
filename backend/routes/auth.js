const express = require('express');
const router = express.Router();
const { registerUser, loginUser, adminLogin } = require('../controllers/authController');
const { 
  requestPasswordReset, 
  verifyResetCode, 
  resetPassword 
} = require('../controllers/passwordResetController');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   POST api/auth/admin-login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/admin-login', adminLogin);

// @route   POST api/auth/forgot-password
// @desc    Request password reset code
// @access  Public
router.post('/forgot-password', requestPasswordReset);

// @route   POST api/auth/verify-reset-code
// @desc    Verify password reset code
// @access  Public
router.post('/verify-reset-code', verifyResetCode);

// @route   POST api/auth/reset-password
// @desc    Reset password with verified code
// @access  Public
router.post('/reset-password', resetPassword);

module.exports = router;