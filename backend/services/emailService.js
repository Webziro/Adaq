const nodemailer = require('nodemailer');

// Create reusable transporter
let transporter;

const initializeTransporter = () => {
  // For Gmail
  if (process.env.EMAIL_SERVICE === 'gmail') {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Use App Password, not regular password
      }
    });
  }
  // For Outlook/Hotmail
  else if (process.env.EMAIL_SERVICE === 'outlook') {
    transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  // For custom SMTP (like SendGrid, Mailgun, etc.)
  else {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }
};

// Initialize transporter
initializeTransporter();

// Send password reset email
exports.sendPasswordResetEmail = async (email, resetCode, userName = 'User') => {
  try {
    const mailOptions = {
      from: {
        name: 'AdaQ - Plate Verification',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Password Reset Code - AdaQ',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
              color: white;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .code-box {
              background: white;
              border: 3px solid #4CAF50;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .code {
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #4CAF50;
              font-family: 'Courier New', monospace;
            }
            .content {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 AdaQ</h1>
              <p>Password Reset Request</p>
            </div>
            
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>We received a request to reset your password for your AdaQ account.</p>
              <p>Your password reset verification code is:</p>
            </div>
            
            <div class="code-box">
              <div class="code">${resetCode}</div>
              <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
                This code will expire in <strong>15 minutes</strong>
              </p>
            </div>
            
            <div class="content">
              <p><strong>To reset your password:</strong></p>
              <ol>
                <li>Go to the password reset page</li>
                <li>Enter this verification code</li>
                <li>Create your new password</li>
              </ol>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>This code expires in 15 minutes</li>
                <li>Never share this code with anyone</li>
                <li>AdaQ staff will never ask for your code</li>
                <li>If you didn't request this, ignore this email</li>
              </ul>
            </div>
            
            <div class="footer">
              <p><strong>AdaQ - Secure Plate Number Verification System</strong></p>
              <p>This is an automated message, please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} AdaQ. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        AdaQ - Password Reset Request
        
        Hello ${userName},
        
        We received a request to reset your password for your AdaQ account.
        
        Your password reset verification code is: ${resetCode}
        
        This code will expire in 15 minutes.
        
        To reset your password:
        1. Go to the password reset page
        2. Enter this verification code
        3. Create your new password
        
        Security Notice:
        - This code expires in 15 minutes
        - Never share this code with anyone
        - AdaQ staff will never ask for your code
        - If you didn't request this, ignore this email
        
        © ${new Date().getFullYear()} AdaQ - Secure Plate Number Verification System
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    console.log(`Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error;
  }
};

// Verify email configuration
exports.verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email service configuration error:', error.message);
    return false;
  }
};

// Send welcome email (bonus feature)
exports.sendWelcomeEmail = async (email, userName) => {
  try {
    const mailOptions = {
      from: {
        name: 'AdaQ - Plate Verification',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Welcome to AdaQ!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; }
            .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to AdaQ!</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>Thank you for registering with AdaQ - Your trusted Plate Number Verification System.</p>
              <p>Your account has been successfully created. You can now:</p>
              <ul>
                <li>Request new plate numbers</li>
                <li>Track your requests</li>
                <li>Manage your profile</li>
              </ul>
              <p>If you have any questions, feel free to contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
};