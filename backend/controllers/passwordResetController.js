const User = require('../models/User');
const bcrypt = require('bcryptjs');

// In-memory store for reset codes (in production, use Redis or database)
const resetCodes = new Map();

// Generate 6-digit code
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email input
    if (!email) {
      return res.status(400).json({ msg: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    
    // Always return success to prevent email enumeration
    // But only generate code if user exists
    if (user) {
      // Generate reset code
      const resetCode = generateResetCode();
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

      // Store reset code with expiration
      resetCodes.set(email, {
        code: resetCode,
        expiresAt,
        attempts: 0,
        verified: false
      });

      // Log to console for development
      console.log('=================================');
      console.log(`Password Reset Code for: ${email}`);
      console.log(`Code: ${resetCode}`);
      console.log(`Expires at: ${new Date(expiresAt).toLocaleTimeString()}`);
      console.log('=================================');
    }

    // Always return success message
    res.json({ 
      msg: 'If the email exists, a reset code has been sent.',
      success: true
    });

  } catch (err) {
    console.error('Password reset request error:', err.message);
    res.status(500).json({ msg: 'Server error. Please try again later.' });
  }
};

exports.verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    // Validate inputs
    if (!email || !code) {
      return res.status(400).json({ msg: 'Email and code are required.' });
    }

    const resetData = resetCodes.get(email);

    if (!resetData) {
      return res.status(400).json({ msg: 'Invalid or expired reset code.' });
    }

    // Check if code is expired
    if (Date.now() > resetData.expiresAt) {
      resetCodes.delete(email);
      return res.status(400).json({ msg: 'Reset code has expired. Please request a new one.' });
    }

    // Check attempts (max 5)
    if (resetData.attempts >= 5) {
      resetCodes.delete(email);
      return res.status(400).json({ msg: 'Too many failed attempts. Please request a new code.' });
    }

    // Verify code
    if (resetData.code !== code.trim()) {
      resetData.attempts += 1;
      resetCodes.set(email, resetData);
      return res.status(400).json({ 
        msg: `Invalid reset code. ${5 - resetData.attempts} attempts remaining.` 
      });
    }

    // Mark as verified
    resetData.verified = true;
    resetData.attempts = 0;
    resetCodes.set(email, resetData);

    console.log(`Code verified successfully for: ${email}`);

    res.json({ msg: 'Code verified successfully.', success: true });

  } catch (err) {
    console.error('Code verification error:', err.message);
    res.status(500).json({ msg: 'Server error. Please try again later.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    // Validate inputs
    if (!email || !code || !newPassword) {
      return res.status(400).json({ msg: 'All fields are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters long.' });
    }

    const resetData = resetCodes.get(email);

    if (!resetData || !resetData.verified) {
      return res.status(400).json({ msg: 'Invalid or expired reset session. Please start over.' });
    }

    // Verify code again for security
    if (resetData.code !== code.trim()) {
      return res.status(400).json({ msg: 'Invalid reset code.' });
    }

    // Check if expired
    if (Date.now() > resetData.expiresAt) {
      resetCodes.delete(email);
      return res.status(400).json({ msg: 'Reset session has expired. Please start over.' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      resetCodes.delete(email);
      return res.status(400).json({ msg: 'User not found.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Clean up reset code
    resetCodes.delete(email);

    console.log(`Password reset successful for: ${email}`);

    res.json({ msg: 'Password reset successful. You can now login with your new password.', success: true });

  } catch (err) {
    console.error('Password reset error:', err.message);
    res.status(500).json({ msg: 'Server error. Please try again later.' });
  }
};

// Clean up expired codes every 30 minutes
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [email, data] of resetCodes.entries()) {
    if (now > data.expiresAt) {
      resetCodes.delete(email);
      cleanedCount++;
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`Cleaned up ${cleanedCount} expired reset codes`);
  }
}, 30 * 60 * 1000); // Run every 30 minutes

// Export cleanup function for graceful shutdown
exports.cleanup = () => {
  clearInterval(cleanupInterval);
  resetCodes.clear();
};