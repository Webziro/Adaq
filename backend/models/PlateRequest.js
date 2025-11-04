const mongoose = require('mongoose');

const PlateRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  vehicleColor: {
    type: String,
    required: true,
  },
  vehicleChassisNumber: {
    type: String,
    required: true,
    unique: true,
  },
  plateRequestStatus: {
    type: String,
    enum: ['pending', 'started', 'in-progress', 'completed'],
    default: 'pending',
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PlateRequest', PlateRequestSchema);
