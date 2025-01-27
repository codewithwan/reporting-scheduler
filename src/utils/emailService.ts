import { sendEmail } from "./mailer";
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
