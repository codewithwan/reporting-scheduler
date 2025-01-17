import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';

const prisma = new PrismaClient();

/**
 * Test suite for protected routes.
 */
describe('Protected Routes', () => {
  let adminToken: string;
  let engineerToken: string;

  /**
   * Hook to run before all tests. Creates users and generates tokens.
   */
  beforeAll(async () => {
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
        password: await bcrypt.hash('password123', 10)
      },
    });

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
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Invalid token');
  });

  /**
   * Test case to verify access is denied if user does not have the required role.
   */
  it('should return 403 if user does not have the required role', async () => {
    const res = await request(app)
      .get('/api/v1/protected')
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
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Invalid token');
  });
});