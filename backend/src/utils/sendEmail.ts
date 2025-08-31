import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, text: string) => {
  // If no email service is configured, just log to console
  if (!process.env.SMTP_HOST && !process.env.SMTP_SERVICE) {
    console.log(`[sendEmail] No email service configured. To: ${to} | Subject: ${subject} | Text: ${text}`);
    return;
  }

  const hasService = !!process.env.SMTP_SERVICE;
  
  // Create transporter based on configuration
  const transporter = hasService
    ? nodemailer.createTransport({
        service: process.env.SMTP_SERVICE, // e.g. 'gmail'
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      })
    : nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

  try {
    console.log(`[sendEmail] Attempting to send email to: ${to}`);
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text
    });
    
    console.log(`[sendEmail] Email sent successfully to: ${to}`);
  } catch (err) {
    console.error('[sendEmail] Error occurred:', err);
    
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[sendEmail] Failed to send email in non-production, falling back to console log');
      console.log(`[sendEmail:FALLBACK] To: ${to} | Subject: ${subject} | Text: ${text}`);
      return;
    }
    
    // Re-throw error in production so the calling function can handle it
    throw err;
  }
};