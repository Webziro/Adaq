const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  const { nin, passport, vehicleColor, vehicleChassisNumber, position } = req.body;

  const profileFields = {};
  if (nin) profileFields.nin = nin;
  if (passport) profileFields.passport = passport;
  if (vehicleColor) profileFields.vehicleColor = vehicleColor;
  if (vehicleChassisNumber) profileFields.vehicleChassisNumber = vehicleChassisNumber;
  if (position) profileFields.position = position;

  try {
    let user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Update and save profile
    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.uploadPassportImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    user.passport = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ msg: 'Passport image uploaded successfully', filePath: user.passport });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
