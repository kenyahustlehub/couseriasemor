const nodemailer = require('nodemailer');

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Generate a random 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email
async function sendVerificationEmail(email, code, fullName) {
  try {
    const mailOptions = {
      from: `"COUSERIASEMOR" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '🎓 Verify Your COUSERIASEMOR Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to COUSERIASEMOR! 🚀</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">
              Hi <strong>${fullName}</strong>,
            </p>
            
            <p style="font-size: 14px; color: #666; margin: 0 0 25px 0;">
              Thanks for registering! To complete your account setup, please verify your email address using the code below:
            </p>
            
            <div style="background: white; border: 2px solid #667eea; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <p style="margin: 0; color: #666; font-size: 12px; letter-spacing: 2px;">VERIFICATION CODE</p>
              <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">
                ${code}
              </p>
            </div>
            
            <p style="font-size: 13px; color: #999; margin: 20px 0 0 0;">
              This code expires in 15 minutes. If you didn't register, please ignore this email.
            </p>
          </div>
          
          <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">© 2024 COUSERIASEMOR. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">Learn. Grow. Succeed.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send verification email:`, error.message);
    return false;
  }
}

// Send welcome email after verification
async function sendWelcomeEmail(email, fullName) {
  try {
    const mailOptions = {
      from: `"COUSERIASEMOR" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to COUSERIASEMOR!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 8px; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Welcome Aboard! 🎉</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">
              Hi <strong>${fullName}</strong>,
            </p>
            
            <p style="font-size: 14px; color: #666; margin: 0 0 20px 0;">
              Your email has been verified! Your COUSERIASEMOR account is now active and ready to use.
            </p>
            
            <div style="background: white; border-left: 4px solid #f5576c; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <h3 style="margin: 0 0 10px 0; color: #333;">What's Next?</h3>
              <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
                <li style="margin: 8px 0;">Explore our coding courses</li>
                <li style="margin: 8px 0;">Join thousands of learners</li>
                <li style="margin: 8px 0;">Start your learning journey</li>
              </ul>
            </div>
            
            <p style="font-size: 14px; color: #666; margin: 25px 0 0 0;">
              <a href="https://couseriasemor.com" style="color: #f5576c; text-decoration: none; font-weight: bold;">Login to your dashboard →</a>
            </p>
          </div>
          
          <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">© 2024 COUSERIASEMOR. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">Learn. Grow. Succeed.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send welcome email:`, error.message);
    return false;
  }
}

module.exports = {
  generateVerificationCode,
  sendVerificationEmail,
  sendWelcomeEmail,
};
