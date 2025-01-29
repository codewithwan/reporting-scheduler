import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    // Seed Users
    const superadmin = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: "superadmin@example.com",
        password: await bcrypt.hash("superadmin123", 10),
        role: "SUPERADMIN",
      },
    });

    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        role: "ADMIN",
      },
    });

    const engineers = await Promise.all(
      Array.from({ length: 5 }).map(async (_, i) => {
        return prisma.user.create({
          data: {
            name: faker.person.fullName(),
            email: `engineer${i}@example.com`,
            password: await bcrypt.hash("password123", 10),
            role: "ENGINEER",
          },
        });
      })
    );

    // Seed Customers
    const customers = await Promise.all(
      Array.from({ length: 3 }).map(async () => {
        return prisma.customer.create({
          data: {
            name: faker.person.fullName(),
            company: faker.company.name(),
            position: faker.person.jobTitle(),
            email: faker.internet.email(),
            phoneNumber: faker.phone.number(),
            address: faker.location.streetAddress(),
          },
        });
      })
    );

    // Seed Products
    const products = await Promise.all(
      customers.map(async (customer) => {
        return prisma.product.create({
          data: {
            customerId: customer.id,
            brand: faker.company.name(),
            model: faker.vehicle.model(),
            serialNumber: faker.string.uuid(),
            description: faker.lorem.paragraph(),
          },
        });
      })
    );

    // Seed Services
const services = await Promise.all([
  prisma.service.create({
    data: {
      name: 'visual check',
    },
  }),
  prisma.service.create({
    data: {
      name: 'system check',
    },
  }),
]);

//seed category
const categorys = await Promise.all([
  prisma.category.create({
    data: {
      name: 'Service',
    }
  }),
  prisma.category.create({
    data: {
      name: 'Service',
    }
  }),
])

    // Seed Schedules
    const schedules = await Promise.all(
      customers.map(async (customer, index) => {
        return prisma.schedule.create({
          data: {
            customerId: customer.id,
            productId: products[index]?.id,
            taskName: faker.hacker.phrase(),
            executeAt: faker.date.future(),
            status: "PENDING",
            engineerId: engineers[index % engineers.length]?.id,
            adminId: admin.id,
            location: faker.location.streetAddress(),
            activity: faker.lorem.sentence(),
            adminName: admin.name,
            engineerName: engineers[index % engineers.length]?.name || "",
          },
        });
      })
    );

    // Seed Reports
    const reports = await Promise.all(
      schedules.map(async (schedule) => {
        return prisma.report.create({
          data: {
            scheduleId: schedule.id,
            engineerId: schedule.engineerId,
            customerId: schedule.customerId,
            problem: faker.lorem.paragraph(),
            processingTimeStart: faker.date.past(),
            processingTimeEnd: faker.date.recent(),
            reportDate: new Date(),
            serviceStatus: "UNFINISHED",
            attachmentUrl: faker.internet.url(),
            status: "DRAFT",
            categoryId: categorys[1].id,
            services: {
              create: [
                { service: { connect: { id: services[0].id } } }, // Tambahkan layanan ke report
                { service: { connect: { id: services[1].id } } },
              ],
            },
          },
        });
      })
    );
    
    // Seed Reminders
    const reminders = await Promise.all(
      schedules.map(async (schedule) => {
        return prisma.reminder.create({
          data: {
            scheduleId: schedule.id,
            reminderTime: faker.date.future(),
            status: "PENDING",
            email: faker.internet.email(),
            phoneNumber: faker.phone.number(),
          },
        });
      })
    );

    // Seed Log Activities
    const logActivities = await Promise.all(
      engineers.map(async (engineer) => {
        return prisma.logActivity.create({
          data: {
            userId: engineer.id,
            action: "LOGIN",
            description: `User ${engineer.name} logged in.`,
          },
        });
      })
    );

    // Seed Reschedule Requests
    const rescheduleRequests = await Promise.all(
      schedules.map(async (schedule) => {
        return prisma.rescheduleRequest.create({
          data: {
            scheduleId: schedule.id,
            requestedBy: schedule.engineerId,
            reason: faker.lorem.sentence(),
            newDate: faker.date.future(),
            status: "PENDING",
          },
        });
      })
    );

    console.log("Seeding complete", {
      superadmin,
      admin,
      engineers,
      customers,
      products,
      schedules,
      reports,
      reminders,
      rescheduleRequests,
    });
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
