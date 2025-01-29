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
  const schedule = await prisma.schedule.findUnique({ where: { id: data.scheduleId } });
  const service = await prisma.service.findUnique({ where: { id: data.serviceId } });

  if (!engineer || !customer || !schedule || !service) {
    throw new Error("Invalid engineer, customer, schedule, or service ID");
  }

  const report = await prisma.report.create({
    data: {
      scheduleId: data.scheduleId,
      engineerId: data.engineerId,
      customerId: data.customerId,
      serviceId: data.serviceId,
      problem: data.problem,
      processingTimeStart: data.processingTimeStart,
      processingTimeEnd: data.processingTimeEnd,
      reportDate: data.reportDate,
      serviceStatus: data.serviceStatus,
      attachmentUrl: data.attachmentUrl,
      status: data.status,
      categoryId: data.categoryId,
      engineer_sign: data.engineer_sign,
      customeer_sign: data.customeer_sign,
    },
  });

  return report;
};

/**
 * Get all reports
 */
export const getAllReports = async (): Promise<Report[]> => {
  return await prisma.report.findMany({
    include: {
      engineer: true,
      service: true,
      customer: true,
    }}
  );
};

/**
 * Get reports by Engineer ID
 */
export const getReportByEngineerId = async (engineerId: string): Promise<Report[]> => {
  return await prisma.report.findMany({
    where: { engineerId },
    include: {
      engineer: true,
      service: true,
      customer: true,
      schedule: true,
      category: true,
    },
  });
};

/**
 * Get report by ID
 */
export const getReportById = async (id: string): Promise<Report | null> => {
  return await prisma.report.findUnique({ 
    where: { id },
    include : {
      engineer: true,
      service: true,
      customer: true,
      category: true,
    }
  });
};

/**
 * Update a report
 */
export const updateReport = async (id: string, data: Partial<CreateReportInput>): Promise<Report> => {
  return await prisma.report.update({
    where: { id },
    data,
  });
};

/**
 * generate pdf
 */

export const generateReport = async (reportId: string): Promise<string> => {
  console.log("Report ID:", reportId);

  const report = await prisma.report.findFirst({
    where: { id : reportId }, // Pastikan id adalah string
    include: {
      engineer: true,
      customer: {include : {
        products : true
      }},
      schedule: true,
      service: true,
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
    date: report.schedule.executeAt.toISOString().split("T")[0],
    time: report.schedule.executeAt,
    detail_service: report.service.name || "N/A",
    service_category: report.category.name,
    engineer_signature: report.engineer_sign,
    customeer_signature: report.customeer_sign,
  };

  return await generatePDF(reportData);
};

/**
 * generate engineer sign
 */

export const signReport = async (reportData: any, signatureBase64: string): Promise<string> => {
  return await generatePDF(reportData, signatureBase64);
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