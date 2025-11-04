const express = require('express');
const router = express.Router();
const { createPlateRequest, getPlateRequests, updatePlateRequestStatus, deletePlateRequest } = require('../controllers/plateRequestController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// @route   POST /api/requests
// @desc    Create a new plate request
// @access  Private (users)
router.post('/', auth, createPlateRequest);

// @route   GET /api/requests
// @desc    Get all plate requests (Admin only) or user's requests
// @access  Private (admin or owner)
router.get('/', auth, getPlateRequests);

// @route   PUT /api/requests/:id/status
// @desc    Update plate request status (Admin only)
// @access  Private (admin)
router.put('/:id/status', auth, authorize(['admin']), updatePlateRequestStatus);

// @route   DELETE /api/requests/:id
// @desc    Delete a plate request (Admin only)
// @access  Private (admin)
router.delete('/:id', auth, authorize(['admin']), deletePlateRequest);

module.exports = router;
