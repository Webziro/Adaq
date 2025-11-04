const PlateRequest = require('../models/PlateRequest');
const User = require('../models/User');

// @desc    Create a new plate request
// @route   POST /api/requests
// @access  Private (users)
exports.createPlateRequest = async (req, res) => {
  const { vehicleColor, vehicleChassisNumber } = req.body;

  try {
    // Check if a request with this chassis number already exists
    let plateRequest = await PlateRequest.findOne({ vehicleChassisNumber });
    if (plateRequest) {
      return res.status(400).json({ msg: 'Plate request with this chassis number already exists' });
    }

    plateRequest = new PlateRequest({
      user: req.user.id,
      vehicleColor,
      vehicleChassisNumber,
    });

    await plateRequest.save();

    // Update user's plateRequestStatus
    await User.findByIdAndUpdate(req.user.id, { plateRequestStatus: plateRequest.plateRequestStatus });

    res.json(plateRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all plate requests (Admin only) or user's requests
// @route   GET /api/requests
// @access  Private (admin or owner)
exports.getPlateRequests = async (req, res) => {
  try {
    if (req.user.position === 'admin') {
      const requests = await PlateRequest.find().populate('user', ['name', 'email', 'nin']);
      res.json(requests);
    } else {
      const requests = await PlateRequest.find({ user: req.user.id }).populate('user', ['name', 'email', 'nin']);
      res.json(requests);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update plate request status (Admin only)
// @route   PUT /api/requests/:id/status
// @access  Private (admin)
exports.updatePlateRequestStatus = async (req, res) => {
  const { status } = req.body;

  try {
    let plateRequest = await PlateRequest.findById(req.params.id);

    if (!plateRequest) {
      return res.status(404).json({ msg: 'Plate request not found' });
    }

    if (req.user.position !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to update status' });
    }

    plateRequest.plateRequestStatus = status;
    await plateRequest.save();

    // Update user's plateRequestStatus
    await User.findByIdAndUpdate(plateRequest.user, { plateRequestStatus: status });


    res.json(plateRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Delete a plate request (Admin only)
// @route   DELETE /api/requests/:id
// @access  Private (admin)
exports.deletePlateRequest = async (req, res) => {
  try {
    let plateRequest = await PlateRequest.findById(req.params.id);

    if (!plateRequest) {
      return res.status(404).json({ msg: 'Plate request not found' });
    }

    if (req.user.position !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to delete request' });
    }

    await PlateRequest.deleteOne({ _id: req.params.id });

    // Optionally, update the user's plateRequestStatus to 'pending' or similar if their last request was deleted
    await User.findByIdAndUpdate(plateRequest.user, { plateRequestStatus: 'pending' });


    res.json({ msg: 'Plate request removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
