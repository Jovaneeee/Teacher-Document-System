const nodemailer = require('nodemailer');

// Validate required environment variables
if (!process.env.SMTP_HOST) {
  console.warn('WARNING: SMTP_HOST environment variable is not set. Email sending will not work.');
}

if (!process.env.SMTP_PORT) {
  console.warn('WARNING: SMTP_PORT environment variable is not set. Email sending will not work.');
}

if (!process.env.SMTP_USER) {
  console.warn('WARNING: SMTP_USER environment variable is not set. Email sending will not work.');
}

if (!process.env.SMTP_PASSWORD) {
  console.warn('WARNING: SMTP_PASSWORD environment variable is not set. Email sending will not work.');
}

if (!process.env.EMAIL_FROM) {
  console.warn('WARNING: EMAIL_FROM environment variable is not set. Email sending will not work.');
}

/**
 * Create Gmail SMTP transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
}

/**
 * Send password reset email using Gmail SMTP
 * @param {string} email - Recipient email address
 * @param {string} resetUrl - Password reset URL with recovery token
 * @returns {Promise<void>}
 */
async function sendPasswordResetEmail(email, resetUrl) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.error('SMTP credentials not configured. Check SMTP_USER and SMTP_PASSWORD environment variables.');
    throw new Error('Email service not configured');
  }

  if (!process.env.EMAIL_FROM) {
    console.error('EMAIL_FROM environment variable not set.');
    throw new Error('Email service not configured');
  }

  const fromName = process.env.EMAIL_FROM_NAME || 'Teacher Document System';
  const fromEmail = process.env.EMAIL_FROM;

  const transporter = createTransporter();

  const mailOptions = {
    from: `${fromName} <${fromEmail}>`,
    to: email,
    subject: 'Reset your Teacher Document System password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 40px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #0F2A43;
            }
            .content {
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background-color: #0F2A43;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              font-weight: 600;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #0a1f33;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 12px;
              margin: 20px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Teacher Document System</div>
            </div>
            
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>We received a request to reset your password for your Teacher Document System administrator account.</p>
              
              <p>If you requested this change, click the button below to set a new password:</p>
              
              <a href="${resetUrl}" class="button">Reset Password</a>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #2563EB;">${resetUrl}</p>
              
              <div class="warning">
                <strong>Security Notice:</strong> This link will expire in 1 hour for your security.
              </div>
              
              <p>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message from the Teacher Document System.</p>
              <p>Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Teacher Document System - Password Reset Request

We received a request to reset your password for your Teacher Document System administrator account.

If you requested this change, visit the following link to set a new password:

${resetUrl}

This link will expire in 1 hour for your security.

If you did not request this password reset, please ignore this email. Your password will remain unchanged.

This is an automated message. Please do not reply.
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', email);
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    throw new Error('Failed to send password reset email');
  }
}

module.exports = {
  sendPasswordResetEmail
};
