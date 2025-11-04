const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// In-memory store for reset codes (in production, use Redis or database)
const resetCodes = new Map();

// Generate 6-digit code
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if user exists
      return res.json({ msg: 'If the email exists, a reset code has been sent.' });
    }

    // Generate reset code
    const resetCode = generateResetCode();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store reset code with expiration
    resetCodes.set(email, {
      code: resetCode,
      expiresAt,
      attempts: 0
    });

    // TODO: In production, send email with reset code
    // For now, log to console (in development)
    console.log(`Reset code for ${email}: ${resetCode}`);
    console.log(`This code expires in 15 minutes`);

    res.json({ 
      msg: 'A reset code has been sent to your email.',
      // In development only, include code in response
      ...(process.env.NODE_ENV === 'development' && { code: resetCode })
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const resetData = resetCodes.get(email);

    if (!resetData) {
      return res.status(400).json({ msg: 'Invalid or expired reset code.' });
    }

    // Check if code is expired
    if (Date.now() > resetData.expiresAt) {
      resetCodes.delete(email);
      return res.status(400).json({ msg: 'Reset code has expired.' });
    }

    // Check attempts (max 5)
    if (resetData.attempts >= 5) {
      resetCodes.delete(email);
      return res.status(400).json({ msg: 'Too many failed attempts. Please request a new code.' });
    }

    // Verify code
    if (resetData.code !== code) {
      resetData.attempts += 1;
      return res.status(400).json({ msg: 'Invalid reset code.' });
    }

    // Mark as verified
    resetData.verified = true;

    res.json({ msg: 'Code verified successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const resetData = resetCodes.get(email);

    if (!resetData || !resetData.verified) {
      return res.status(400).json({ msg: 'Invalid or expired reset session.' });
    }

    // Verify code again
    if (resetData.code !== code) {
      return res.status(400).json({ msg: 'Invalid reset code.' });
    }

    // Check if expired
    if (Date.now() > resetData.expiresAt) {
      resetCodes.delete(email);
      return res.status(400).json({ msg: 'Reset session has expired.' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Clean up reset code
    resetCodes.delete(email);

    res.json({ msg: 'Password reset successful.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Clean up expired codes every hour
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of resetCodes.entries()) {
    if (now > data.expiresAt) {
      resetCodes.delete(email);
    }
  }
}, 60 * 60 * 1000); // Run every hour