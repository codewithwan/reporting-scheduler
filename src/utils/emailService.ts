import { sendEmail , transporter} from "./mailer";
import fs from "fs";
import path from "path";
import logger from "./logger";

/**
 * Send an email using a specified template.
 * @param {string} to - The recipient's email address
 * @param {string} subject - The subject of the email
 * @param {string} templateName - The name of the email template
 * @param {object} templateData - The data to replace placeholders in the template
 * @returns {Promise<void>}
 */
export const sendEmailWithTemplate = async (to: string, subject: string, templateName: string, templateData: any): Promise<void> => {
  try {
    const templatePath = path.join(__dirname, "../emailTemplates", `${templateName}.html`);
    let template = fs.readFileSync(templatePath, "utf-8");

    for (const key in templateData) {
      template = template.replace(new RegExp(`{{${key}}}`, "g"), templateData[key]);
    }

    await sendEmail({
      to,
      subject,
      text: template.replace(/<[^>]*>?/gm, ''), // Strip HTML tags for plain text version
      html: template,
    });
  } catch (error) {
    logger.error(`Failed to send email with template ${templateName}`, error);
    throw new Error("Failed to send email. Please try again later.");
  }
};

export const sendEmailWithSignatureRequest = async (
  customerEmail: string,
  reportData: any,
  pdfBase64: string
) : Promise<void> => {
  const signaturePageUrl = `https://your-frontend.com/signature/${reportData.id}`;

  const templatePath = path.join(__dirname, "../emailTemplates/customerSignatureRequest.html");
  let emailTemplate = fs.readFileSync(templatePath, "utf-8");

  emailTemplate = emailTemplate.replace("{{customer_name}}", reportData["customer_name"]);
  emailTemplate = emailTemplate.replace("{{signature_url}}", signaturePageUrl);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: "Laporan Service Anda - Tanda Tangan Diperlukan",
    html: emailTemplate,
    attachments: [
      {
        filename: "Service_Report.pdf",
        content: pdfBase64,
        encoding: "base64",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

export const sendEmailWithFinalReport = async (customerEmail: string, signedPdfPath: string) => {
  const adminEmail = "admin@example.com"; // Ganti dengan email admin yang benar

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: [customerEmail, adminEmail],
    subject: "Laporan Service Anda Telah Ditandatangani",
    text: "Laporan service Anda telah ditandatangani oleh pelanggan dan tersedia dalam lampiran.",
    attachments: [
      {
        filename: "Signed_Service_Report.pdf",
        path: signedPdfPath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
