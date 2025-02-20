import { Response } from "express";
import logger from "../utils/logger";
import { 
  createReport, 
  getAllReports, 
  getReportById, 
  updateReport, 
  generateReport,
  signReport, 
  addCustomerSignatureToReport,
  getReportByEngineerId,
  signReportWithBothSignatures,
  getEngineerSignature,
} from "../services/reportService";
import { AuthenticatedRequest } from "../models/userModel";
import { sendEmailWithSignatureRequest, sendEmailWithFinalReport } from "../utils/emailService";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Create a new report
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const createNewReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { scheduleId, engineerId, customerId, serviceIds, categoryId, problem, processingTimeStart, processingTimeEnd, reportDate, serviceStatus, attachmentUrl, status, engineer_sign, customeer_sign } = req.body;

  if (!scheduleId || !engineerId || !customerId || !serviceIds || !problem || !processingTimeStart || !processingTimeEnd || !reportDate || !serviceStatus || !status) {
    res.status(400).json({ message: "Invalid input. Please provide all required fields." });
    return;
  }

  try {
    const report = await createReport({ scheduleId, engineerId, customerId, serviceIds, categoryId, problem, processingTimeStart, processingTimeEnd, reportDate, serviceStatus, attachmentUrl, status, engineer_sign, customeer_sign });
    logger.info(`Report ${report.id} created successfully`);
    res.status(201).json(report);
  } catch (error) {
    logger.error("Failed to create report", { error });
    res.status(500).json({ message: "An unexpected error occurred while creating the report.", error: (error as Error).message });
  }
};

/**
 * Get all reports
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const getReports = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const reports = await getAllReports();
    if (!reports.length) {
      res.status(404).json({ message: "No reports found." });
      return;
    }
    res.status(200).json(reports);
  } catch (error) {
    logger.error("Failed to retrieve reports", { error });
    res.status(500).json({ message: "An unexpected error occurred while retrieving reports.", error: (error as Error).message });
  }
};

export const getReportsByEngineer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { engineerId } = req.params;

  try {
    const reports = await getReportByEngineerId(engineerId);
    if (!reports.length) {
      res.status(404).json({ message: "No reports found for this engineer." });
      return;
    }
    res.status(200).json(reports);
  } catch (error) {
    logger.error("Failed to retrieve reports by engineer", { error, engineerId });
    res.status(500).json({ message: "An unexpected error occurred while retrieving the reports.", error: (error as Error).message });
  }
};

/**
 * Get a report by ID
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const getReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const report = await getReportById(id);
    if (!report) {
      res.status(404).json({ message: "Report not found." });
      return;
    }
    res.status(200).json(report);
  } catch (error) {
    logger.error("Failed to retrieve report", { error, id });
    res.status(500).json({ message: "An unexpected error occurred while retrieving the report.", error: (error as Error).message });
  }
};

/**
 * Update a report
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const updateReportById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedReport = await updateReport(id, updateData);
    if (!updatedReport) {
      res.status(404).json({ message: "Update failed. Report not found." });
      return;
    }
    res.status(200).json(updatedReport);
  } catch (error) {
    logger.error("Failed to update report", { error, id });
    res.status(500).json({ message: "An unexpected error occurred while updating the report.", error: (error as Error).message });
  }
};

export const generateReportPreview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { reportId } = req.params;
    const pdfPath = await generateReport(reportId);
    
    res.download(pdfPath, "ReportService.pdf", (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Error generating PDF" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate report" });
  }
};
export const engineeringSign = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { reportId, signature } = req.body; // Pastikan reportId ada dalam body

    if (!reportId || !signature) {
      res.status(400).json({ error: "reportId and signature are required" });
      return;
    }

    const pdfPath = await signReport(reportId, signature);

    res.download(pdfPath, "Signed_Report.pdf", (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Error generating signed PDF" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to sign report" });
  }
};
export const sendEmailForCustomerSign = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { reportId, signature, customerEmail } = req.body;

    // **Tambahkan validasi agar error lebih jelas**
    if (!reportId) {
      res.status(400).json({ error: "Report ID is required" });
      return;
    }
    if (!signature) {
      res.status(400).json({ error: "Signature is required in request body" });
      return;
    }
    if (!customerEmail) {
      res.status(400).json({ error: "Customer email is required" });
      return;
    }

    console.log(`Processing request for Report ID: ${reportId}`);

    // Panggil fungsi untuk tanda tangan engineer
    const signedPdfPath = await signReport(reportId, signature);

    // Konversi PDF ke base64 untuk dikirim via email
    const pdfBase64 = Buffer.from(fs.readFileSync(signedPdfPath)).toString("base64");

    // Kirim email ke pelanggan
    await sendEmailWithSignatureRequest(customerEmail, reportId, pdfBase64);

    res.status(200).json({ message: "Email sent to customer for signature" });
  } catch (error) {
    console.error("Failed to send email for customer signature", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};


export const customerSignReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { reportId, customerSignature, customerEmail } = req.body;

    if (!reportId || !customerSignature || !customerEmail) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Menambahkan tanda tangan pelanggan ke dalam PDF laporan
    const signedPdfPath = await addCustomerSignatureToReport(reportId, customerSignature);

    // Kirim email ke pelanggan dan admin dengan laporan akhir
    await sendEmailWithFinalReport(customerEmail, signedPdfPath);

    res.status(200).json({ message: "Report signed successfully and email sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to sign report" });
  }
};

export const signReportDirectly = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { reportId, customerSignature } = req.body;
  const engineerId = req.user?.id;

  if (!reportId || !customerSignature) {
    res.status(400).json({ message: "Report ID and customer signature are required" });
    return;
  }

  try {
    // Verify the report belongs to the engineer
    const report = await prisma.report.findFirst({
      where: { 
        id: reportId,
        engineerId 
      }
    });

    if (!report) {
      res.status(404).json({ message: "Report not found or unauthorized" });
      return;
    }

    // Get engineer's stored signature
    const engineer = await prisma.user.findUnique({
      where: { id: engineerId }
    }) as any;

    if (!engineer?.signature) {
      res.status(400).json({ 
        message: "Engineer signature not found. Please upload your signature first" 
      });
      return;
    }

    // Generate the signed PDF with both signatures
    const signedPdfPath = await signReportWithBothSignatures(
      reportId,
      customerSignature
    );

    // Send the signed PDF
    res.download(signedPdfPath, "Signed_Report.pdf", (err) => {
      if (err) {
        logger.error("Error downloading signed report", { error: err });
        res.status(500).json({ message: "Error downloading signed report" });
      }
      // Optionally clean up the file after sending
      // fs.unlinkSync(signedPdfPath);
    });

  } catch (error) {
    logger.error("Failed to sign report", { error });
    res.status(500).json({ 
      message: "Failed to sign report", 
      error: (error as Error).message 
    });
  }
};
