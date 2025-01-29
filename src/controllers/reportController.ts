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
} from "../services/reportService";
import { AuthenticatedRequest } from "../models/userModel";
import { sendEmailWithSignatureRequest, sendEmailWithFinalReport } from "../utils/emailService";
/**
 * Create a new report
 * @param {AuthenticatedRequest} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>}
 */
export const createNewReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { scheduleId, engineerId, customerId, serviceId, categoryId, problem, processingTimeStart, processingTimeEnd, reportDate, serviceStatus, attachmentUrl, status, engineer_sign, customeer_sign } = req.body;

  if (!scheduleId || !engineerId || !customerId || !serviceId || !problem || !processingTimeStart || !processingTimeEnd || !reportDate || !serviceStatus || !status) {
    res.status(400).json({ message: "Invalid input. Please provide all required fields." });
    return;
  }

  try {
    const report = await createReport({ scheduleId, engineerId, customerId, serviceId, categoryId, problem, processingTimeStart, processingTimeEnd, reportDate, serviceStatus, attachmentUrl, status, engineer_sign, customeer_sign });
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
    const { reportData, signature } = req.body;

    if (!signature) {
      res.status(400).json({ error: "Signature is required" });
      return;
    }

    const pdfPath = await signReport(reportData, signature);

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
    const { reportData, signature, customerEmail } = req.body;

    if (!signature) {
      res.status(400).json({ error: "Signature is required" });
      return;
    }

    if (!customerEmail) {
      res.status(400).json({ error: "Customer email is required" });
      return;
    }

    // Tanda tangan engineer terlebih dahulu
    const pdfPath = await signReport(reportData, signature);

    // Konversi PDF ke base64 untuk dikirim via email
    const pdfBase64 = Buffer.from(require("fs").readFileSync(pdfPath)).toString("base64");

    // Kirim email ke pelanggan
    await sendEmailWithSignatureRequest(customerEmail, reportData, pdfBase64);

    res.status(200).json({ message: "Email sent to customer for signature" });
  } catch (error) {
    console.error(error);
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