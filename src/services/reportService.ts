import { PrismaClient } from "@prisma/client";
import { Report, CreateReportInput } from "../models/reportModel";
import { generatePDF } from "./pdfGenerator";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

const prisma = new PrismaClient();

/**
 * Create a new report
 */
export const createReport = async (data: CreateReportInput): Promise<Report> => {
  const engineer = await prisma.user.findUnique({ where: { id: data.engineerId } });
  const customer = await prisma.customer.findUnique({ where: { id: data.customerId } });

  if (!engineer || !customer) {
    throw new Error("Invalid engineer or customer ID");
  }

  const services = await prisma.service.findMany({
    where: { id: { in: data.serviceIds } },
  });

  if (services.length !== data.serviceIds.length) {
    throw new Error("Some service IDs are invalid");
  }

  const report = await prisma.report.create({
    data: {
      scheduleId: data.scheduleId,
      engineerId: data.engineerId,
      customerId: data.customerId,
      categoryId: data.categoryId,
      problem: data.problem,
      processingTimeStart: data.processingTimeStart,
      processingTimeEnd: data.processingTimeEnd,
      reportDate: data.reportDate,
      serviceStatus: data.serviceStatus,
      attachmentUrl: data.attachmentUrl ?? "",
      status: data.status,
      engineer_sign: data.engineer_sign,
      customeer_sign: data.customeer_sign,
      services: {
        create: data.serviceIds.map(serviceId => ({
          serviceId: serviceId, // Gunakan field serviceId, bukan service: { connect: { id } }
        })),
      },
    },
    include: { services: { include: { service: true } } },
  });

  return {
    ...report,
    serviceIds: report.services.map(rs => rs.service.id),
  };
};

/**
 * Get all reports
 */
export const getAllReports = async (): Promise<Report[]> => {
  const reports = await prisma.report.findMany({
    include: {
      engineer: true,
      customer: true,
      category: true,
      services: { include: { service: true } },
    },
  });

  return reports.map(report => ({
    ...report,
    serviceIds: report.services.map(rs => rs.service.id), // Tambahkan serviceIds secara manual
  }));
};

/**
 * Get reports by Engineer ID
 */
export const getReportByEngineerId = async (engineerId: string): Promise<Report[]> => {
  const reports = await prisma.report.findMany({
    where: { engineerId },
    include: {
      engineer: true,
      services: {include: {service : true}},
      customer: true,
      schedule: true,
      category: true,
    },
  });
  return reports.map(report => ({
    ...report,
    serviceIds: report.services.map(rs => rs.service.id), // Tambahkan serviceIds secara manual
  }));
};

/**
 * Get report by ID
 */
export const getReportById = async (id: string): Promise<Report | null> => {
  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      engineer: true,
      customer: true,
      category: true,
      services: { include: { service: true } },
    },
  });

  if (!report) return null;

  return {
    ...report,
    serviceIds: report.services.map(rs => rs.service.id),
  };
};

/**
 * Update a report
 */
export const updateReport = async (id: string, data: Partial<CreateReportInput>): Promise<Report> => {
  const updatedReport = await prisma.report.update({
    where: { id },
    data: {
      ...data,
      services: data.serviceIds
        ? {
            deleteMany: {}, // Hapus semua relasi lama
            create: data.serviceIds.map(serviceId => ({
              serviceId: serviceId,
            })),
          }
        : undefined,
    },
    include: { services: { include: { service: true } } },
  });

  return {
    ...updatedReport,
    serviceIds: updatedReport.services.map(rs => rs.service.id),
  };
};


/**
 * generate pdf
 */

export const generateReport = async (reportId: string): Promise<string> => {
  console.log("Generating Report PDF for:", reportId);

  const reportsDir = path.join(__dirname, "../reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const report = await prisma.report.findFirst({
    where: { id: reportId },
    include: {
      engineer: true,
      customer: { include: { products: true } },
      schedule: true,
      services: { include: { service: true } },
      category: true,
    },
  });

  if (!report) {
    throw new Error("Report not found!");
  }

  const reportData = {
    company_name: report.customer.company || "N/A",
    customer_name: report.customer.name,
    address: report.customer.address || "N/A",
    position: report.customer.position || "N/A",
    brand: report.customer.products.length > 0 ? report.customer.products[0].brand : "N/A",
    serial_number: report.customer.products.length > 0 ? report.customer.products[0].serialNumber : "N/A",
    model: report.customer.products.length > 0 ? report.customer.products[0].model : "N/A",
    problem: report.problem,
    engineer_name: report.engineer.name,
    date: report.schedule.startDate.toISOString().split("T")[0],
    time: report.schedule.startDate,
    detail_service: report.services.map(s => s.service.name).join(", "), // Gabungkan semua service
    service_category: report.category.name,
    engineer_signature: report.engineer_sign,
    customer_signature: report.customeer_sign,
  };

  const pdfPath = await generatePDF(reportId, reportData);

  console.log(`Generated report saved at: ${pdfPath}`);
  return pdfPath;
};

/**
 * generate engineer sign
*/

export const signReport = async (reportId: string, signatureBase64: string): Promise<string> => {
  console.log("Signing Report ID:", reportId);

  if (!reportId) {
    throw new Error("Report ID is missing!");
  }

  const reportsDir = path.join(__dirname, "../reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const reportPath = path.join(reportsDir, `${reportId}.pdf`);
  const signedReportPath = path.join(reportsDir, `${reportId}_signed.pdf`);

  // **Cek apakah laporan awal sudah dibuat**
  if (!fs.existsSync(reportPath)) {
    console.log(`Report PDF not found at: ${reportPath}, generating new one...`);
    await generateReport(reportId);
  }

  // Buka kembali PDF yang telah dibuat
  const existingPdfBytes = fs.readFileSync(reportPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Ambil halaman terakhir
  const pages = pdfDoc.getPages();
  const lastPage = pages[pages.length - 1];

  // Decode base64 signature dan tambahkan ke halaman terakhir
  const signatureBuffer = Buffer.from(signatureBase64, "base64");
  const signatureImage = await pdfDoc.embedPng(signatureBuffer);
  lastPage.drawImage(signatureImage, {
    x: 150,
    y: 200,
    width: 200,
    height: 100,
  });

  // Simpan laporan yang sudah ditandatangani
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(signedReportPath, pdfBytes);

  console.log(`Signed report saved at: ${signedReportPath}`);
  return signedReportPath;
};



export const addCustomerSignatureToReport = async (reportId: string, customerSignature: string): Promise<string> => {
  const reportPath = path.join(__dirname, `../reports/${reportId}.pdf`);
  const signedReportPath = path.join(__dirname, `../reports/${reportId}_signed.pdf`);

  if (!fs.existsSync(reportPath)) {
    throw new Error("Report not found!");
  }

  // Membaca laporan PDF lama
  const existingPdfBytes = fs.readFileSync(reportPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Ambil halaman terakhir
  const pages = pdfDoc.getPages();
  const lastPage = pages[pages.length - 1];

  // Decode base64 signature dan tambahkan ke halaman terakhir
  const signatureBuffer = Buffer.from(customerSignature, "base64");
  const signatureImage = await pdfDoc.embedPng(signatureBuffer);
  lastPage.drawImage(signatureImage, {
    x: 150,
    y: 200,
    width: 200,
    height: 100,
  });

  // Simpan laporan yang sudah ditandatangani
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(signedReportPath, pdfBytes);

  return signedReportPath;
};