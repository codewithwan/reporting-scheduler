/**
 * Seed script to populate the database with initial data.
 * This script creates superadmin, admin, and engineer users,
 * schedules, and reminders for the schedules.
 */

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Main function to execute the seeding process.
 */
async function main() {
  try {
    // Create a superadmin user
    const superadmin = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: await bcrypt.hash('superadmin123', 10),
        role: 'SUPERADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create an admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin2@example.com', 
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create multiple engineer users
    const engineers = await Promise.all(
      Array.from({ length: 5 }).map(async (_, i) => {
        return prisma.user.create({
          data: {
            name: faker.person.fullName(),
            email: `engineer${i}@example.com`, 
            password: await bcrypt.hash('password123', 10),
            role: 'ENGINEER',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      })
    );

    // Create schedules and associated reminders by admin
    const schedules = await Promise.all(
      Array.from({ length: 3 }).map(async (_, i) => {
        const engineer = engineers[i % engineers.length]; 

        const schedule = await prisma.schedule.create({
          data: {
            taskName: faker.lorem.words(3),
            executeAt: faker.date.soon({ days: 15 }), // Schedule within the next 15 days
            status: 'PENDING',
            engineerId: engineer.id,
            adminId: admin.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        const reminders = [];
        reminders.push(
          await prisma.reminder.create({
            data: {
              scheduleId: schedule.id,
              reminderTime: new Date(schedule.executeAt.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days before
              status: 'PENDING',
              createdAt: new Date(),
            },
          })
        );

        reminders.push(
          await prisma.reminder.create({
            data: {
              scheduleId: schedule.id,
              reminderTime: new Date(schedule.executeAt.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day before
              status: 'PENDING',
              createdAt: new Date(),
            },
          })
        );

        return { schedule, reminders };
      })
    );

    console.log('Seeding complete:', { superadmin, admin, engineers, schedules });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error during seeding:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Execute the main function and handle disconnection and errors.
 */
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
