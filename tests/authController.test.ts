import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';

const prisma = new PrismaClient();

/**
 * Test suite for authentication controller.
 */
describe('Auth Controller', () => {
  /**
   * Hook to run before all tests. Deletes all users.
   */
  beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`; // Ensure the database is properly cleared
    await prisma.user.create({
      data: {
        name: 'Login User',
        email: 'loginuser@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    });
  });

  /**
   * Hook to run after all tests. Deletes all users and disconnects Prisma.
   */
  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  /**
   * Test case to verify user registration.
   */
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe('testuser@example.com');
  });

  /**
   * Test case to verify registration fails for existing email.
   */
  it('should not register a user with an existing email', async () => {
    await prisma.user.create({
      data: {
        name: 'Existing User',
        email: 'existinguser@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'New User',
        email: 'existinguser@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email already in use');
  });

  /**
   * Test case to verify user login.
   */
  it('should login an existing user', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Login User',
        email: 'loginuser@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'loginuser@example.com',
        password: 'password123',
      });
    if (res.status !== 200) {
      console.error('Error response:', res.body);
    }
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');
    expect(res.body).toHaveProperty('token');
  });

  /**
   * Test case to verify login fails with incorrect password.
   */
  it('should not login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'loginuser@example.com',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
  });

  /**
   * Test case to verify login fails with non-existent email.
   */
  it('should not login with non-existent email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
  });

  /**
   * Test case to verify registration fails with weak password.
   */
  it('should not register a user with weak password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Weak Password User',
        email: 'weakpassword@example.com',
        password: '123',
      });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: 'Invalid value' }),
      ])
    );
  });

  /**
   * Test case to verify registration fails with invalid email.
   */
  it('should not register a user with invalid email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Invalid Email User',
        email: 'invalid-email',
        password: 'password123',
      });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: 'Invalid value' }),
      ])
    );
  });
});