import request from 'supertest';
import app from '../src/app';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { describe, expect, it, beforeAll, afterAll, beforeEach } from '@jest/globals';

const prisma = new PrismaClient();

/**
 * Test suite for protected routes.
 */
describe('Protected Routes', () => {
  let superadminToken: string;
  let adminToken: string;
  let engineerToken: string;
  let engineerEmail: string;

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
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`; 
    
    const superadminUser = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: `superadmin${Date.now()}@example.com`,
        password: await bcrypt.hash('password123', 10),
        role: 'SUPERADMIN'
      },
    });

    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: `admin${Date.now()}@example.com`,
        password: await bcrypt.hash('password123', 10),
        role: 'ADMIN'
      },
    });

    engineerEmail = `engineer${Date.now()}@example.com`;
    const engineerUser = await prisma.user.create({
      data: {
        name: 'Engineer User',
        email: engineerEmail,
        password: await bcrypt.hash('password123', 10),
        role: 'ENGINEER'
      },
    });

    superadminToken = jwt.sign({ userId: superadminUser.id, role: superadminUser.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    adminToken = jwt.sign({ userId: adminUser.id, role: adminUser.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    engineerToken = jwt.sign({ userId: engineerUser.id, role: engineerUser.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
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
  it('should deny engineer to update their own profile', async () => {
    const engineerUser = await prisma.user.findUnique({
      where: { email: engineerEmail },
    });

    if (!engineerUser) {
      throw new Error('Engineer user not found');
    }

    engineerToken = jwt.sign({ userId: engineerUser.id, role: engineerUser.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    const res = await request(app)
      .put('/api/v1/protected/profile')
      .set('Authorization', `Bearer ${engineerToken}`)
      .send({
        name: 'Updated Engineer User',
        email: 'updated_engineer@example.com'
      });
    if (res.status !== 403) {
      console.log("engineerToken: ", engineerToken);
      console.error('Error response:', res.body);
    }
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden: Insufficient role');
  });

  /**
   * Test case to verify access to all users for admin.
   */
  it('should allow super admin to access all users except superadmin', async () => {
    const res = await request(app)
      .get('/api/v1/protected/users')
      .set('Authorization', `Bearer ${superadminToken}`);
    if (res.status === 500) {
      console.error('Error response:', res.body);
    }
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    const usersExcludingSuperadmin = res.body.filter((user: User) => user.role !== 'SUPERADMIN');
    expect(usersExcludingSuperadmin.some((user: User) => user.role === 'SUPERADMIN')).toBe(false);
  });

  /**
   * Test case to verify access to all users for superadmin.
   */
  it('should allow superadmin to access all users', async () => {
    const res = await request(app)
      .get('/api/v1/protected/users')
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
      .get('/api/v1/protected/users')
      .set('Authorization', `Bearer ${engineerToken}`);
    if (res.status === 500) {
      console.error('Error response:', res.body);
    }
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden: Insufficient role');
  });

  /**
   * Test case to verify access is denied if no token is provided.
   */
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/api/v1/protected');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token provided');
  });

  /**
   * Test case to verify access is denied if token is invalid.
   */
  it('should return 403 if token is invalid', async () => {
    const res = await request(app)
      .get('/api/v1/protected')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid or expired token');
  });

  /**
   * Test case to verify access is denied if user does not have the required role.
   */
  it('should return 403 if user does not have the required role', async () => {
    const res = await request(app)
      .get('/api/v1/protected/users')
      .set('Authorization', `Bearer ${engineerToken}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden: Insufficient role');
  });

  /**
   * Test case to verify access is granted if user has the required role.
   */
  it('should return 200 if user has the required role', async () => {
    const res = await request(app)
      .get('/api/v1/protected')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('You have access to this route');
  });

  /**
   * Test case to verify access is denied if token is expired.
   */
  it('should return 403 if token is expired', async () => {
    const expiredToken = jwt.sign({ userId: 'someUserId', role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '1ms' });
    await new Promise(resolve => setTimeout(resolve, 10)); 

    const res = await request(app)
      .get('/api/v1/protected')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid or expired token');
  });
});