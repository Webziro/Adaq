const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  nin: {
    type: String,
  },
  passport: {
    type: String,
  },
  vehicleColor: {
    type: String,
  },
  vehicleChassisNumber: {
    type: String,
  },
  position: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  plateRequestStatus: {
    type: String,
    enum: ['pending', 'started', 'in-progress', 'completed'],
    default: 'pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
