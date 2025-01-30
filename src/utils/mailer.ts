import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string; 
}

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE,
  port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 465, 
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html, 
  });
};

