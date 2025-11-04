const express = require('express');
const router = express.Router();
const { registerUser, loginUser, adminLogin } = require('../controllers/authController');

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

module.exports = router;
