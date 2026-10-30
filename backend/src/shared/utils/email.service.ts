import nodemailer, { Transporter } from 'nodemailer';
import { config } from '../../config/env';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter: Transporter | null = null;

  private static getTransporter(): Transporter {
    if (!this.transporter) {
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (smtpHost && smtpUser && smtpPass) {
        const isGmail = smtpHost.includes('gmail');
        this.transporter = nodemailer.createTransport(
          isGmail
            ? {
                service: 'gmail',
                auth: {
                  user: smtpUser,
                  pass: smtpPass.replace(/\s+/g, ''), // Strip spaces from Gmail app passwords
                },
              }
            : {
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: {
                  user: smtpUser,
                  pass: smtpPass,
                },
              }
        );
        console.log(`[EMAIL SERVICE] Configured SMTP transporter (${isGmail ? 'Gmail Service' : smtpHost})`);
      } else {
        // Fallback development transporter that logs to console
        this.transporter = nodemailer.createTransport({
          streamTransport: true,
          newline: 'windows',
          buffer: true,
        });
        console.log('[EMAIL SERVICE] No external SMTP credentials detected. Using console logger.');
      }
    }
    return this.transporter;
  }

  public static async sendPasswordResetEmail(email: string, resetLink: string): Promise<{ sent: boolean; previewLink?: string }> {
    const isSmtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .logo { font-size: 20px; font-weight: 700; color: #4f46e5; margin-bottom: 24px; display: inline-block; }
          h1 { font-size: 22px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 16px; }
          p { font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 20px 0; }
          .btn-container { text-align: center; margin: 30px 0; }
          .btn { background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; }
          .link-box { background: #f1f5f9; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 13px; color: #64748b; margin-top: 20px; }
          .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Superconsciousness</div>
          <h1>Reset Your Password</h1>
          <p>Hello,</p>
          <p>We received a request to reset the password for your account associated with <strong>${email}</strong>.</p>
          <p>Click the button below to choose a new password. For security reasons, this link is valid for <strong>1 hour</strong>.</p>
          <div class="btn-container">
            <a href="${resetLink}" class="btn" target="_blank">Reset Password</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your web browser:</p>
          <div class="link-box">${resetLink}</div>
          <div class="footer">
            If you did not request this password reset, please ignore this email or contact support. Your password will remain unchanged.
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Reset Your Password

Hello,

We received a request to reset the password for your account associated with ${email}.

To reset your password, visit the following link (valid for 1 hour):
${resetLink}

If you did not request this, please ignore this email.
    `;

    console.log('\n======================================================');
    console.log(`[PASSWORD RESET EMAIL DISPATCH]`);
    console.log(`To: ${email}`);
    console.log(`Reset Link: ${resetLink}`);
    console.log('======================================================\n');

    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Superconsciousness Platform" <no-reply@superconsciousness.internal>',
        to: email,
        subject: 'Reset your Superconsciousness password',
        text: textContent,
        html: htmlContent,
      });

      return {
        sent: true,
        previewLink: resetLink,
      };
    } catch (err) {
      console.error('[EMAIL ERROR] Failed to send email via SMTP:', err);
      // Return preview link so development flows never break
      return {
        sent: false,
        previewLink: resetLink,
      };
    }
  }

  public static async sendVerificationOtpEmail(
    email: string,
    otp: string
  ): Promise<{ sent: boolean; otp: string }> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
          .logo-bar { margin-bottom: 24px; }
          .logo-text { font-size: 20px; font-weight: 800; color: #172D53; }
          .logo-accent { color: #FF9800; }
          h1 { font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; }
          p { font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 18px 0; }
          .otp-badge { background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%); border: 2px dashed #FF9800; border-radius: 12px; padding: 18px 24px; text-align: center; margin: 24px 0; }
          .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #EA580C; margin: 0; }
          .otp-label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #9A3412; letter-spacing: 1px; margin-top: 6px; }
          .security-note { background: #F8FAFC; border-left: 4px solid #3B82F6; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #475569; margin: 20px 0; line-height: 1.5; }
          .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 28px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo-bar">
            <span class="logo-text">GLOBAL <span class="logo-accent">CONSULTANCY</span></span>
          </div>
          <h1>Verify Your Email Address</h1>
          <p>Hello,</p>
          <p>Thank you for registering with <strong>Global Consultancy</strong>. Please use the verification code below to verify your email address:</p>
          
          <div class="otp-badge">
            <div class="otp-code">${otp}</div>
            <div class="otp-label">One-Time Verification Code (Valid for 10 minutes)</div>
          </div>

          <div class="security-note">
            🔒 <strong>Security Warning:</strong> Never share this code with anyone. Our counsellors and advisors will never ask for your verification code.
          </div>

          <p>If you did not request this verification code, you can safely ignore this email.</p>
          
          <div class="footer">
            &copy; ${new Date().getFullYear()} Global Consultancy. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Global Consultancy - Email Verification

Your one-time email verification code is: ${otp}

This code is valid for 10 minutes.
If you did not request this verification code, please ignore this email.
    `;

    console.log('\n======================================================');
    console.log(`[EMAIL OTP VERIFICATION CODE DISPATCH]`);
    console.log(`To: ${email}`);
    console.log(`OTP Code: ${otp}`);
    console.log('======================================================\n');

    try {
      const transporter = this.getTransporter();
      const sendInfo = await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Global Consultancy" <krantishantveer@gmail.com>',
        to: email,
        subject: `Your Verification Code: ${otp} - Global Consultancy`,
        text: textContent,
        html: htmlContent,
      });
      console.log(`[EMAIL DISPATCH SUCCESS] Real email delivered to ${email}! MessageId: ${sendInfo.messageId}`);

      return { sent: true, otp };
    } catch (err) {
      console.error('[EMAIL ERROR] Failed to send email via SMTP:', err);
      return { sent: false, otp };
    }
  }
}
