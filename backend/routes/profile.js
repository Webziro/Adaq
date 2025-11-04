const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload'); // Multer upload middleware
const { updateProfile, uploadPassportImage } = require('../controllers/profileController');

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, updateProfile);

// @route   POST /api/profile/passport
// @desc    Upload passport image
// @access  Private
router.post('/passport', auth, upload, uploadPassportImage);

module.exports = router;
