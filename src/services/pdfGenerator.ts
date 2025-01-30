import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";

export const generatePDF = async (reportId: string, data: any, signatureBase64?: string): Promise<string> => {
  const templatePath = path.join(__dirname, "../templates/reportTemplate.html");
  let template = fs.readFileSync(templatePath, "utf-8");

  // Replace placeholders dengan data laporan
  for (const key in data) {
    template = template.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
  }

  // Pastikan folder "reports" ada
  const reportsDir = path.join(__dirname, "../reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Nama file yang sesuai dengan reportId
  const pdfPath = path.join(reportsDir, `${reportId}.pdf`);

  // Launch Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Load HTML ke dalam page
  await page.setContent(template, { waitUntil: "networkidle0" });

  // Generate PDF tanpa tanda tangan
  await page.pdf({ path: pdfPath, format: "A4", printBackground: true });

  await browser.close();

  console.log(`Generated report saved at: ${pdfPath}`);

  if (signatureBase64) {
    return await addSignatureToPDF(pdfPath, signatureBase64);
  }

  return pdfPath;
};


const addSignatureToPDF = async (pdfPath: string, signatureBase64: string): Promise<string> => {
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const signatureImage = await pdfDoc.embedPng(Buffer.from(signatureBase64, "base64"));
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  firstPage.drawImage(signatureImage, {
    x: 150, // Sesuaikan posisi tanda tangan
    y: 100, // Sesuaikan posisi tanda tangan
    width: 150,
    height: 50,
  });

  const signedPdfBytes = await pdfDoc.save();
  const signedPdfPath = pdfPath.replace("temp_", "signed_");
  fs.writeFileSync(signedPdfPath, signedPdfBytes);

  return signedPdfPath;
};
