import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/login?verify=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your Roof Leads Pro account',
    html: `
      <h1>Welcome to Roof Leads Pro!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    
    console.log(`[Email] Sending password reset email to ${email}`);
    console.log(`[Email] Reset URL: ${resetUrl}`);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Reset your Roof Leads Pro password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Password Reset Request</h1>
          <p>You requested to reset your password for your Roof Leads Pro account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="margin: 20px 0;">
            <a href="${resetUrl}" 
               style="background-color: #2563eb; color: white; padding: 10px 20px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            The Roof Leads Pro Team
          </p>
        </div>
      `,
    });

    console.log(`[Email] Password reset email sent successfully to ${email}`);
    console.log(`[Email] Message ID: ${info.messageId}`);
    
    return info;
  } catch (error) {
    console.error(`[Email] Failed to send password reset email to ${email}:`, error);
    throw new Error('Failed to send password reset email');
  }
} 