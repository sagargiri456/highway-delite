import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, text: string) => {
  if (!process.env.SMTP_HOST && !process.env.SMTP_SERVICE) {
    console.log(`[sendEmail] To: ${to} | Subject: ${subject} | Text: ${text}`);
    return;
  }

  const hasService = !!process.env.SMTP_SERVICE;
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
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[sendEmail] Failed to send email in non-production, falling back to console log:', err);
      console.log(`[sendEmail:FALLBACK] To: ${to} | Subject: ${subject} | Text: ${text}`);
      return;
    }
    throw err;
  }
};
