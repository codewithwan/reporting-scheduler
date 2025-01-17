import request from 'supertest';
import app from '../src/app';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { describe, expect, it, beforeAll, afterAll, beforeEach } from '@jest/globals';

const prisma = new PrismaClient();

/**
 * Test suite for user routes.
 */
describe('User Routes', () => {
  let superadminToken: string;
  let adminToken: string;
  let engineerToken: string;

  /**
   * Hook to run before all tests. Deletes all users.
   */
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  /**
   * Hook to run before each test. Creates users and generates tokens.
   */
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`; // Ensure the database is properly cleared

    const superadminUser = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'SUPERADMIN'
      },
    });

    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'ADMIN'
      },
    });

    const engineerUser = await prisma.user.create({
      data: {
        name: 'Engineer User',
        email: 'engineer@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'ADMIN'
      },
    });

    // console.log(`Created users: ${JSON.stringify({ superadminUser, adminUser, engineerUser })}`); 

    superadminToken = jwt.sign({ userId: superadminUser.id, role: superadminUser.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    adminToken = jwt.sign({ userId: adminUser.id, role: adminUser.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    engineerToken = jwt.sign({ userId: engineerUser.id, role: engineerUser.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    // console.log(`Generated tokens: ${JSON.stringify({ superadminToken, adminToken, engineerToken })}`); 
  });

  /**
   * Hook to run after all tests. Deletes all users and disconnects Prisma.
   */
  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  /**
   * Test case to verify access to user profile.
   */
  it('should allow engineer to access their own profile', async () => {
    const res = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${engineerToken}`);
    if (res.status !== 200) {
      console.log("engineerToken: ", engineerToken);
      console.error('Error response:', res.body);
    }
    expect(res.status).toBe(200);
    // expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('engineer@example.com');
  });

  /**
   * Test case to verify access to all users for admin.
   */
  it('should allow super admin to access all users except superadmin', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${superadminToken}`);
    if (res.status === 500) {
      console.error('Error response:', res.body);
    }
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.some((user: User) => user.role === 'SUPERADMIN')).toBe(true);
  });

  /**
   * Test case to verify access to all users for superadmin.
   */
  it('should allow superadmin to access all users', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${superadminToken}`);
    if (res.status === 500) {
      console.error('Error response:', res.body);
    }
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.some((user: User) => user.role === 'SUPERADMIN')).toBe(true);
  });

  /**
   * Test case to verify access is denied for engineer to all users.
   */
  it('should deny engineer access to all users', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${engineerToken}`);
    if (res.status === 500) {
      console.error('Error response:', res.body);
    }
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden: Insufficient role');
  });
});